import { prisma } from '@/lib/prisma'
import { products as seedProducts } from '@/lib/seed-data'

export interface PublicProduct {
  id: string
  name: string
  slug: string
  description: string
  shortDesc: string | null
  price: number
  compareAtPrice: number | null
  images: string[]
  category: string
  flavor: string | null
  size: string | null
  weight: string | null
  proteinPerServing: number | null
  servingsPerContainer: number | null
  ingredients: string | null
  nutritionFacts: any
  tags: string[]
  featured: boolean
  isActive: boolean
  inventory: number
  amazonAsin: string | null
  affiliateLink: string | null
  amazonUrl?: string | null
  rating?: number | null
  ratingCount?: number | null
  bestSellerRank?: string | null
  boughtInPastMonth?: string | null
  createdAt: Date
  updatedAt: Date
}

function toPublicProduct(p: any): PublicProduct {
  return {
    ...p,
    price: Number(p.price),
    compareAtPrice: p.compareAtPrice != null ? Number(p.compareAtPrice) : null,
  }
}

export async function getFeaturedProducts(): Promise<PublicProduct[]> {
  try {
    const featured = await prisma.product.findMany({
      where: { isActive: true, featured: true },
      take: 4,
    })
    if (featured.length > 0) return featured.map(toPublicProduct)
    const fallback = await prisma.product.findMany({ where: { isActive: true }, take: 4 })
    if (fallback.length > 0) return fallback.map(toPublicProduct)
    throw new Error('no products')
  } catch {
    return seedProducts.map((p, i) =>
      toPublicProduct({ ...p, id: `seed-${i}`, createdAt: new Date(), updatedAt: new Date() })
    )
  }
}

export async function getProductBySlug(slug: string) {
  try {
    const product = await prisma.product.findUnique({ where: { slug } })
    if (product && product.isActive) {
      const related = await prisma.product.findMany({
        where: { category: product.category, id: { not: product.id }, isActive: true },
        take: 4,
      })
      return {
        product: toPublicProduct(product),
        related: related.map(toPublicProduct),
      }
    }
    throw new Error('not found')
  } catch {
    const seedIndex = seedProducts.findIndex((p) => p.slug === slug)
    if (seedIndex === -1) return null
    const seed = seedProducts[seedIndex]
    return {
      product: toPublicProduct({ ...seed, id: `seed-${seedIndex}`, createdAt: new Date(), updatedAt: new Date() }),
      related: seedProducts
        .filter((p, i) => i !== seedIndex && p.category === seed.category)
        .slice(0, 4)
        .map((p, i) => toPublicProduct({ ...p, id: `seed-related-${i}`, createdAt: new Date(), updatedAt: new Date() })),
    }
  }
}
