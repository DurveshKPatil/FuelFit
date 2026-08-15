'use client'

import { useSession } from 'next-auth/react'
import { ShoppingBag } from 'lucide-react'
import Link from 'next/link'

export default function AccountOverview() {
  const { data: session } = useSession()

  return (
    <div className="space-y-8">
      <div className="card p-6">
        <h2 className="text-lg font-bold">Welcome back, {session?.user?.name || 'there'}!</h2>
        <p className="mt-2 text-sm text-dark-500">
          This is your account overview. Browse our products and add them to your cart.
          When you&apos;re ready, you&apos;ll be redirected to Amazon.in to complete your purchase.
        </p>
      </div>

      <div className="card p-10 text-center">
        <ShoppingBag className="mx-auto h-10 w-10 text-dark-300" />
        <p className="mt-3 text-sm text-dark-500">Ready to shop?</p>
        <Link href="/products" className="btn-primary mt-4 inline-block">
          Browse Products
        </Link>
      </div>
    </div>
  )
}
