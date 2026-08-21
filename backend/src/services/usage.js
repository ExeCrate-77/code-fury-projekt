import { getAdminClient } from '../lib/supabase.js'

/**
 * Records every agent call for metering / billing reconciliation.
 */
export async function recordUsage({ agent_id, api_key_id, caller_id, status, latency_ms }) {
  const { error } = await getAdminClient().from('usage_logs').insert({
    agent_id,
    api_key_id,
    caller_id,
    status,
    latency_ms,
  })
  if (error) console.error('Failed to record usage:', error.message)
}
