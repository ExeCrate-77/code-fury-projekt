import { getAdminClient } from '../lib/supabase.js'

/**
 * Records every agent call for metering / billing reconciliation.
 */
export async function recordUsage({ agent_id, api_key_id, caller_id, status, latency_ms, amount = 0 }) {
  const admin = getAdminClient()
  const payload = {
    agent_id,
    api_key_id,
    caller_id,
    status,
    latency_ms,
    amount,
  }
  let { error } = await admin.from('usage_logs').insert(payload)
  // Existing Supabase projects may not have run the amount-column migration yet.
  // Preserve usage logging while they are on the legacy schema.
  if (error && /amount.*column|column.*amount|schema cache/i.test(error.message)) {
    const legacy = { ...payload }
    delete legacy.amount
    ;({ error } = await admin.from('usage_logs').insert(legacy))
  }
  if (error) console.error('Failed to record usage:', error.message)
}
