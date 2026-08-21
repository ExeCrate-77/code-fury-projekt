import { Router } from 'express'
import { requireUser } from '../middleware/auth.js'

const router = Router()
router.use(requireUser)

router.get('/', async (req, res) => {
  const { scope = 'marketplace' } = req.query
  let query = req.supabase
    .from('models')
    .select('*')
    .order('created_at', { ascending: false })

  if (scope === 'mine') {
    query = query.eq('creator_id', req.userId)
  } else {
    query = query.or(`is_public.eq.true,creator_id.eq.${req.userId}`)
  }

  const { data, error } = await query
  if (error) return res.status(400).json({ error: error.message })
  res.json({ data: data.map(redactApiKey) })
})

router.get('/:id', async (req, res) => {
  const { data: model, error } = await req.supabase
    .from('models')
    .select('*')
    .eq('id', req.params.id)
    .or(`is_public.eq.true,creator_id.eq.${req.userId}`)
    .maybeSingle()

  if (error) return res.status(400).json({ error: error.message })
  if (!model) return res.status(404).json({ error: 'Model not found' })
  res.json({ data: redactApiKey(model) })
})

router.post('/', async (req, res) => {
  const { name, provider, base_url = null, api_key = null, model_name = null, is_public = false } = req.body
  if (!name || !provider) {
    return res.status(400).json({ error: 'name and provider are required' })
  }

  const { data, error } = await req.supabase
    .from('models')
    .insert({ name, provider, base_url, api_key, model_name, is_public, creator_id: req.userId })
    .select()
    .single()

  if (error) return res.status(400).json({ error: error.message })
  res.status(201).json({ data: redactApiKey(data) })
})

router.put('/:id', async (req, res) => {
  const { name, provider, base_url, api_key, model_name, is_public } = req.body
  const updates = Object.fromEntries(
    Object.entries({ name, provider, base_url, api_key, model_name, is_public }).filter(([, v]) => v !== undefined),
  )

  const { data, error } = await req.supabase
    .from('models')
    .update(updates)
    .eq('id', req.params.id)
    .eq('creator_id', req.userId)
    .select()
    .maybeSingle()

  if (error) return res.status(400).json({ error: error.message })
  if (!data) return res.status(404).json({ error: 'Model not found' })
  res.json({ data: redactApiKey(data) })
})

router.delete('/:id', async (req, res) => {
  const { error } = await req.supabase
    .from('models')
    .delete()
    .eq('id', req.params.id)
    .eq('creator_id', req.userId)

  if (error) return res.status(400).json({ error: error.message })
  res.status(204).end()
})

function redactApiKey(model) {
  const { api_key: _redacted, ...rest } = model
  return rest
}

export default router
