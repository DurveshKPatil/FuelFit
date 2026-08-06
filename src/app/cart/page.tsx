'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Trash2, Minus, Plus, ShoppingBag } from 'lucide-react'
import { useCartStore, useCartTotals } from '@/store/cart'
import { formatPrice } from '@/lib/utils'

export default function CartPage() {
  const router = useRouter()
  const { items, removeItem, updateQuantity } = useCartStore()
  const { subtotal, itemCount } = useCartTotals()

  if (items.length === 0) {
    return (
      <div className="container-page flex flex-col items-center justify-center py-24 text-center">
        <ShoppingBag className="h-16 w-16 text-dark-200" />
        <h1 className="mt-4 text-2xl font-bold">Your cart is empty</h1>
        <p className="mt-2 text-dark-500">Looks like you haven&apos;t added anything yet.</p>
        <Link href="/products" className="btn-primary mt-6">
          Start Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="container-page py-8">
      <h1 className="text-3xl font-bold">Shopping Cart</h1>
      <p className="mt-1 text-sm text-dark-500">{itemCount} item(s)</p>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_380px]">
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="card flex gap-5 p-4">
              <div className="h-28 w-28 shrink-0 overflow-hidden rounded-lg bg-dark-50">
                <img
                  src={item.product.images[0] + '?w=224&h=224&fit=crop'}
                  alt={item.product.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex flex-1 flex-col">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <Link
                      href={`/products/${item.product.slug}`}
                      className="font-semibold hover:text-primary-600"
                    >
                      {item.product.name}
                    </Link>
                    <p className="mt-1 text-xs text-dark-500">
                      {item.product.flavor && `Flavor: ${item.product.flavor}`}
                      {item.product.size && ` | ${item.product.size}`}
                    </p>
                    <p className="mt-1 text-xs text-dark-500">
                      {formatPrice(item.product.price)} each
                    </p>
                  </div>
                  <button
                    onClick={() => removeItem(item.productId, item.variant || undefined)}
                    className="rounded-md p-2 text-dark-300 hover:bg-red-50 hover:text-red-600"
                    aria-label="Remove item"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-auto flex items-center justify-between pt-2">
                  <div className="flex items-center rounded-lg border border-dark-200">
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity - 1, item.variant || undefined)}
                      className="p-2 text-dark-500 hover:text-dark-900"
                      aria-label="Decrease"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-10 text-center font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity + 1, item.variant || undefined)}
                      className="p-2 text-dark-500 hover:text-dark-900"
                      aria-label="Increase"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="text-lg font-bold">{formatPrice(item.product.price * item.quantity)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <aside className="h-fit lg:sticky lg:top-28">
          <div className="card p-6">
            <h2 className="text-lg font-bold">Order Summary</h2>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-dark-500">Subtotal</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-dark-500">Shipping</span>
                <span className="font-medium text-green-600">
                  {subtotal >= 75 ? 'Free' : formatPrice(5.99)}
                </span>
              </div>
              {subtotal < 75 && (
                <p className="rounded-lg bg-primary-50 p-2 text-xs text-primary-800">
                  Add {formatPrice(75 - subtotal)} more for free shipping
                </p>
              )}
              <div className="flex justify-between border-t border-dark-100 pt-3 text-base font-bold">
                <span>Total</span>
                <span>{formatPrice(subtotal + (subtotal >= 75 ? 0 : 5.99))}</span>
              </div>
            </div>
            <button
              onClick={() => router.push('/checkout')}
              className="btn-primary mt-6 w-full py-3"
            >
              Proceed to Checkout
            </button>
            <Link href="/products" className="btn-secondary mt-2 block w-full text-center">
              Continue Shopping
            </Link>
          </div>
        </aside>
      </div>
    </div>
  )
}