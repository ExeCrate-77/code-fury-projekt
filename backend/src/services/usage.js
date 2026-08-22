import { getAdminClient } from '../lib/supabase.js'

/**
 * Records every agent call for metering / billing reconciliation.
 */
export async function recordUsage({ agent_id, api_key_id, caller_id, status, latency_ms, amount = 0 }) {
  const { error } = await getAdminClient().from('usage_logs').insert({
    agent_id,
    api_key_id,
    caller_id,
    status,
    latency_ms,
    amount,
  })
  if (error) console.error('Failed to record usage:', error.message)
}
