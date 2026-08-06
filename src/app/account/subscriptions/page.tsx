'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { RefreshCw } from 'lucide-react'
import { Subscription } from '@/types'
import { formatPrice, formatDate } from '@/lib/utils'

const statusStyles: Record<string, string> = {
  ACTIVE: 'badge-green',
  PAST_DUE: 'badge-yellow',
  PAUSED: 'badge-yellow',
  CANCELLED: 'badge-red',
}

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/subscriptions')
      .then((r) => r.json())
      .then((data) => setSubscriptions(data.subscriptions || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <div className="card p-10 text-center text-sm text-dark-400">Loading subscriptions...</div>
  }

  if (subscriptions.length === 0) {
    return (
      <div className="card p-10 text-center">
        <RefreshCw className="mx-auto h-10 w-10 text-dark-300" />
        <p className="mt-3 text-sm text-dark-500">
          You don&apos;t have any active subscriptions yet.
        </p>
        <p className="mt-1 text-xs text-dark-400">
          Subscribe to save 20% on every order and never run out.
        </p>
        <Link href="/products?subscription=true" className="btn-primary mt-4">
          Explore Subscriptions
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {subscriptions.map((sub) => (
        <div key={sub.id} className="card flex flex-wrap items-center gap-4 p-5">
          <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-dark-50">
            <img
              src={sub.product.images[0] + '?w=160&h=160&fit=crop'}
              alt={sub.product.name}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold">{sub.product.name}</p>
            <p className="text-sm text-dark-500">
              {formatPrice(Number(sub.product.price))} / {sub.interval} &bull; Qty: {sub.quantity}
            </p>
            {sub.currentPeriodEnd && sub.status === 'ACTIVE' && (
              <p className="mt-1 text-xs text-dark-400">
                Next delivery: {formatDate(sub.currentPeriodEnd)}
              </p>
            )}
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className={statusStyles[sub.status] || 'badge-gray'}>{sub.status}</span>
            <button className="text-xs font-semibold text-primary-600 hover:text-primary-700">
              Manage
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}