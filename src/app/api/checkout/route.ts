import { NextResponse } from 'next/server'
import { buildAmazonCartUrl, type AmazonCartItem } from '@/lib/amazon'
import { products as seedProducts } from '@/lib/seed-data'

export const dynamic = 'force-dynamic'

interface CheckoutItem {
  productId: string
  slug: string
  quantity: number
}

interface ResolvedProduct {
  id: string
  name: string
  amazonAsin: string | null
  affiliateLink: string | null
}

function resolveProducts(items: { id: string; slug: string }[]): (ResolvedProduct | null)[] {
  return items.map(({ id, slug }) => {
    const seed = seedProducts.find((p) => p.slug === slug || p.slug === id || p.id === id)
    if (seed) {
      return {
        id,
        name: seed.name,
        amazonAsin: seed.amazonAsin || null,
        affiliateLink: seed.affiliateLink || null,
      }
    }
    return null
  })
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const items: CheckoutItem[] = body.items

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'No items in cart' }, { status: 400 })
    }

    const resolved = resolveProducts(items.map((i) => ({ id: i.productId, slug: i.slug })))
    const amazonItems: AmazonCartItem[] = []
    const missingAsin: string[] = []

    for (let idx = 0; idx < items.length; idx++) {
      const item = items[idx]
      const product = resolved[idx]

      if (!product) {
        return NextResponse.json(
          { error: 'Product not found. Refresh your cart and try again.' },
          { status: 400 }
        )
      }

      if (product.affiliateLink) {
        amazonItems.push({
          asin: product.amazonAsin || '',
          quantity: item.quantity,
          affiliateLink: product.affiliateLink,
        })
      } else if (product.amazonAsin) {
        amazonItems.push({
          asin: product.amazonAsin,
          quantity: item.quantity,
        })
      } else {
        missingAsin.push(product.name)
      }
    }

    if (missingAsin.length > 0) {
      return NextResponse.json(
        {
          error: `These products are not available on Amazon yet: ${missingAsin.join(', ')}`,
        },
        { status: 400 }
      )
    }

    const url = buildAmazonCartUrl(amazonItems)

    return NextResponse.json({ url })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: 'Could not redirect to Amazon. Please try again.' },
      { status: 500 }
    )
  }
}
