import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { rateLimit, getClientIp } from '@/lib/rate-limit'
import { assertSameOrigin, isStripeConfigured } from '@/lib/security'
import { checkoutSchema } from '@/lib/validation'
import { products as seedProducts } from '@/lib/seed-data'

export const dynamic = 'force-dynamic'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

interface ResolvedProduct {
  id: string
  name: string
  images: string[]
  price: number
  inventory: number
}

async function resolveProducts(ids: string[]): Promise<(ResolvedProduct | null)[]> {
  let dbById = new Map<string, any>()
  try {
    const db = await prisma.product.findMany({ where: { id: { in: ids }, isActive: true } })
    dbById = new Map(db.map((p) => [p.id, p]))
  } catch {
    dbById = new Map()
  }

  return ids.map((id) => {
    const fromDb = dbById.get(id)
    if (fromDb) {
      return {
        id: fromDb.id,
        name: fromDb.name,
        images: fromDb.images || [],
        price: Number(fromDb.price),
        inventory: fromDb.inventory,
      }
    }

    const seedIdx = id.startsWith('seed-') ? parseInt(id.slice(5), 10) : -1
    let seed = seedIdx >= 0 && seedIdx < seedProducts.length ? seedProducts[seedIdx] : null
    if (!seed) seed = seedProducts.find((p) => p.slug === id) || null

    if (seed) {
      return {
        id,
        name: seed.name,
        images: seed.images || [],
        price: Number(seed.price),
        inventory: seed.inventory,
      }
    }

    return null
  })
}

async function createOrder({
  userId,
  email,
  items,
  shippingAddress,
  total,
}: {
  userId: string
  email: string
  items: { productId: string; name: string; quantity: number; price: number }[]
  shippingAddress: Record<string, any> | null
  total: number
}) {
  await prisma.order.create({
    data: {
      userId,
      email,
      status: 'CONFIRMED',
      subtotal: total,
      tax: 0,
      shipping: 0,
      total,
      stripePaymentId: `demo_${Date.now()}`,
      shippingAddress: shippingAddress ?? {},
      billingAddress: shippingAddress ?? {},
      items: {
        create: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
      },
    },
  })
}

export async function POST(req: Request) {
  try {
    if (!assertSameOrigin(req)) {
      return NextResponse.json({ error: 'Invalid request origin' }, { status: 403 })
    }

    const rl = rateLimit({ key: `checkout:${getClientIp(req)}`, windowMs: 60_000, max: 20 })
    if (rl.limited) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        {
          status: 429,
          headers: { 'Retry-After': String(Math.ceil(rl.retryAfterMs / 1000)) },
        }
      )
    }

    const session = await getServerSession(authOptions)
    const body = await req.json()

    const parsed = checkoutSchema.safeParse(body)
    if (!parsed.success) {
      const firstError = parsed.error.errors[0]?.message || 'Invalid checkout data'
      return NextResponse.json({ error: firstError }, { status: 400 })
    }

    const { items, email, shippingAddress, subscription } = parsed.data

    const resolved = await resolveProducts(items.map((i) => i.productId))
    const lineItems: any[] = []

    for (let idx = 0; idx < items.length; idx++) {
      const item = items[idx]
      const product = resolved[idx]
      if (!product) {
        return NextResponse.json({ error: 'Product not found. Refresh your cart and try again.' }, { status: 400 })
      }
      if (product.inventory < item.quantity) {
        return NextResponse.json(
          { error: `${product.name} is out of stock or exceeds available inventory` },
          { status: 400 }
        )
      }
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: product.name,
            images: product.images[0] ? [product.images[0] + '?w=600&h=600&fit=crop'] : [],
          },
          unit_amount: Math.round(product.price * 100),
        },
        quantity: item.quantity,
      })
    }

    const customerEmail = (session?.user?.email || email || '').toLowerCase()

    if (!isStripeConfigured()) {
      const total = lineItems.reduce(
        (sum, li) => sum + li.price_data.unit_amount * li.quantity,
        0
      ) / 100

      let userId = session?.user?.id || ''
      let orderEmail = customerEmail

      try {
        if (!userId && customerEmail) {
          const existing = await prisma.user.findUnique({ where: { email: customerEmail } })
          if (existing) {
            userId = existing.id
          } else {
            const created = await prisma.user.create({
              data: {
                email: customerEmail,
                name: shippingAddress?.name || customerEmail.split('@')[0],
              },
            })
            userId = created.id
          }
        }

        if (userId) {
          await createOrder({
            userId,
            email: orderEmail,
            items: lineItems.map((li, idx) => ({
              productId: resolved[idx]!.id,
              name: li.price_data.product_data.name,
              quantity: li.quantity,
              price: li.price_data.unit_amount / 100,
            })),
            shippingAddress,
            total,
          })
        }
      } catch (error) {
        console.error('Demo order creation failed (continuing):', error)
      }

      const demoId = `demo_${Date.now()}`
      return NextResponse.json({
        demo: true,
        orderId: demoId,
        url: `${APP_URL}/checkout/success?session_id=${demoId}`,
      })
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: subscription ? 'subscription' : 'payment',
      line_items: lineItems,
      success_url: `${APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${APP_URL}/checkout?canceled=1`,
      customer_email: customerEmail || undefined,
      metadata: {
        userId: session?.user?.id || 'guest',
        shippingAddress: JSON.stringify(shippingAddress || {}),
      },
      payment_intent_data: {
        metadata: {
          userId: session?.user?.id || 'guest',
        },
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: { amount: 0, currency: 'usd' },
            display_name: 'Free Shipping',
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 5 },
              maximum: { unit: 'business_day', value: 7 },
            },
          },
        },
      ],
    })

    return NextResponse.json({ url: checkoutSession.url, id: checkoutSession.id })
  } catch (error: any) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: 'Could not start checkout. Please try again.' },
      { status: 500 }
    )
  }
}