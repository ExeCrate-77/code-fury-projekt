import { Router } from 'express'
import { requireUser } from '../middleware/auth.js'
import { getAdminClient } from '../lib/supabase.js'

const router = Router()
router.use(requireUser)

// Consumer ledger: calls and amount owed for the signed-in user's API keys.
router.get('/consumer', async (req, res) => {
  const admin = getAdminClient()
  const { data, error } = await admin
    .from('usage_logs')
    .select('id, agent_id, api_key_id, status, latency_ms, created_at, agents(name, price_per_call)')
    .eq('caller_id', req.userId)
    .order('created_at', { ascending: false })
    .limit(500)
  if (error) return res.status(400).json({ error: error.message })
  const rows = data || []
  res.json({ data: {
    calls: rows.length,
    successful_calls: rows.filter((row) => row.status === 'success').length,
    total_owed: rows.reduce((sum, row) => sum + Number(row.amount || 0), 0),
    usage: rows,
  } })
})

// Creator Portal: revenue, published agents, usage trends
router.get('/summary', async (req, res) => {
  const admin = getAdminClient()

  const { data: publishedAgents, error: agentsError } = await admin
    .from('agents')
    .select('id, name, price_per_call, created_at')
    .eq('creator_id', req.userId)
    .eq('is_published', true)

  if (agentsError) return res.status(400).json({ error: agentsError.message })

  const agentIds = (publishedAgents || []).map((a) => a.id)
  let calls = []
  if (agentIds.length > 0) {
    const { data: usageData, error: usageError } = await admin
      .from('usage_logs')
    .select('id, agent_id, created_at, status, latency_ms')
      .in('agent_id', agentIds)
    if (usageError) return res.status(400).json({ error: usageError.message })
    calls = usageData || []
  }

  const revenue = calls.reduce((sum, call) => {
    const agent = publishedAgents.find((a) => a.id === call.agent_id)
    return sum + (call.status === 'success' ? Number(call.amount ?? agent?.price_per_call ?? 0) : 0)
  }, 0)

  res.json({
    data: {
      published_agents: publishedAgents.length,
      total_calls: calls.length,
      successful_calls: calls.filter((c) => c.status === 'success').length,
      total_revenue: revenue,
    },
  })
})

router.get('/agents', async (req, res) => {
  const admin = getAdminClient()

  const { data: agents, error } = await admin
    .from('agents')
    .select('id, name, description, is_published, price_per_call, created_at')
    .eq('creator_id', req.userId)
    .order('created_at', { ascending: false })

  if (error) return res.status(400).json({ error: error.message })

  const agentIds = (agents || []).map((a) => a.id)
  let countsByAgent = {}
  if (agentIds.length > 0) {
    const { data: calls } = await admin
      .from('usage_logs')
      .select('agent_id, status')
      .in('agent_id', agentIds)

    countsByAgent = (calls || []).reduce((acc, call) => {
      acc[call.agent_id] = acc[call.agent_id] || { total: 0, successful: 0 }
      acc[call.agent_id].total += 1
      if (call.status === 'success') acc[call.agent_id].successful += 1
      return acc
    }, {})
  }

  res.json({
    data: (agents || []).map((agent) => ({
      ...agent,
      usage: countsByAgent[agent.id] || { total: 0, successful: 0 },
      revenue: (countsByAgent[agent.id]?.successful || 0) * Number(agent.price_per_call || 0),
    })),
  })
})

router.get('/usage', async (req, res) => {
  const { agent_id, days = 30 } = req.query
  const admin = getAdminClient()

  const since = new Date(Date.now() - Number(days) * 24 * 60 * 60 * 1000).toISOString()

  let query = admin
    .from('usage_logs')
    .select('id, agent_id, status, latency_ms, created_at')
    .gte('created_at', since)
    .order('created_at', { ascending: true })

  if (agent_id) {
    const { data: agent } = await admin
      .from('agents')
      .select('id, creator_id')
      .eq('id', agent_id)
      .maybeSingle()
    if (!agent || agent.creator_id !== req.userId) {
      return res.status(404).json({ error: 'Agent not found' })
    }
    query = query.eq('agent_id', agent_id)
  } else {
    const { data: myAgents } = await admin
      .from('agents')
      .select('id')
      .eq('creator_id', req.userId)
    const ids = (myAgents || []).map((a) => a.id)
    if (ids.length === 0) return res.json({ data: [] })
    query = query.in('agent_id', ids)
  }

  const { data, error } = await query
  if (error) return res.status(400).json({ error: error.message })
  res.json({ data })
})

export default router
