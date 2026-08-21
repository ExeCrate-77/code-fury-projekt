import { Router } from 'express'
import { requireUser } from '../middleware/auth.js'

const router = Router()
router.use(requireUser)

router.get('/', async (req, res) => {
  const { scope = 'marketplace' } = req.query
  let query = req.supabase
    .from('skills')
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
  const { data: skill, error } = await req.supabase
    .from('skills')
    .select('*')
    .eq('id', req.params.id)
    .or(`is_public.eq.true,creator_id.eq.${req.userId}`)
    .maybeSingle()

  if (error) return res.status(400).json({ error: error.message })
  if (!skill) return res.status(404).json({ error: 'Skill not found' })
  res.json({ data: skill })
})

router.post('/', async (req, res) => {
  const { name, system_prompt, is_public = false } = req.body
  if (!name || !system_prompt) {
    return res.status(400).json({ error: 'name and system_prompt are required' })
  }

  const { data, error } = await req.supabase
    .from('skills')
    .insert({ name, system_prompt, is_public, creator_id: req.userId })
    .select()
    .single()

  if (error) return res.status(400).json({ error: error.message })
  res.status(201).json({ data })
})

router.put('/:id', async (req, res) => {
  const { name, system_prompt, is_public } = req.body
  const updates = Object.fromEntries(
    Object.entries({ name, system_prompt, is_public }).filter(([, v]) => v !== undefined),
  )

  const { data, error } = await req.supabase
    .from('skills')
    .update(updates)
    .eq('id', req.params.id)
    .eq('creator_id', req.userId)
    .select()
    .maybeSingle()

  if (error) return res.status(400).json({ error: error.message })
  if (!data) return res.status(404).json({ error: 'Skill not found' })
  res.json({ data })
})

router.delete('/:id', async (req, res) => {
  const { error } = await req.supabase
    .from('skills')
    .delete()
    .eq('id', req.params.id)
    .eq('creator_id', req.userId)

  if (error) return res.status(400).json({ error: error.message })
  res.status(204).end()
})

export default router
