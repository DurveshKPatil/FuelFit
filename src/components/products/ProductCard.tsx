'use client'

import Link from 'next/link'
import { ShoppingCart, Star } from 'lucide-react'
import { useCartStore } from '@/store/cart'
import { useToast } from '@/components/ui/Toaster'
import { Product } from '@/types'
import { formatPrice, calculateDiscount } from '@/lib/utils'

export default function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((state) => state.addItem)
  const { toast } = useToast()

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    addItem(product)
    toast(`${product.name} added to cart`, 'success')
    const event = new CustomEvent('cart:open')
    window.dispatchEvent(event)
  }

  const discount = calculateDiscount(product.price, product.compareAtPrice)

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-dark-100 bg-white transition-shadow hover:shadow-lg"
    >
      <div className="relative aspect-square overflow-hidden bg-dark-50">
        <img
          src={product.images[0]}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {discount > 0 && (
            <span className="badge-red rounded-md bg-red-600 px-2 py-1 text-white">
              {discount}% OFF
            </span>
          )}
          {product.featured && (
            <span className="badge-primary rounded-md">Best Seller</span>
          )}
        </div>
        {product.inventory === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-dark-950/60">
            <span className="rounded-md bg-white px-3 py-1 text-sm font-semibold text-dark-900">
              Sold Out
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-dark-400">
          {product.category}
        </p>
        <h3 className="mt-1 line-clamp-2 text-sm font-semibold text-dark-900 group-hover:text-primary-600">
          {product.name}
        </h3>
        {product.proteinPerServing && (
          <p className="mt-1 flex items-center gap-1 text-xs text-dark-500">
            <Star className="h-3 w-3 fill-primary-500 text-primary-500" />
            {product.proteinPerServing}g protein per serving
          </p>
        )}

        <div className="mt-auto flex items-end justify-between pt-4">
          <div>
            <p className="text-lg font-bold text-dark-900">
              {formatPrice(product.price)}
            </p>
            {product.compareAtPrice && (
              <p className="text-sm text-dark-400 line-through">
                {formatPrice(product.compareAtPrice)}
              </p>
            )}
          </div>
          <button
            onClick={handleAdd}
            disabled={product.inventory === 0}
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-dark-900 text-white transition-colors hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingCart className="h-4 w-4" />
          </button>
        </div>
      </div>
    </Link>
  )
}