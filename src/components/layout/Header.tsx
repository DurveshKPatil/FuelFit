'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { useState } from 'react'
import { Search, ShoppingBag, User, Menu, X, Dumbbell } from 'lucide-react'
import { useCartStore, useCartTotals } from '@/store/cart'
import { cn } from '@/lib/utils'

const navLinks = [
  { name: 'Shop', href: '/products' },
  { name: 'Best Sellers', href: '/products?sort=featured' },
  { name: 'Subscriptions', href: '/products?subscription=true' },
  { name: 'About', href: '/about' },
]

export default function Header() {
  const [cartOpen, setCartOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [search, setSearch] = useState('')
  const pathname = usePathname()
  const router = useRouter()
  const { data: session } = useSession()
  const { itemCount } = useCartTotals()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (search.trim()) {
      router.push(`/products?q=${encodeURIComponent(search.trim())}`)
      setSearch('')
      setSearchOpen(false)
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-dark-100 bg-white/95 backdrop-blur">
      <div className="bg-dark-900 text-center text-xs text-white">
        <div className="container-page py-1.5">
          Free shipping on orders over $75 &bull; 30-day money-back guarantee
        </div>
      </div>

      <div className="container-page flex h-16 items-center justify-between gap-4">
        <button
          onClick={() => setMobileOpen(true)}
          className="rounded-md p-2 hover:bg-dark-50 lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <Link href="/" className="flex items-center gap-2">
          <Dumbbell className="h-8 w-8 text-primary-600" />
          <span className="text-xl font-bold tracking-tight">
            Fuel<span className="text-primary-600">Fit</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'text-sm font-medium text-dark-600 transition-colors hover:text-dark-900',
                pathname === link.href && 'text-dark-900'
              )}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          {searchOpen ? (
            <form onSubmit={handleSearch} className="flex items-center gap-1">
              <input
                autoFocus
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search proteins..."
                className="input w-48 md:w-64"
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="rounded-md p-2 hover:bg-dark-50"
                aria-label="Close search"
              >
                <X className="h-5 w-5" />
              </button>
            </form>
          ) : (
            <button
              onClick={() => setSearchOpen(true)}
              className="rounded-md p-2 hover:bg-dark-50"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>
          )}

          {session?.user ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 text-primary-700 hover:bg-primary-200"
                aria-label="Account"
              >
                <User className="h-5 w-5" />
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 top-12 w-56 rounded-xl border border-dark-200 bg-white p-2 shadow-lg animate-fade-in">
                  <div className="border-b border-dark-100 px-3 py-2">
                    <p className="text-sm font-semibold">{session.user.name || 'Account'}</p>
                    <p className="truncate text-xs text-dark-500">{session.user.email}</p>
                  </div>
                  <div className="mt-1 flex flex-col">
                    <Link
                      href="/account"
                      onClick={() => setUserMenuOpen(false)}
                      className="rounded-lg px-3 py-2 text-sm hover:bg-dark-50"
                    >
                      My Account
                    </Link>
                    <Link
                      href="/account/orders"
                      onClick={() => setUserMenuOpen(false)}
                      className="rounded-lg px-3 py-2 text-sm hover:bg-dark-50"
                    >
                      My Orders
                    </Link>
                    <Link
                      href="/account/subscriptions"
                      onClick={() => setUserMenuOpen(false)}
                      className="rounded-lg px-3 py-2 text-sm hover:bg-dark-50"
                    >
                      Subscriptions
                    </Link>
                    {session.user.role === 'ADMIN' && (
                      <Link
                        href="/admin"
                        onClick={() => setUserMenuOpen(false)}
                        className="rounded-lg px-3 py-2 text-sm text-primary-600 hover:bg-primary-50"
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={() => signOut({ callbackUrl: '/' })}
                      className="rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="rounded-md p-2 hover:bg-dark-50"
              aria-label="Sign in"
            >
              <User className="h-5 w-5" />
            </Link>
          )}

          <button
            onClick={() => {
              setCartOpen(true)
              const event = new CustomEvent('cart:open')
              window.dispatchEvent(event)
            }}
            className="relative rounded-md p-2 hover:bg-dark-50"
            aria-label="Shopping bag"
          >
            <ShoppingBag className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary-600 text-xs font-bold text-white">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 lg:hidden" onClick={() => setMobileOpen(false)}>
          <div
            className="flex h-full w-72 flex-col bg-white p-4 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-dark-100 pb-4">
              <span className="text-lg font-bold">
                Fuel<span className="text-primary-600">Fit</span>
              </span>
              <button onClick={() => setMobileOpen(false)} aria-label="Close menu">
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="mt-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-dark-700 hover:bg-dark-50"
                >
                  {link.name}
                </Link>
              ))}
              <div className="my-2 border-t border-dark-100" />
              {session?.user ? (
                <>
                  <Link
                    href="/account"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-lg px-3 py-2.5 text-sm font-medium text-dark-700 hover:bg-dark-50"
                  >
                    My Account
                  </Link>
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red-600 hover:bg-red-50"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-dark-700 hover:bg-dark-50"
                >
                  Sign In
                </Link>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}