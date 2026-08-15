'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Package } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()

  if (status === 'loading') {
    return (
      <div className="container-page flex items-center justify-center py-24">
        <div className="animate-pulse text-sm text-dark-400">Loading...</div>
      </div>
    )
  }

  if (!session || session.user.role !== 'ADMIN') {
    router.push('/login?callbackUrl=/admin')
    return null
  }

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Products', href: '/admin/products', icon: Package },
  ]

  return (
    <div className="container-page py-8">
      <h1 className="mb-6 text-3xl font-bold">Admin Dashboard</h1>
      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        <aside className="flex gap-1 overflow-x-auto lg:flex-col">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex shrink-0 items-center gap-2.5 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors',
                pathname === item.href
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-dark-600 hover:bg-dark-50'
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          ))}
        </aside>
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  )
}
