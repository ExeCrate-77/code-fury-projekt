import crypto from 'node:crypto'
import { getAdminClient } from '../lib/supabase.js'

export function hashApiKey(key) {
  return crypto.createHash('sha256').update(key).digest('hex')
}

export function generateApiKey() {
  return 'amk_' + crypto.randomBytes(24).toString('hex')
}

export async function requireApiKey(req, res, next) {
  const key = req.headers['x-api-key']
  if (!key) {
    return res.status(401).json({ error: 'Missing x-api-key header' })
  }

  const { data: apiKey, error } = await getAdminClient()
    .from('api_keys')
    .select('*')
    .eq('key_hash', hashApiKey(key))
    .maybeSingle()

  if (error) return res.status(500).json({ error: error.message })
  if (!apiKey) return res.status(401).json({ error: 'Invalid API key' })

  req.apiKey = apiKey
  req.userId = apiKey.user_id
  next()
}
