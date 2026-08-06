'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { X, Plus, Minus, ShoppingBag, Trash2 } from 'lucide-react'
import { useCartStore, useCartTotals } from '@/store/cart'
import { formatPrice, cn } from '@/lib/utils'

export default function CartDrawer() {
  const [open, setOpen] = useState(false)
  const { items, removeItem, updateQuantity } = useCartStore()
  const { subtotal, itemCount } = useCartTotals()
  const router = useRouter()

  useEffect(() => {
    const handleOpen = () => setOpen(true)
    window.addEventListener('cart:open', handleOpen)
    return () => window.removeEventListener('cart:open', handleOpen)
  }, [])

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const freeShippingThreshold = 75
  const remaining = Math.max(0, freeShippingThreshold - subtotal)
  const progress = Math.min(100, (subtotal / freeShippingThreshold) * 100)

  const handleCheckout = () => {
    setOpen(false)
    router.push('/checkout')
  }

  return (
    <>
      <div
        className={cn(
          'fixed inset-0 z-[90] bg-black/50 transition-opacity',
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
        onClick={() => setOpen(false)}
      />
      <aside
        className={cn(
          'fixed inset-y-0 right-0 z-[95] flex w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300',
          open ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="flex items-center justify-between border-b border-dark-100 px-6 py-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-primary-600" />
            <h2 className="text-lg font-bold">
              Your Cart ({itemCount})
            </h2>
          </div>
          <button onClick={() => setOpen(false)} aria-label="Close cart" className="rounded-md p-1.5 hover:bg-dark-50">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="border-b border-dark-100 bg-primary-50 px-6 py-3">
          {remaining > 0 ? (
            <p className="text-xs text-primary-800">
              You&apos;re <span className="font-bold">{formatPrice(remaining)}</span> away from free shipping
            </p>
          ) : (
            <p className="text-xs font-semibold text-green-700">
              You&apos;ve unlocked free shipping!
            </p>
          )}
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-primary-100">
            <div
              className="h-full rounded-full bg-primary-600 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6">
            <ShoppingBag className="h-12 w-12 text-dark-300" />
            <p className="text-sm text-dark-500">Your cart is empty</p>
            <Link
              href="/products"
              onClick={() => setOpen(false)}
              className="btn-primary"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <ul className="space-y-4">
                {items.map((item) => (
                  <li key={item.id} className="flex gap-4">
                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-dark-50">
                      <img
                        src={item.product.images[0] + '?w=160&h=160&fit=crop'}
                        alt={item.product.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <Link
                            href={`/products/${item.product.slug}`}
                            onClick={() => setOpen(false)}
                            className="line-clamp-2 text-sm font-semibold text-dark-900 hover:text-primary-600"
                          >
                            {item.product.name}
                          </Link>
                          <p className="text-xs text-dark-500">
                            {item.product.flavor && `Flavor: ${item.product.flavor}`}
                            {item.product.size && ` | ${item.product.size}`}
                          </p>
                        </div>
                        <button
                          onClick={() => removeItem(item.productId, item.variant || undefined)}
                          className="text-dark-300 hover:text-red-600"
                          aria-label="Remove item"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="mt-auto flex items-center justify-between pt-2">
                        <div className="flex items-center rounded-lg border border-dark-200">
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity - 1, item.variant || undefined)}
                            className="p-1.5 text-dark-500 hover:text-dark-900"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity + 1, item.variant || undefined)}
                            className="p-1.5 text-dark-500 hover:text-dark-900"
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <p className="text-sm font-semibold">
                          {formatPrice(item.product.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-dark-100 px-6 py-4">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm text-dark-500">Subtotal</span>
                <span className="text-lg font-bold">{formatPrice(subtotal)}</span>
              </div>
              <p className="mb-4 text-xs text-dark-500">Shipping and taxes calculated at checkout.</p>
              <button onClick={handleCheckout} className="btn-primary w-full">
                Checkout
              </button>
              <button
                onClick={() => setOpen(false)}
                className="btn-secondary mt-2 w-full"
              >
                Continue Shopping
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  )
}