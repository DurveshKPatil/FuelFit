import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
  typescript: true,
})

export async function createCheckoutSession(params: {
  lineItems: Array<{
    price_data: {
      currency: string
      product_data: {
        name: string
        images?: string[]
      }
      unit_amount: number
    }
    quantity: number
  }>
  successUrl: string
  cancelUrl: string
  customerEmail?: string
  metadata?: Record<string, string>
  mode?: 'payment' | 'subscription'
  subscriptionPriceId?: string
}) {
  const line_items = params.mode === 'subscription' && params.subscriptionPriceId
    ? [{ price: params.subscriptionPriceId, quantity: 1 }]
    : params.lineItems

  const session = await stripe.checkout.sessions.create({
    mode: params.mode || 'payment',
    line_items,
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    customer_email: params.customerEmail,
    metadata: params.metadata,
  })

  return session
}

export async function getCustomerPortalUrl(customerId: string) {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/account`,
  })
  return session.url
}