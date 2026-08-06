'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { SlidersHorizontal, X } from 'lucide-react'
import ProductCard from '@/components/products/ProductCard'
import { Product } from '@/types'
import { categories } from '@/lib/seed-data'
import { cn } from '@/lib/utils'

const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name', label: 'Name: A-Z' },
]

function ProductsContent() {
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || 'all')
  const [sort, setSort] = useState(searchParams.get('sort') || 'featured')
  const [search, setSearch] = useState(searchParams.get('q') || '')
  const [filtersOpen, setFiltersOpen] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams()
    if (activeCategory !== 'all') params.set('category', activeCategory)
    if (sort !== 'featured') params.set('sort', sort)
    if (search) params.set('q', search)

    setLoading(true)
    fetch(`/api/products?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => setProducts(data.products || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }, [activeCategory, sort, search])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }

  return (
    <div className="container-page py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Shop Protein</h1>
        <p className="mt-1 text-sm text-dark-500">
          {loading ? 'Loading products...' : `${products.length} products available`}
        </p>
      </div>

      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setActiveCategory(cat.slug)}
              className={cn(
                'rounded-full border px-4 py-1.5 text-sm font-medium transition-colors',
                activeCategory === cat.slug
                  ? 'border-primary-600 bg-primary-600 text-white'
                  : 'border-dark-200 text-dark-600 hover:border-dark-400'
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <input
            value={search}
            onChange={handleSearchChange}
            placeholder="Search..."
            className="input w-40 sm:w-56"
          />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="input w-auto cursor-pointer"
          >
            {sortOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="rounded-lg border border-dark-200 p-2.5 lg:hidden"
            aria-label="Toggle filters"
          >
            <SlidersHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse overflow-hidden rounded-xl border border-dark-100">
              <div className="aspect-square bg-dark-100" />
              <div className="space-y-3 p-4">
                <div className="h-4 w-20 rounded bg-dark-100" />
                <div className="h-4 w-full rounded bg-dark-100" />
                <div className="h-4 w-3/4 rounded bg-dark-100" />
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24">
          <SlidersHorizontal className="h-12 w-12 text-dark-300" />
          <h2 className="mt-4 text-lg font-semibold">No products found</h2>
          <p className="mt-1 text-sm text-dark-500">
            Try adjusting your search or filter criteria.
          </p>
          <button
            onClick={() => {
              setActiveCategory('all')
              setSearch('')
              setSort('featured')
            }}
            className="btn-secondary mt-4"
          >
            <X className="mr-2 h-4 w-4" /> Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="container-page py-8 text-sm text-dark-400">Loading...</div>}>
      <ProductsContent />
    </Suspense>
  )
}