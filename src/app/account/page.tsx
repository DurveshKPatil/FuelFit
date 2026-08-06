'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Package, RefreshCw, Clock, ShoppingBag } from 'lucide-react'
import { Order, Subscription } from '@/types'
import { formatPrice, formatDate } from '@/lib/utils'

export default function AccountOverview() {
  const [orders, setOrders] = useState<Order[]>([])
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/orders').then((r) => r.json()),
      fetch('/api/subscriptions').then((r) => r.json()),
    ])
      .then(([ordersData, subsData]) => {
        setOrders(ordersData.orders || [])
        setSubscriptions(subsData.subscriptions || [])
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="card p-10 text-center text-sm text-dark-400">Loading your account...</div>
    )
  }

  const activeSubs = subscriptions.filter((s) => s.status === 'ACTIVE')

  const stats = [
    { label: 'Total Orders', value: orders.length, icon: ShoppingBag },
    { label: 'Active Subscriptions', value: activeSubs.length, icon: RefreshCw },
    { label: 'Total Spent', value: formatPrice(orders.reduce((sum, o) => sum + o.total, 0)), icon: Package },
  ]

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-dark-500">{stat.label}</p>
                <p className="mt-1 text-2xl font-bold">{stat.value}</p>
              </div>
              <stat.icon className="h-8 w-8 text-primary-600" />
            </div>
          </div>
        ))}
      </div>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">Recent Orders</h2>
          <Link href="/account/orders" className="text-sm font-semibold text-primary-600 hover:text-primary-700">
            View all
          </Link>
        </div>
        {orders.length === 0 ? (
          <div className="card p-10 text-center">
            <Package className="mx-auto h-10 w-10 text-dark-300" />
            <p className="mt-3 text-sm text-dark-500">No orders yet.</p>
            <Link href="/products" className="btn-primary mt-4">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="card divide-y divide-dark-100">
            {orders.slice(0, 3).map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4">
                <div>
                  <p className="font-medium">Order #{order.id.slice(-8).toUpperCase()}</p>
                  <p className="flex items-center gap-1 text-xs text-dark-500">
                    <Clock className="h-3 w-3" />
                    {formatDate(order.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="badge-gray">{order.status}</span>
                  <span className="font-semibold">{formatPrice(order.total)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {subscriptions.length > 0 && (
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold">Your Subscriptions</h2>
            <Link href="/account/subscriptions" className="text-sm font-semibold text-primary-600 hover:text-primary-700">
              Manage
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {activeSubs.slice(0, 2).map((sub) => (
              <div key={sub.id} className="card flex items-center gap-4 p-4">
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-dark-50">
                  <img
                    src={sub.product.images[0] + '?w=128&h=128&fit=crop'}
                    alt={sub.product.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <p className="truncate font-medium">{sub.product.name}</p>
                  <p className="text-xs text-dark-500">
                    {formatPrice(Number(sub.product.price))} / {sub.interval}
                  </p>
                </div>
                <span className="badge-green ml-auto">Active</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}