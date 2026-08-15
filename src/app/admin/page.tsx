'use client'

import { useEffect, useState } from 'react'
import { Package } from 'lucide-react'

interface Stats {
  products: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin?type=products')
      .then((r) => r.json())
      .then((data) => {
        setStats({
          products: (data.products || []).length,
        })
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <div className="card p-10 text-center text-sm text-dark-400">Loading dashboard...</div>
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-dark-500">Products</p>
              <p className="mt-1 text-xl font-bold">{stats?.products ?? 0}</p>
            </div>
            <Package className="h-6 w-6 text-primary-600" />
          </div>
        </div>
      </div>

      <div className="card p-10 text-center text-sm text-dark-400">
        <p className="font-medium text-dark-600">Amazon Affiliate Dashboard</p>
        <p className="mt-2">
          Products are listed on your site. When customers click &quot;Buy on Amazon&quot;,
          they&apos;ll be redirected to Amazon.in to complete their purchase.
        </p>
      </div>
    </div>
  )
}
