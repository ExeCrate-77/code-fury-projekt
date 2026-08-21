import { Router } from 'express'
import { requireUser } from '../middleware/auth.js'
import { getAdminClient } from '../lib/supabase.js'

const router = Router()
router.use(requireUser)

const AGENT_SELECT = `
  *,
  model:models(id, name, provider, model_name),
  skill:skills(id, name, system_prompt),
  agent_tools(tool:tools(*))
`

function shapeAgent(agent) {
  return {
    ...agent,
    tools: (agent.agent_tools || []).map((at) => at.tool).filter(Boolean),
    agent_tools: undefined,
  }
}

router.get('/', async (req, res) => {
  const { scope = 'marketplace' } = req.query
  let query = req.supabase
    .from('agents')
    .select(AGENT_SELECT)
    .order('created_at', { ascending: false })

  if (scope === 'mine') {
    query = query.eq('creator_id', req.userId)
  } else {
    query = query.or(`is_published.eq.true,creator_id.eq.${req.userId}`)
  }

  const { data, error } = await query
  if (error) return res.status(400).json({ error: error.message })
  res.json({ data: data.map(shapeAgent) })
})

router.get('/:id', async (req, res) => {
  const { data: agent, error } = await req.supabase
    .from('agents')
    .select(AGENT_SELECT)
    .eq('id', req.params.id)
    .or(`is_published.eq.true,creator_id.eq.${req.userId}`)
    .maybeSingle()

  if (error) return res.status(400).json({ error: error.message })
  if (!agent) return res.status(404).json({ error: 'Agent not found' })
  res.json({ data: shapeAgent(agent) })
})

router.post('/', async (req, res) => {
  const { name, description = null, model_id, skill_id, tool_ids = [], price_per_call = 0 } = req.body
  if (!name || !model_id || !skill_id) {
    return res.status(400).json({ error: 'name, model_id and skill_id are required' })
  }

  const supabase = req.supabase

  const { data: model } = await supabase.from('models').select('id').eq('id', model_id).maybeSingle()
  const { data: skill } = await supabase.from('skills').select('id').eq('id', skill_id).maybeSingle()
  if (!model) return res.status(400).json({ error: 'model_id does not reference an accessible model' })
  if (!skill) return res.status(400).json({ error: 'skill_id does not reference an accessible skill' })

  const { data: agent, error } = await supabase
    .from('agents')
    .insert({ name, description, model_id, skill_id, price_per_call, creator_id: req.userId })
    .select()
    .single()

  if (error) return res.status(400).json({ error: error.message })

  if (tool_ids.length > 0) {
    const { error: linkError } = await supabase
      .from('agent_tools')
      .insert(tool_ids.map((tool_id) => ({ agent_id: agent.id, tool_id })))
    if (linkError) return res.status(400).json({ error: linkError.message })
  }

  const { data: full } = await supabase.from('agents').select(AGENT_SELECT).eq('id', agent.id).single()
  res.status(201).json({ data: shapeAgent(full) })
})

router.put('/:id', async (req, res) => {
  const { name, description, model_id, skill_id, tool_ids, price_per_call } = req.body
  const updates = Object.fromEntries(
    Object.entries({ name, description, model_id, skill_id, price_per_call }).filter(([, v]) => v !== undefined),
  )

  const supabase = req.supabase

  let { data: agent, error } = await supabase
    .from('agents')
    .update(updates)
    .eq('id', req.params.id)
    .eq('creator_id', req.userId)
    .select()
    .maybeSingle()

  if (error) return res.status(400).json({ error: error.message })
  if (!agent) return res.status(404).json({ error: 'Agent not found' })

  if (Array.isArray(tool_ids)) {
    const { error: delError } = await supabase.from('agent_tools').delete().eq('agent_id', agent.id)
    if (delError) return res.status(400).json({ error: delError.message })

    if (tool_ids.length > 0) {
      const { error: linkError } = await supabase
        .from('agent_tools')
        .insert(tool_ids.map((tool_id) => ({ agent_id: agent.id, tool_id })))
      if (linkError) return res.status(400).json({ error: linkError.message })
    }
  }

  const { data: full } = await supabase.from('agents').select(AGENT_SELECT).eq('id', agent.id).single()
  res.json({ data: shapeAgent(full) })
})

router.post('/:id/publish', async (req, res) => {
  const { price_per_call } = req.body

  const { data: agent, error } = await req.supabase
    .from('agents')
    .update({
      is_published: true,
      ...(price_per_call !== undefined ? { price_per_call } : {}),
    })
    .eq('id', req.params.id)
    .eq('creator_id', req.userId)
    .select()
    .maybeSingle()

  if (error) return res.status(400).json({ error: error.message })
  if (!agent) return res.status(404).json({ error: 'Agent not found' })
  res.json({ data: agent })
})

router.post('/:id/unpublish', async (req, res) => {
  const { data: agent, error } = await req.supabase
    .from('agents')
    .update({ is_published: false })
    .eq('id', req.params.id)
    .eq('creator_id', req.userId)
    .select()
    .maybeSingle()

  if (error) return res.status(400).json({ error: error.message })
  if (!agent) return res.status(404).json({ error: 'Agent not found' })
  res.json({ data: agent })
})

router.delete('/:id', async (req, res) => {
  const admin = getAdminClient()
  await admin.from('agent_tools').delete().eq('agent_id', req.params.id)

  const { error } = await req.supabase
    .from('agents')
    .delete()
    .eq('id', req.params.id)
    .eq('creator_id', req.userId)

  if (error) return res.status(400).json({ error: error.message })
  res.status(204).end()
})

export default router
