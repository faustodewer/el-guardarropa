const LEMON_API_URL = 'https://api.lemonsqueezy.com/v1'

interface CheckoutSession {
  id: string
  attributes: {
    checkout_url: string
    created_at: string
    expires_at: string
  }
}

export async function createCheckoutSession(
  userId: string,
  email: string
): Promise<string | null> {
  const apiKey = import.meta.env.VITE_LEMON_SQUEEZY_API_KEY
  if (!apiKey) {
    console.warn('Lemon Squeezy API key not configured')
    return null
  }

  try {
    const response = await fetch(`${LEMON_API_URL}/checkouts`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        data: {
          type: 'checkouts',
          attributes: {
            checkout_data: {
              custom: {
                user_id: userId,
                email: email,
              },
            },
          },
          relationships: {
            store: {
              data: {
                type: 'stores',
                id: import.meta.env.VITE_LEMON_STORE_ID,
              },
            },
            variant: {
              data: {
                type: 'variants',
                id: import.meta.env.VITE_LEMON_PRODUCT_VARIANT_ID,
              },
            },
          },
        },
      }),
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const data = (await response.json()) as { data: CheckoutSession }
    return data.data.attributes.checkout_url
  } catch (error) {
    console.error('Lemon Squeezy checkout error:', error)
    return null
  }
}

export async function verifyWebhookSignature(
  body: string,
  signature: string
): Promise<boolean> {
  const secret = import.meta.env.VITE_LEMON_SQUEEZY_WEBHOOK_SECRET
  if (!secret) return false

  try {
    const encoder = new TextEncoder()
    const data = encoder.encode(body)
    const keyData = encoder.encode(secret)

    const key = await crypto.subtle.importKey('raw', keyData, { name: 'HMAC', hash: 'SHA-256' }, false, [
      'sign',
    ])
    const computed = await crypto.subtle.sign('HMAC', key, data)
    const computed_hex = Array.from(new Uint8Array(computed))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')

    return computed_hex === signature
  } catch (error) {
    console.error('Webhook verification error:', error)
    return false
  }
}
