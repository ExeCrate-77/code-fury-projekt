import Stripe from 'stripe'

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null

/**
 * Reports one metered unit to Stripe for a paid agent call.
 * The agent row can carry stripe_subscription_item_id (set when the buyer
 * subscribes); free agents and missing config are no-ops.
 */
export async function reportMeteredUsage(agent, apiKey) {
  if (!stripe) return
  if (!Number(agent.price_per_call)) return

  const subscriptionItemId = agent.stripe_subscription_item_id
  if (!subscriptionItemId) return

  try {
    await stripe.subscriptionItems.createUsageRecord(subscriptionItemId, {
      quantity: 1,
      timestamp: Math.floor(Date.now() / 1000),
      action: 'increment',
    })
  } catch (err) {
    console.error(
      `Stripe usage report failed for agent ${agent.id} / key ${apiKey.id}:`,
      err.message,
    )
  }
}
