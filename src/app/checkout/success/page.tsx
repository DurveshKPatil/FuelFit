'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { useCartStore } from '@/store/cart'

function CheckoutSuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const isDemo = sessionId?.startsWith('demo_') || false
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const clearCart = useCartStore((state) => state.clearCart)

  useEffect(() => {
    if (!sessionId) {
      setStatus('error')
      return
    }
    clearCart()
    setStatus('success')
  }, [sessionId, clearCart])

  if (status === 'loading') {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary-600" />
        <p className="text-sm text-dark-500">Confirming your order...</p>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <h1 className="text-2xl font-bold">Missing payment session</h1>
        <p className="text-sm text-dark-500">
          We couldn&apos;t verify your payment. Please check your email for order confirmation.
        </p>
        <Link href="/products" className="btn-primary">
          Continue Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
          <CheckCircle2 className="h-10 w-10 text-green-600" />
        </div>
        <h1 className="mt-6 text-3xl font-bold">Thank You!</h1>
        <p className="mt-3 text-dark-600">
          Your order has been placed successfully. A confirmation email has been
          sent to your inbox with the order details and tracking information.
        </p>
        {isDemo && (
          <p className="mt-4 rounded-lg border border-yellow-200 bg-yellow-50 p-3 text-sm text-yellow-800">
            You&apos;re in <span className="font-semibold">demo mode</span> — no payment was
            charged. Add your Stripe keys to the .env file to enable real card payments.
          </p>
        )}
        <div className="mt-8 space-y-3">
          <Link href="/account/orders" className="btn-primary block w-full">
            View My Orders
          </Link>
          <Link href="/products" className="btn-secondary block w-full">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center text-sm text-dark-400">
          Loading...
        </div>
      }
    >
      <CheckoutSuccessContent />
    </Suspense>
  )
}