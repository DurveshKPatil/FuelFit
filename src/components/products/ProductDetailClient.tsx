'use client'

import { useState } from 'react'
import { ShoppingCart, Minus, Plus, Truck, ShieldCheck, RotateCcw, Check } from 'lucide-react'
import { useCartStore } from '@/store/cart'
import { useToast } from '@/components/ui/Toaster'
import { Product } from '@/types'
import { formatPrice, calculateDiscount, cn } from '@/lib/utils'

interface Props {
  product: Product
}

export default function ProductDetailClient({ product }: Props) {
  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState(0)
  const addItem = useCartStore((state) => state.addItem)
  const { toast } = useToast()

  const discount = calculateDiscount(product.price, product.compareAtPrice)

  const handleAddToCart = () => {
    addItem(product, quantity)
    toast(`${quantity} x ${product.name} added to cart`, 'success')
    const event = new CustomEvent('cart:open')
    window.dispatchEvent(event)
  }

  return (
    <div className="container-page py-8">
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-dark-50">
            <img
              src={product.images[activeImage] + '?w=800&h=800&fit=crop'}
              alt={product.name}
              className="h-full w-full object-cover"
            />
            {discount > 0 && (
              <span className="badge-red absolute left-4 top-4 rounded-md bg-red-600 px-2.5 py-1 text-sm text-white">
                Save {discount}%
              </span>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="mt-4 flex gap-3">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={cn(
                    'h-20 w-20 overflow-hidden rounded-lg border-2',
                    activeImage === i ? 'border-primary-600' : 'border-transparent'
                  )}
                >
                  <img src={img + '?w=160&h=160&fit=crop'} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-primary-600">
            {product.category}
          </p>
          <h1 className="mt-1 text-3xl font-bold">{product.name}</h1>

          {product.proteinPerServing && (
            <p className="mt-2 text-sm text-dark-500">
              {product.proteinPerServing}g protein per serving &bull; {product.servingsPerContainer} servings
            </p>
          )}

          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl font-bold">{formatPrice(product.price)}</span>
            {product.compareAtPrice && (
              <span className="text-lg text-dark-400 line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>

          {product.shortDesc && (
            <p className="mt-4 text-dark-600">{product.shortDesc}</p>
          )}

          <div className="mt-6 space-y-3">
            {product.flavor && (
              <div className="flex items-center justify-between border-b border-dark-100 pb-3 text-sm">
                <span className="text-dark-500">Flavor</span>
                <span className="font-medium">{product.flavor}</span>
              </div>
            )}
            {product.size && (
              <div className="flex items-center justify-between border-b border-dark-100 pb-3 text-sm">
                <span className="text-dark-500">Size</span>
                <span className="font-medium">{product.size}</span>
              </div>
            )}
            <div className="flex items-center justify-between border-b border-dark-100 pb-3 text-sm">
              <span className="text-dark-500">Availability</span>
              {product.inventory > 0 ? (
                <span className="flex items-center gap-1 font-medium text-green-600">
                  <Check className="h-4 w-4" /> In Stock ({product.inventory})
                </span>
              ) : (
                <span className="font-medium text-red-600">Sold Out</span>
              )}
            </div>
          </div>

          <div className="mt-6 flex items-center gap-4">
            <div className="flex items-center rounded-lg border border-dark-200">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2.5 text-dark-500 hover:text-dark-900"
                aria-label="Decrease quantity"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-10 text-center font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(product.inventory || 99, quantity + 1))}
                className="p-2.5 text-dark-500 hover:text-dark-900"
                aria-label="Increase quantity"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={product.inventory === 0}
              className="btn-primary flex-1 px-6 py-3 text-base"
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              {product.inventory === 0 ? 'Sold Out' : 'Add to Cart'}
            </button>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-3">
            <div className="flex flex-col items-center gap-2 rounded-xl border border-dark-100 p-4 text-center">
              <Truck className="h-6 w-6 text-primary-600" />
              <p className="text-xs font-medium">Free shipping over $75</p>
            </div>
            <div className="flex flex-col items-center gap-2 rounded-xl border border-dark-100 p-4 text-center">
              <ShieldCheck className="h-6 w-6 text-primary-600" />
              <p className="text-xs font-medium">Third-party tested</p>
            </div>
            <div className="flex flex-col items-center gap-2 rounded-xl border border-dark-100 p-4 text-center">
              <RotateCcw className="h-6 w-6 text-primary-600" />
              <p className="text-xs font-medium">30-day guarantee</p>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-lg font-bold">Description</h2>
            <p className="mt-2 leading-relaxed text-dark-600">{product.description}</p>
          </div>

          {product.ingredients && (
            <div className="mt-6">
              <h2 className="text-lg font-bold">Ingredients</h2>
              <p className="mt-2 text-sm leading-relaxed text-dark-500">{product.ingredients}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}