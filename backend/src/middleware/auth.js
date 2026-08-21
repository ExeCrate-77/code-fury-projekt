import { verifyCredentials, createContextClient } from '@supabase/server/core'

export async function requireUser(req, res, next) {
  const header = req.headers.authorization || ''
  const token = header.toLowerCase().startsWith('bearer ') ? header.slice(7) : null

  if (!token) {
    return res.status(401).json({ error: 'Missing bearer token' })
  }

  const { data: auth, error } = await verifyCredentials(
    { token, apikey: null },
    { auth: 'user' },
  )
  if (error) {
    return res.status(error.status || 401).json({ error: error.message })
  }

  req.auth = auth
  req.userId = auth.userClaims.id
  req.supabase = createContextClient({
    auth: { token: auth.token, keyName: auth.keyName },
  })
  next()
}
