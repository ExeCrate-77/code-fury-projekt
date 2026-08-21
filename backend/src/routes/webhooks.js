import express from 'express'
import { Router } from 'express'
import Stripe from 'stripe'
import { getAdminClient } from '../lib/supabase.js'

const router = Router()

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null

// Stripe webhook receiver — signature verification requires the raw body,
// so this route uses express.raw() (mounted before express.json in app.js)
router.post('/stripe', async (req, res) => {
  if (!stripe) return res.status(501).json({ error: 'Stripe is not configured' })

  let event
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      req.headers['stripe-signature'],
      process.env.STRIPE_WEBHOOK_SECRET,
    )
  } catch (err) {
    return res.status(400).json({ error: `Invalid signature: ${err.message}` })
  }

  const admin = getAdminClient()

  switch (event.type) {
    case 'invoice.paid': {
      const invoice = event.data.object
      await admin
        .from('payments')
        .insert({
          stripe_event_id: event.id,
          stripe_customer_id: invoice.customer,
          amount_paid: invoice.amount_paid,
          event_type: event.type,
        })
      break
    }
    case 'customer.subscription.deleted': {
      const subscription = event.data.object
      await admin
        .from('users')
        .update({ stripe_subscription_id: null })
        .eq('stripe_subscription_id', subscription.id)
      break
    }
  }

  res.json({ received: true })
})

export default router
