'use client'

import { useEffect, useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { formatPrice, formatDate } from '@/lib/utils'

const statusStyles: Record<string, string> = {
  ACTIVE: 'badge-green',
  PAST_DUE: 'badge-yellow',
  PAUSED: 'badge-yellow',
  CANCELLED: 'badge-red',
}

export default function AdminSubscriptions() {
  const [subscriptions, setSubscriptions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin?type=subscriptions')
      .then((r) => r.json())
      .then((data) => setSubscriptions(data.subscriptions || []))
      .catch(() => setSubscriptions([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold">Subscriptions</h2>
        <p className="text-sm text-dark-500">{subscriptions.length} subscriptions</p>
      </div>

      {loading ? (
        <div className="card p-10 text-center text-sm text-dark-400">Loading subscriptions...</div>
      ) : subscriptions.length === 0 ? (
        <div className="card p-10 text-center">
          <RefreshCw className="mx-auto h-10 w-10 text-dark-300" />
          <p className="mt-3 text-sm text-dark-500">No subscriptions yet.</p>
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-dark-100 text-left text-xs uppercase tracking-wider text-dark-400">
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Plan</th>
                <th className="px-4 py-3">Next Billing</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-100">
              {subscriptions.map((sub) => (
                <tr key={sub.id} className="hover:bg-dark-50">
                  <td className="px-4 py-3">
                    <p>{sub.user?.name || sub.user?.email}</p>
                    <p className="text-xs text-dark-400">{sub.user?.email}</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-dark-50">
                        <img
                          src={sub.product.images[0] + '?w=80&h=80&fit=crop'}
                          alt={sub.product.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <span className="font-medium">{sub.product.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {formatPrice(Number(sub.product.price))} / {sub.interval}
                  </td>
                  <td className="px-4 py-3 text-dark-500">
                    {sub.currentPeriodEnd ? formatDate(sub.currentPeriodEnd) : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <span className={statusStyles[sub.status] || 'badge-gray'}>{sub.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}