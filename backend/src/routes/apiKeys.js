import { Router } from 'express'
import { requireUser } from '../middleware/auth.js'
import { generateApiKey, hashApiKey } from '../middleware/apiKeyAuth.js'

const router = Router()
router.use(requireUser)

router.get('/', async (req, res) => {
  const { data, error } = await req.supabase
    .from('api_keys')
    .select('id, label, key_prefix, created_at, last_used_at')
    .eq('user_id', req.userId)
    .order('created_at', { ascending: false })

  if (error) return res.status(400).json({ error: error.message })
  res.json({ data })
})

router.post('/', async (req, res) => {
  const { label = 'default' } = req.body
  const rawKey = generateApiKey()

  const { data, error } = await req.supabase
    .from('api_keys')
    .insert({
      user_id: req.userId,
      label,
      key_hash: hashApiKey(rawKey),
      key_prefix: rawKey.slice(0, 12),
    })
    .select('id, label, key_prefix, created_at')
    .single()

  if (error) return res.status(400).json({ error: error.message })
  res.status(201).json({ data: { ...data, key: rawKey } })
})

router.delete('/:id', async (req, res) => {
  const { error } = await req.supabase
    .from('api_keys')
    .delete()
    .eq('id', req.params.id)
    .eq('user_id', req.userId)

  if (error) return res.status(400).json({ error: error.message })
  res.status(204).end()
})

export default router
