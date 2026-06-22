import { Handler } from '@netlify/functions'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || ''
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
const WEBHOOK_SECRET = process.env.VITE_LEMON_SQUEEZY_WEBHOOK_SECRET || ''

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

async function verifySignature(body: string, signature: string): Promise<boolean> {
  try {
    const hash = crypto.createHmac('sha256', WEBHOOK_SECRET).update(body).digest('hex')
    return hash === signature
  } catch {
    return false
  }
}

interface LemonWebhookPayload {
  meta: {
    event_name: string
    webhook_id: string
  }
  data: {
    id: string
    attributes: {
      status: string
      customer_email: string
      custom: {
        user_id?: string
        email?: string
      }
    }
  }
}

const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Method not allowed',
    }
  }

  const signature = event.headers['x-signature'] || ''
  const body = event.body || ''

  const isValid = await verifySignature(body, signature)
  if (!isValid) {
    console.error('Invalid webhook signature')
    return {
      statusCode: 401,
      body: 'Invalid signature',
    }
  }

  try {
    const payload: LemonWebhookPayload = JSON.parse(body)
    const eventName = payload.meta.event_name
    const order = payload.data
    const userId = order.attributes.custom?.user_id

    // Log webhook
    await supabase.from('payment_webhooks').insert({
      event_type: eventName,
      user_id: userId,
      lemon_squeezy_order_id: order.id,
      payload: payload,
      processed: false,
    })

    if (!userId) {
      console.warn('Webhook received but no user_id found')
      return {
        statusCode: 200,
        body: 'Webhook logged but no user_id',
      }
    }

    // Handle order events
    if (eventName === 'order_created' || eventName === 'order_completed') {
      const isPaid = order.attributes.status === 'paid'

      if (isPaid) {
        // Create or update subscription
        await supabase.from('subscriptions').upsert({
          user_id: userId,
          plan: 'premium',
          status: 'active',
          lemon_squeezy_order_id: order.id,
          updated_at: new Date().toISOString(),
        })

        console.log(`Premium subscription activated for user ${userId}`)
      }
    }

    // Handle refunds/cancellations
    if (eventName === 'order_refunded' || eventName === 'subscription_expired') {
      await supabase.from('subscriptions').update({
        plan: 'freemium',
        status: 'cancelled',
        updated_at: new Date().toISOString(),
      }).eq('user_id', userId)

      console.log(`Subscription cancelled for user ${userId}`)
    }

    // Mark webhook as processed
    await supabase.from('payment_webhooks').update({
      processed: true,
    }).eq('lemon_squeezy_order_id', order.id)

    return {
      statusCode: 200,
      body: 'Webhook processed successfully',
    }
  } catch (error) {
    console.error('Webhook processing error:', error)
    return {
      statusCode: 500,
      body: 'Internal server error',
    }
  }
}

export { handler }
