'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Package, Clock } from 'lucide-react'
import { Order } from '@/types'
import { formatPrice, formatDate } from '@/lib/utils'

const statusStyles: Record<string, string> = {
  PENDING: 'badge-yellow',
  CONFIRMED: 'badge-gray',
  PROCESSING: 'badge-gray',
  SHIPPED: 'badge-primary',
  DELIVERED: 'badge-green',
  CANCELLED: 'badge-red',
  REFUNDED: 'badge-red',
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/orders')
      .then((r) => r.json())
      .then((data) => setOrders(data.orders || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <div className="card p-10 text-center text-sm text-dark-400">Loading orders...</div>
  }

  if (orders.length === 0) {
    return (
      <div className="card p-10 text-center">
        <Package className="mx-auto h-10 w-10 text-dark-300" />
        <p className="mt-3 text-sm text-dark-500">You haven&apos;t placed any orders yet.</p>
        <Link href="/products" className="btn-primary mt-4">
          Shop Protein
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div key={order.id} className="card overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-dark-100 bg-dark-50 px-5 py-3">
            <div>
              <p className="font-semibold">Order #{order.id.slice(-8).toUpperCase()}</p>
              <p className="flex items-center gap-1 text-xs text-dark-500">
                <Clock className="h-3 w-3" />
                Placed on {formatDate(order.createdAt)}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className={statusStyles[order.status] || 'badge-gray'}>{order.status}</span>
              <span className="font-bold">{formatPrice(order.total)}</span>
            </div>
          </div>
          <div className="divide-y divide-dark-100">
            {order.items?.map((item) => (
              <div key={item.id} className="flex items-center gap-4 px-5 py-3">
                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-dark-50">
                  {item.product ? (
                    <img
                      src={item.product.images[0] + '?w=112&h=112&fit=crop'}
                      alt={item.product.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-dark-300">
                      <Package className="h-6 w-6" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    {item.product?.name || `Product ${item.productId.slice(-8)}`}
                  </p>
                  <p className="text-xs text-dark-500">Qty: {item.quantity}</p>
                </div>
                <p className="text-sm font-semibold">{formatPrice(item.price * item.quantity)}</p>
              </div>
            ))}
          </div>
          {order.shippingAddress && (
            <div className="border-t border-dark-100 px-5 py-3 text-xs text-dark-500">
              Ship to: {(order.shippingAddress as any).name}, {(order.shippingAddress as any).street},{' '}
              {(order.shippingAddress as any).city}, {(order.shippingAddress as any).state}{' '}
              {(order.shippingAddress as any).zipCode}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}