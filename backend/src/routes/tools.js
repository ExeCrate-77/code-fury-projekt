import { Router } from 'express'
import { requireUser } from '../middleware/auth.js'

const router = Router()
router.use(requireUser)

const VALID_TOOL_TYPES = ['code_execution', 'web_scraping', 'web_search', 'custom']

router.get('/', async (req, res) => {
  const { scope = 'marketplace' } = req.query
  let query = req.supabase
    .from('tools')
    .select('*')
    .order('created_at', { ascending: false })

  if (scope === 'mine') {
    query = query.eq('creator_id', req.userId)
  } else {
    query = query.or(`is_public.eq.true,creator_id.eq.${req.userId}`)
  }

  const { data, error } = await query
  if (error) return res.status(400).json({ error: error.message })
  res.json({ data })
})

router.get('/:id', async (req, res) => {
  const { data: tool, error } = await req.supabase
    .from('tools')
    .select('*')
    .eq('id', req.params.id)
    .or(`is_public.eq.true,creator_id.eq.${req.userId}`)
    .maybeSingle()

  if (error) return res.status(400).json({ error: error.message })
  if (!tool) return res.status(404).json({ error: 'Tool not found' })
  res.json({ data: tool })
})

router.post('/', async (req, res) => {
  const { name, tool_type, schema_config = {}, is_public = false } = req.body
  if (!name || !tool_type) {
    return res.status(400).json({ error: 'name and tool_type are required' })
  }
  if (!VALID_TOOL_TYPES.includes(tool_type)) {
    return res.status(400).json({ error: `tool_type must be one of: ${VALID_TOOL_TYPES.join(', ')}` })
  }

  const { data, error } = await req.supabase
    .from('tools')
    .insert({ name, tool_type, schema_config, is_public, creator_id: req.userId })
    .select()
    .single()

  if (error) return res.status(400).json({ error: error.message })
  res.status(201).json({ data })
})

router.put('/:id', async (req, res) => {
  const { name, tool_type, schema_config, is_public } = req.body
  if (tool_type && !VALID_TOOL_TYPES.includes(tool_type)) {
    return res.status(400).json({ error: `tool_type must be one of: ${VALID_TOOL_TYPES.join(', ')}` })
  }

  const updates = Object.fromEntries(
    Object.entries({ name, tool_type, schema_config, is_public }).filter(([, v]) => v !== undefined),
  )

  const { data, error } = await req.supabase
    .from('tools')
    .update(updates)
    .eq('id', req.params.id)
    .eq('creator_id', req.userId)
    .select()
    .maybeSingle()

  if (error) return res.status(400).json({ error: error.message })
  if (!data) return res.status(404).json({ error: 'Tool not found' })
  res.json({ data })
})

router.delete('/:id', async (req, res) => {
  const { error } = await req.supabase
    .from('tools')
    .delete()
    .eq('id', req.params.id)
    .eq('creator_id', req.userId)

  if (error) return res.status(400).json({ error: error.message })
  res.status(204).end()
})

export default router
