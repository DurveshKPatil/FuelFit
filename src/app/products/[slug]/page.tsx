import { notFound } from 'next/navigation'
import { getProductBySlug } from '@/lib/data'
import ProductDetailClient from '@/components/products/ProductDetailClient'
import ProductCard from '@/components/products/ProductCard'
import type { Metadata } from 'next'

interface PageProps {
  params: { slug: string }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const data = await getProductBySlug(params.slug)
  if (!data) return { title: 'Product Not Found' }
  return {
    title: data.product.name,
    description: data.product.shortDesc || data.product.description,
  }
}

export default async function ProductDetailPage({ params }: PageProps) {
  const data = await getProductBySlug(params.slug)
  if (!data) notFound()

  return (
    <div>
      <ProductDetailClient product={data.product} />
      {data.related.length > 0 && (
        <section className="container-page py-16">
          <h2 className="section-title mb-8">You Might Also Like</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {data.related.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}