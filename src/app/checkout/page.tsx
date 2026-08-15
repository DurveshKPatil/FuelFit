'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore, useCartTotals } from '@/store/cart'
import { useToast } from '@/components/ui/Toaster'
import { formatPrice } from '@/lib/utils'
import { ShoppingCart, ChevronRight, ExternalLink, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default function CheckoutPage() {
  const router = useRouter()
  const { items } = useCartStore()
  const { subtotal, itemCount } = useCartTotals()
  const { toast } = useToast()

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (items.length === 0 && !loading) {
      router.replace('/cart')
    }
  }, [items, loading, router])

  const handleCheckout = async () => {
    setLoading(true)

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.productId,
            slug: item.product.slug,
            quantity: item.quantity,
          })),
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        toast(data.error || 'Checkout failed', 'error')
        return
      }

      if (data.url) {
        window.open(data.url, '_blank')
      }
    } catch {
      toast('Something went wrong. Please try again.', 'error')
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return null
  }

  return (
    <div className="container-page py-8">
      <h1 className="text-3xl font-bold">Checkout</h1>
      <p className="mt-1 text-sm text-dark-500">
        <Link href="/cart" className="text-primary-600 hover:underline">
          <ChevronRight className="mr-1 inline h-4 w-4" />
          Back to cart
        </Link>
      </p>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <div className="card p-6">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold">
              <ShoppingCart className="h-5 w-5 text-primary-600" />
              Review Your Order
            </h2>
            <p className="mb-4 text-sm text-dark-500">
              Review the items below. When you click &quot;Buy on Amazon&quot;, you&apos;ll be
              redirected to Amazon.in to complete your purchase.
            </p>

            <ul className="space-y-4">
              {items.map((item) => (
                <li key={item.id} className="flex items-center gap-4">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-dark-50">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="h-full w-full object-cover"
                    />
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-dark-900 text-xs text-white">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1">
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
                    <p className="mt-1 text-sm font-medium">
                      {formatPrice(item.product.price)} × {item.quantity}
                    </p>
                  </div>
                  <p className="text-lg font-bold">
                    {formatPrice(item.product.price * item.quantity)}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div className="card border-yellow-200 bg-yellow-50 p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-yellow-600" />
              <div className="text-sm text-yellow-800">
                <p className="font-semibold">You&apos;re buying from Amazon.in</p>
                <p className="mt-1">
                  FuelFit is an affiliate partner of Amazon. When you click the button
                  below, you&apos;ll be redirected to Amazon.in to complete your purchase.
                  Your order, payment, and shipping will be handled by Amazon.
                </p>
              </div>
            </div>
          </div>
        </div>

        <aside className="h-fit lg:sticky lg:top-28">
          <div className="card p-6">
            <h2 className="text-lg font-bold">Order Summary</h2>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-dark-500">Subtotal ({itemCount} items)</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-dark-500">Shipping</span>
                <span className="text-dark-500">Calculated on Amazon</span>
              </div>
              <div className="flex justify-between border-t border-dark-100 pt-3 text-base font-bold">
                <span>Estimated Total</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={loading || items.length === 0}
              className="btn-primary mt-6 flex w-full items-center justify-center gap-2 py-3"
            >
              {loading ? (
                'Preparing your order...'
              ) : (
                <>
                  Buy on Amazon
                  <ExternalLink className="h-4 w-4" />
                </>
              )}
            </button>

            <p className="mt-3 text-center text-xs text-dark-400">
              You&apos;ll be redirected to Amazon.in to complete payment
            </p>

            <Link
              href="/products"
              className="btn-secondary mt-2 block w-full text-center"
            >
              Continue Shopping
            </Link>
          </div>
        </aside>
      </div>
    </div>
  )
}
