import { NextResponse } from 'next/server'
import { getProductBySlug } from '@/lib/data'

export const dynamic = 'force-dynamic'

export async function GET(
  _req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const data = await getProductBySlug(params.slug)

    if (!data) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json({ product: data.product, related: data.related })
  } catch (error) {
    console.error('Product detail error:', error)
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 })
  }
}