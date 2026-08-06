'use client'

import { useEffect, useState } from 'react'
import { Users } from 'lucide-react'
import { formatDate, getInitials } from '@/lib/utils'

export default function AdminCustomers() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin?type=users')
      .then((r) => r.json())
      .then((data) => setUsers(data.users || []))
      .catch(() => setUsers([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold">Customers</h2>
        <p className="text-sm text-dark-500">{users.length} registered users</p>
      </div>

      {loading ? (
        <div className="card p-10 text-center text-sm text-dark-400">Loading customers...</div>
      ) : users.length === 0 ? (
        <div className="card p-10 text-center">
          <Users className="mx-auto h-10 w-10 text-dark-300" />
          <p className="mt-3 text-sm text-dark-500">No customers yet.</p>
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-dark-100 text-left text-xs uppercase tracking-wider text-dark-400">
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-dark-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-700">
                        {getInitials(user.name)}
                      </div>
                      <span className="font-medium">{user.name || 'No name'}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3">
                    {user.role === 'ADMIN' ? (
                      <span className="badge-primary">Admin</span>
                    ) : (
                      <span className="badge-gray">Customer</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-dark-500">{formatDate(user.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}