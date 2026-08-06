'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useCartStore, useCartTotals } from '@/store/cart'
import { useToast } from '@/components/ui/Toaster'
import { formatPrice } from '@/lib/utils'
import { Lock, ChevronRight, Package } from 'lucide-react'
import Link from 'next/link'

export default function CheckoutPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const { items, clearCart } = useCartStore()
  const { subtotal, itemCount } = useCartTotals()
  const { toast } = useToast()

  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState(session?.user?.email || '')
  const [shippingAddress, setShippingAddress] = useState({
    name: session?.user?.name || '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
    phone: '',
  })
  const [sameAsBilling, setSameAsBilling] = useState(true)
  const [notes, setNotes] = useState('')

  useEffect(() => {
    if (session?.user?.email) setEmail(session.user.email)
    if (session?.user?.name) setShippingAddress((prev) => ({ ...prev, name: session.user.name || '' }))
  }, [session])

  useEffect(() => {
    if (items.length === 0 && !loading) {
      router.replace('/cart')
    }
  }, [items, loading, router])

  const handleFieldChange = (field: string, value: string) => {
    setShippingAddress((prev) => ({ ...prev, [field]: value }))
  }

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
          email,
          shippingAddress,
          billingAddress: sameAsBilling ? shippingAddress : shippingAddress,
          notes,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        toast(data.error || 'Checkout failed', 'error')
        return
      }

      if (data.url) {
        window.location.href = data.url
      }
    } catch {
      toast('Something went wrong. Please try again.', 'error')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = 'input'
  const labelClass = 'label'

  return (
    <div className="container-page py-8">
      <h1 className="text-3xl font-bold">Checkout</h1>
      <p className="mt-1 text-sm text-dark-500">
        <Link href="/cart" className="text-primary-600 hover:underline">
          <ChevronRight className="mr-1 inline h-4 w-4" />
          Back to cart
        </Link>
      </p>

      <form onSubmit={handleCheckout} className="mt-8 grid gap-10 lg:grid-cols-[1fr_380px]">
        <div className="space-y-8">
          <section>
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-600 text-sm text-white">1</span>
              Contact Information
            </h2>
            <div className="card p-6">
              <label className={labelClass}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
                placeholder="you@example.com"
                required
              />
            </div>
          </section>

          <section>
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-600 text-sm text-white">2</span>
              Shipping Address
            </h2>
            <div className="card grid gap-4 p-6 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className={labelClass}>Full Name</label>
                <input
                  value={shippingAddress.name}
                  onChange={(e) => handleFieldChange('name', e.target.value)}
                  className={inputClass}
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>Street Address</label>
                <input
                  value={shippingAddress.street}
                  onChange={(e) => handleFieldChange('street', e.target.value)}
                  className={inputClass}
                  placeholder="123 Main Street"
                  required
                />
              </div>
              <div>
                <label className={labelClass}>City</label>
                <input
                  value={shippingAddress.city}
                  onChange={(e) => handleFieldChange('city', e.target.value)}
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className={labelClass}>State</label>
                <input
                  value={shippingAddress.state}
                  onChange={(e) => handleFieldChange('state', e.target.value)}
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className={labelClass}>ZIP Code</label>
                <input
                  value={shippingAddress.zipCode}
                  onChange={(e) => handleFieldChange('zipCode', e.target.value)}
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Country</label>
                <select
                  value={shippingAddress.country}
                  onChange={(e) => handleFieldChange('country', e.target.value)}
                  className={inputClass}
                >
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="UK">United Kingdom</option>
                  <option value="AU">Australia</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>Phone (optional)</label>
                <input
                  value={shippingAddress.phone}
                  onChange={(e) => handleFieldChange('phone', e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
          </section>

          <section>
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-600 text-sm text-white">3</span>
              Billing Address
            </h2>
            <div className="card p-6">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={sameAsBilling}
                  onChange={(e) => setSameAsBilling(e.target.checked)}
                  className="h-4 w-4 rounded border-dark-300 text-primary-600"
                />
                <span className="text-sm">Billing address is the same as shipping</span>
              </label>
            </div>
          </section>

          <section>
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-600 text-sm text-white">4</span>
              Order Notes (optional)
            </h2>
            <div className="card p-6">
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className={inputClass}
                rows={3}
                placeholder="Delivery instructions, gift message, etc."
              />
            </div>
          </section>
        </div>

        <aside className="h-fit lg:sticky lg:top-28">
          <div className="card p-6">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold">
              <Package className="h-5 w-5 text-primary-600" />
              Order Summary
            </h2>
            <ul className="max-h-64 space-y-3 overflow-y-auto pr-1">
              {items.map((item) => (
                <li key={item.id} className="flex items-center gap-3">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-dark-50">
                    <img
                      src={item.product.images[0] + '?w=112&h=112&fit=crop'}
                      alt={item.product.name}
                      className="h-full w-full object-cover"
                    />
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-dark-900 text-xs text-white">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="line-clamp-1 text-sm font-medium">{item.product.name}</p>
                    <p className="text-xs text-dark-500">{formatPrice(item.product.price)} each</p>
                  </div>
                  <p className="text-sm font-semibold">
                    {formatPrice(item.product.price * item.quantity)}
                  </p>
                </li>
              ))}
            </ul>

            <div className="mt-4 space-y-2 border-t border-dark-100 pt-4 text-sm">
              <div className="flex justify-between">
                <span className="text-dark-500">Subtotal ({itemCount} items)</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-dark-500">Shipping</span>
                <span className="font-medium text-green-600">Free</span>
              </div>
              <div className="flex justify-between">
                <span className="text-dark-500">Tax</span>
                <span className="font-medium">Calculated at checkout</span>
              </div>
              <div className="flex justify-between border-t border-dark-100 pt-3 text-base font-bold">
                <span>Total</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || items.length === 0}
              className="btn-primary mt-6 w-full py-3"
            >
              <Lock className="mr-2 h-4 w-4" />
              {loading ? 'Redirecting to secure checkout...' : 'Proceed to Payment'}
            </button>
            <p className="mt-3 flex items-center justify-center gap-1 text-center text-xs text-dark-400">
              <Lock className="h-3 w-3" />
              Secured by Stripe. 256-bit SSL encryption.
            </p>
          </div>
        </aside>
      </form>
    </div>
  )
}