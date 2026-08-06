import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import type Stripe from 'stripe'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { rateLimit, getClientIp } from '@/lib/rate-limit'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  const rl = rateLimit({ key: `webhook:${getClientIp(req)}`, windowMs: 60_000, max: 120 })
  if (rl.limited) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  const body = await req.text()
  const signature = headers().get('stripe-signature')

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session)
        break
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription)
        break
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription)
        break
      default:
        console.log('Unhandled event type:', event.type)
    }
    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook handler error:', error)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const lineItems = await stripe.checkout.sessions.listLineItems(session.id)
  const metadata = session.metadata || {}
  const userId = metadata.userId === 'guest' ? null : metadata.userId

  let shippingAddress = null
  let billingAddress = null
  try {
    shippingAddress = metadata.shippingAddress ? JSON.parse(metadata.shippingAddress) : null
    billingAddress = metadata.billingAddress ? JSON.parse(metadata.billingAddress) : null
  } catch {
    shippingAddress = null
    billingAddress = null
  }

  const email = session.customer_email || session.customer_details?.email || ''
  let user = userId ? await prisma.user.findUnique({ where: { id: userId } }) : null
  if (!user && email) {
    user = await prisma.user.findUnique({ where: { email } })
  }
  if (!user && email) {
    user = await prisma.user.create({
      data: {
        email,
        name: session.customer_details?.name || email.split('@')[0],
      },
    })
  }
  if (!user) {
    console.error('No user found for checkout session', session.id)
    return
  }

  const items = lineItems.data.map((item) => ({
    productId: null as string | null,
    name: item.description || 'Product',
    quantity: item.quantity || 1,
    price: (item.amount_total || 0) / 100,
  }))

  const productIds = items.map((i) => i.productId).filter(Boolean)
  const products = productIds.length
    ? await prisma.product.findMany({ where: { id: { in: productIds as string[] } } })
    : []

  const totalAmount = (session.amount_total || 0) / 100
  const shipping = (session.shipping_cost?.amount_total || 0) / 100
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const tax = Math.max(0, totalAmount - shipping - subtotal)

  await prisma.order.create({
    data: {
      userId: user.id,
      email: email || user.email,
      status: 'CONFIRMED',
      subtotal,
      tax,
      shipping,
      total: totalAmount,
      stripePaymentId: (session.payment_intent as string) || session.id,
      shippingAddress,
      billingAddress,
      items: {
        create: items.map((item) => ({
          productId: item.productId || products[0]?.id || 'unknown',
          quantity: item.quantity,
          price: item.price,
        })),
      },
    },
  })

  if (session.mode === 'subscription' && session.subscription) {
    const sub = await stripe.subscriptions.retrieve(session.subscription as string)
    await prisma.subscription.create({
      data: {
        userId: user.id,
        productId: products[0]?.id || 'unknown',
        stripeSubscriptionId: sub.id,
        stripePriceId: sub.items.data[0]?.price.id || '',
        status: 'ACTIVE',
        interval: sub.items.data[0]?.price.recurring?.interval || 'month',
        quantity: sub.items.data[0]?.quantity || 1,
        currentPeriodEnd: new Date(sub.current_period_end * 1000),
      },
    })
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const existing = await prisma.subscription.findUnique({
    where: { stripeSubscriptionId: subscription.id },
  })
  if (!existing) return

  const statusMap: Record<string, any> = {
    active: 'ACTIVE',
    past_due: 'PAST_DUE',
    canceled: 'CANCELLED',
    paused: 'PAUSED',
    incomplete: 'PAUSED',
    incomplete_expired: 'CANCELLED',
    trialing: 'ACTIVE',
    unpaid: 'PAST_DUE',
  }

  await prisma.subscription.update({
    where: { id: existing.id },
    data: {
      status: (statusMap[subscription.status] || existing.status) as any,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    },
  })
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  await prisma.subscription.updateMany({
    where: { stripeSubscriptionId: subscription.id },
    data: { status: 'CANCELLED' },
  })
}