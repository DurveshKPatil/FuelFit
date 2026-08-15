'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { User, Settings, LayoutDashboard } from 'lucide-react'
import { cn, getInitials } from '@/lib/utils'

export default function AccountLayout({
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

  if (!session) {
    router.push('/login?callbackUrl=' + pathname)
    return null
  }

  const navItems = [
    { name: 'Overview', href: '/account', icon: User },
    { name: 'Settings', href: '/account/settings', icon: Settings },
  ]

  return (
    <div className="container-page py-8">
      <div className="mb-8 flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-100 text-xl font-bold text-primary-700">
          {getInitials(session.user.name)}
        </div>
        <div>
          <h1 className="text-2xl font-bold">{session.user.name || 'My Account'}</h1>
          <p className="text-sm text-dark-500">{session.user.email}</p>
        </div>
      </div>

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
          {session.user.role === 'ADMIN' && (
            <Link
              href="/admin"
              className={cn(
                'flex shrink-0 items-center gap-2.5 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors',
                pathname === '/admin'
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-dark-600 hover:bg-dark-50'
              )}
            >
              <LayoutDashboard className="h-4 w-4" />
              Admin Dashboard
            </Link>
          )}
        </aside>
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  )
}
