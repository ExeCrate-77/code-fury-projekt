import { Router } from 'express'
import { requireApiKey } from '../middleware/apiKeyAuth.js'
import { getAdminClient } from '../lib/supabase.js'
import { runAgent } from '../services/agentRunner.js'
import { recordUsage } from '../services/usage.js'
import { reportMeteredUsage } from '../services/billing.js'

const router = Router()

// Public metered API gateway — authenticated by platform API key
router.post('/:id/execute', requireApiKey, async (req, res) => {
  const admin = getAdminClient()

  const { data: agent, error } = await admin
    .from('agents')
    .select('*, model:models(*), skill:skills(*), agent_tools(tool:tools(*))')
    .eq('id', req.params.id)
    .maybeSingle()

  if (error) return res.status(500).json({ error: error.message })
  if (!agent) return res.status(404).json({ error: 'Agent not found' })
  if (!agent.is_published) return res.status(403).json({ error: 'Agent is not published' })

  const { input, message, history = [] } = req.body
  const userMessage = input || message
  if (!userMessage) return res.status(400).json({ error: 'input (or message) is required' })

  const tools = (agent.agent_tools || []).map((at) => at.tool).filter(Boolean)
  const config = { model: agent.model, skill: agent.skill, tools }

  const startedAt = Date.now()
  const result = await runAgent(config, [{ role: 'user', content: userMessage }], history)
  const latencyMs = Date.now() - startedAt

  await recordUsage({
    agent_id: agent.id,
    api_key_id: req.apiKey.id,
    caller_id: req.apiKey.user_id,
    status: 'success',
    latency_ms: latencyMs,
  })

  await reportMeteredUsage(agent, req.apiKey)

  await admin
    .from('api_keys')
    .update({ last_used_at: new Date().toISOString() })
    .eq('id', req.apiKey.id)

  res.json({
    data: {
      agent_id: agent.id,
      response: result.output,
      tool_calls: result.toolCalls,
      price_per_call: agent.price_per_call,
    },
  })
})

export default router
