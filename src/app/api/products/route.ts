import { NextResponse } from 'next/server'
import { products as seedProducts } from '@/lib/seed-data'
import { slugify } from '@/lib/utils'

export const dynamic = 'force-dynamic'

function toPublic(p: any, i: number) {
  return {
    ...p,
    id: `seed-${i}`,
    price: Number(p.price),
    compareAtPrice: p.compareAtPrice != null ? Number(p.compareAtPrice) : null,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category')
    const q = searchParams.get('q')
    const sort = searchParams.get('sort')

    let products = seedProducts.map(toPublic)

    if (category && category !== 'all') {
      const expected = category
        .split('-')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ')
      products = products.filter((p) => p.category.toLowerCase() === expected.toLowerCase())
    }

    if (q) {
      const term = q.toLowerCase()
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.description.toLowerCase().includes(term) ||
          p.category.toLowerCase().includes(term)
      )
    }

    if (sort === 'price-asc') products.sort((a, b) => a.price - b.price)
    if (sort === 'price-desc') products.sort((a, b) => b.price - a.price)
    if (sort === 'name') products.sort((a, b) => a.name.localeCompare(b.name))
    if (sort === 'featured') products.sort((a, b) => Number(b.featured) - Number(a.featured))

    return NextResponse.json({ products })
  } catch (error) {
    console.error('Products error:', error)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}