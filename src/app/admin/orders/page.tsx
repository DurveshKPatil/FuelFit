'use client'

import { useEffect, useState } from 'react'
import { ShoppingCart } from 'lucide-react'
import { formatPrice, formatDate } from '@/lib/utils'
import { useToast } from '@/components/ui/Toaster'

const statuses = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED']

const statusStyles: Record<string, string> = {
  PENDING: 'badge-yellow',
  CONFIRMED: 'badge-gray',
  PROCESSING: 'badge-gray',
  SHIPPED: 'badge-primary',
  DELIVERED: 'badge-green',
  CANCELLED: 'badge-red',
  REFUNDED: 'badge-red',
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const fetchOrders = () => {
    setLoading(true)
    fetch('/api/admin?type=orders')
      .then((r) => r.json())
      .then((data) => setOrders(data.orders || []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const updateStatus = async (orderId: string, status: string) => {
    const res = await fetch('/api/admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'update-order-status', data: { orderId, status } }),
    })
    if (res.ok) {
      toast(`Order ${orderId.slice(-8).toUpperCase()} marked as ${status}`, 'success')
      fetchOrders()
    } else {
      toast('Failed to update order', 'error')
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold">Orders</h2>
        <p className="text-sm text-dark-500">{orders.length} total orders</p>
      </div>

      {loading ? (
        <div className="card p-10 text-center text-sm text-dark-400">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="card p-10 text-center">
          <ShoppingCart className="mx-auto h-10 w-10 text-dark-300" />
          <p className="mt-3 text-sm text-dark-500">No orders yet.</p>
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-dark-100 text-left text-xs uppercase tracking-wider text-dark-400">
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Items</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Update</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-100">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-dark-50">
                  <td className="px-4 py-3 font-medium">#{order.id.slice(-8).toUpperCase()}</td>
                  <td className="px-4 py-3">
                    <p>{order.user?.name || order.email.split('@')[0]}</p>
                    <p className="text-xs text-dark-400">{order.email}</p>
                  </td>
                  <td className="px-4 py-3 text-dark-500">{formatDate(order.createdAt)}</td>
                  <td className="px-4 py-3">
                    {order.items?.reduce((s: number, i: any) => s + i.quantity, 0)}
                  </td>
                  <td className="px-4 py-3 font-semibold">{formatPrice(order.total)}</td>
                  <td className="px-4 py-3">
                    <span className={statusStyles[order.status] || 'badge-gray'}>{order.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order.id, e.target.value)}
                      className="input w-32 py-1.5"
                    >
                      {statuses.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
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