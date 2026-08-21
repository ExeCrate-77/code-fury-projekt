import { createAdminClient, createContextClient } from '@supabase/server/core'

let adminClient = null

export function getAdminClient() {
  if (!adminClient) adminClient = createAdminClient()
  return adminClient
}

export function getUserClient(token, keyName) {
  return createContextClient({ auth: { token, keyName } })
}
