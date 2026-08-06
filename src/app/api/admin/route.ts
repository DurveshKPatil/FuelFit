import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { rateLimit, getClientIp } from '@/lib/rate-limit'
import { assertSameOrigin } from '@/lib/security'
import { productSchema, orderStatusSchema } from '@/lib/validation'

export const dynamic = 'force-dynamic'

async function adminSession() {
  const session = await getServerSession(authOptions)
  return session?.user && session.user.role === 'ADMIN' ? session : null
}

function deny(req: Request) {
  if (!assertSameOrigin(req)) {
    return NextResponse.json({ error: 'Invalid request origin' }, { status: 403 })
  }
  const rl = rateLimit({ key: `admin:${getClientIp(req)}`, windowMs: 60_000, max: 60 })
  if (rl.limited) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 }
    )
  }
  return null
}

export async function GET(req: Request) {
  try {
    const blocked = deny(req)
    if (blocked) return blocked

    const session = await adminSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const type = searchParams.get('type') || 'products'

    if (type === 'orders') {
      const orders = await prisma.order.findMany({
        include: {
          user: { select: { id: true, name: true, email: true } },
          items: { include: { product: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: 100,
      })
      return NextResponse.json({ orders })
    }

    if (type === 'users') {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 100,
      })
      return NextResponse.json({ users })
    }

    if (type === 'subscriptions') {
      const subscriptions = await prisma.subscription.findMany({
        include: {
          user: { select: { id: true, name: true, email: true } },
          product: true,
        },
        orderBy: { createdAt: 'desc' },
      })
      return NextResponse.json({ subscriptions })
    }

    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json({ products })
  } catch (error) {
    console.error('Admin error:', error)
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const blocked = deny(req)
    if (blocked) return blocked

    const session = await adminSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { action, data } = body

    if (action === 'create-product') {
      const parsed = productSchema.safeParse(data)
      if (!parsed.success) {
        const firstError = parsed.error.errors[0]?.message || 'Invalid product data'
        return NextResponse.json({ error: firstError }, { status: 400 })
      }
      const p = parsed.data
      const product = await prisma.product.create({
        data: {
          name: p.name,
          slug: p.slug,
          description: p.description,
          shortDesc: p.shortDesc ?? null,
          price: p.price,
          compareAtPrice: p.compareAtPrice ?? null,
          images: p.images || [],
          category: p.category,
          flavor: p.flavor ?? null,
          size: p.size ?? null,
          weight: p.weight ?? null,
          proteinPerServing: p.proteinPerServing ?? null,
          servingsPerContainer: p.servingsPerContainer ?? null,
          ingredients: p.ingredients ?? null,
          tags: p.tags || [],
          featured: p.featured || false,
          inventory: p.inventory,
        },
      })
      return NextResponse.json({ product }, { status: 201 })
    }

    if (action === 'update-order-status') {
      const parsed = orderStatusSchema.safeParse(data)
      if (!parsed.success) {
        return NextResponse.json({ error: 'Invalid order status' }, { status: 400 })
      }
      const order = await prisma.order.update({
        where: { id: parsed.data.orderId },
        data: { status: parsed.data.status },
      })
      return NextResponse.json({ order })
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
  } catch (error) {
    console.error('Admin action error:', error)
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const blocked = deny(req)
    if (blocked) return blocked

    const session = await adminSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { id, data } = body

    if (!id || typeof id !== 'string' || id.length > 40) {
      return NextResponse.json({ error: 'Missing product id' }, { status: 400 })
    }

    const parsed = productSchema.safeParse(data)
    if (!parsed.success) {
      const firstError = parsed.error.errors[0]?.message || 'Invalid product data'
      return NextResponse.json({ error: firstError }, { status: 400 })
    }
    const p = parsed.data

    const product = await prisma.product.update({
      where: { id },
      data: {
        name: p.name,
        slug: p.slug,
        description: p.description,
        shortDesc: p.shortDesc ?? null,
        price: p.price,
        compareAtPrice: p.compareAtPrice ?? null,
        images: p.images || [],
        category: p.category,
        flavor: p.flavor ?? null,
        size: p.size ?? null,
        weight: p.weight ?? null,
        proteinPerServing: p.proteinPerServing ?? null,
        servingsPerContainer: p.servingsPerContainer ?? null,
        ingredients: p.ingredients ?? null,
        tags: p.tags || [],
        featured: p.featured || false,
        isActive: p.isActive !== undefined ? p.isActive : true,
        inventory: p.inventory,
      },
    })
    return NextResponse.json({ product })
  } catch (error) {
    console.error('Admin update error:', error)
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const blocked = deny(req)
    if (blocked) return blocked

    const session = await adminSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id || typeof id !== 'string' || id.length > 40) {
      return NextResponse.json({ error: 'Missing product id' }, { status: 400 })
    }

    await prisma.product.update({
      where: { id },
      data: { isActive: false },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Admin delete error:', error)
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 })
  }
}