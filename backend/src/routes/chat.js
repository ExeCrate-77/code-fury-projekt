import { Router } from 'express'
import { requireUser } from '../middleware/auth.js'
import { getAdminClient } from '../lib/supabase.js'
import { runAgent } from '../services/agentRunner.js'
import { recordUsage } from '../services/usage.js'

const router = Router()
router.use(requireUser)

// Homepage dynamic-persona chat: model/skill/tools swapped per request
router.post('/', async (req, res) => {
  const { message, history = [], model_id, skill_id, tool_ids = [] } = req.body
  if (!message) return res.status(400).json({ error: 'message is required' })
  if (!model_id || !skill_id) {
    return res.status(400).json({ error: 'model_id and skill_id are required' })
  }

  const admin = getAdminClient()

  const { data: model } = await admin.from('models').select('*').eq('id', model_id).maybeSingle()
  const { data: skill } = await admin.from('skills').select('*').eq('id', skill_id).maybeSingle()
  if (!model) return res.status(404).json({ error: 'Model not found' })
  if (!skill) return res.status(404).json({ error: 'Skill not found' })

  let tools = []
  if (tool_ids.length > 0) {
    const { data } = await admin.from('tools').select('*').in('id', tool_ids)
    tools = data || []
  }

  const startedAt = Date.now()
  const result = await runAgent({ model, skill, tools }, [{ role: 'user', content: message }], history)

  await recordUsage({
    agent_id: null,
    api_key_id: null,
    caller_id: req.userId,
    status: 'success',
    latency_ms: Date.now() - startedAt,
  })

  res.json({ data: { response: result.output, tool_calls: result.toolCalls } })
})

export default router
