'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Package, ShoppingCart, Users, RefreshCw, TrendingUp } from 'lucide-react'
import { formatPrice, formatDate } from '@/lib/utils'

interface Stats {
  products: number
  orders: number
  users: number
  subscriptions: number
  revenue: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [recentOrders, setRecentOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/admin?type=products').then((r) => r.json()),
      fetch('/api/admin?type=orders').then((r) => r.json()),
      fetch('/api/admin?type=users').then((r) => r.json()),
      fetch('/api/admin?type=subscriptions').then((r) => r.json()),
    ])
      .then(([productsData, ordersData, usersData, subsData]) => {
        const orders = ordersData.orders || []
        const revenue = orders
          .filter((o: any) => ['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'].includes(o.status))
          .reduce((sum: number, o: any) => sum + Number(o.total), 0)
        setStats({
          products: (productsData.products || []).length,
          orders: orders.length,
          users: (usersData.users || []).length,
          subscriptions: (subsData.subscriptions || []).length,
          revenue,
        })
        setRecentOrders(orders.slice(0, 5))
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <div className="card p-10 text-center text-sm text-dark-400">Loading dashboard...</div>
  }

  const cards = [
    { label: 'Revenue', value: stats ? formatPrice(stats.revenue) : '$0', icon: TrendingUp },
    { label: 'Orders', value: stats?.orders ?? 0, icon: ShoppingCart },
    { label: 'Products', value: stats?.products ?? 0, icon: Package },
    { label: 'Customers', value: stats?.users ?? 0, icon: Users },
    { label: 'Subscriptions', value: stats?.subscriptions ?? 0, icon: RefreshCw },
  ]

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {cards.map((card) => (
          <div key={card.label} className="card p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-dark-500">{card.label}</p>
                <p className="mt-1 text-xl font-bold">{card.value}</p>
              </div>
              <card.icon className="h-6 w-6 text-primary-600" />
            </div>
          </div>
        ))}
      </div>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">Recent Orders</h2>
          <Link href="/admin/orders" className="text-sm font-semibold text-primary-600 hover:text-primary-700">
            View all
          </Link>
        </div>
        {recentOrders.length === 0 ? (
          <div className="card p-10 text-center text-sm text-dark-400">No orders yet</div>
        ) : (
          <div className="card overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-dark-100 text-left text-xs uppercase tracking-wider text-dark-400">
                  <th className="px-4 py-3">Order</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-100">
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-4 py-3 font-medium">
                      #{order.id.slice(-8).toUpperCase()}
                    </td>
                    <td className="px-4 py-3">{order.user?.name || order.email}</td>
                    <td className="px-4 py-3 text-dark-500">{formatDate(order.createdAt)}</td>
                    <td className="px-4 py-3">
                      <span className="badge-gray">{order.status}</span>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold">
                      {formatPrice(order.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}