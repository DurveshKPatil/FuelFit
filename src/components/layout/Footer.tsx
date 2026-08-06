'use client'

import Link from 'next/link'
import { Dumbbell } from 'lucide-react'

const shopLinks = [
  { name: 'Whey Protein', href: '/products?category=whey-protein' },
  { name: 'Plant Protein', href: '/products?category=plant-protein' },
  { name: 'Casein', href: '/products?category=casein' },
  { name: 'Bars & Snacks', href: '/products?category=bars-and-snacks' },
]

const helpLinks = [
  { name: 'About Us', href: '/about' },
  { name: 'Shipping & Returns', href: '/about#shipping' },
  { name: 'FAQ', href: '/about#faq' },
  { name: 'Contact', href: '/about#contact' },
]

export default function Footer() {
  return (
    <footer className="border-t border-dark-100 bg-dark-950 text-dark-200">
      <div className="container-page grid gap-8 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link href="/" className="flex items-center gap-2">
            <Dumbbell className="h-8 w-8 text-primary-400" />
            <span className="text-xl font-bold text-white">
              Fuel<span className="text-primary-400">Fit</span>
            </span>
          </Link>
          <p className="mt-4 max-w-xs text-sm text-dark-400">
            Premium protein supplements engineered by athletes, for athletes. Clean ingredients, third-party tested, and a 30-day money-back guarantee.
          </p>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">Shop</h3>
          <ul className="space-y-2.5">
            {shopLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm text-dark-400 transition-colors hover:text-white">
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">Help</h3>
          <ul className="space-y-2.5">
            {helpLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm text-dark-400 transition-colors hover:text-white">
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">Stay in the loop</h3>
          <p className="mb-4 text-sm text-dark-400">Get exclusive deals and fitness tips.</p>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex gap-2"
          >
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full rounded-lg border border-dark-700 bg-dark-900 px-3.5 py-2.5 text-sm text-white placeholder:text-dark-500 focus:border-primary-500 focus:outline-none"
            />
            <button className="rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-700">
              Join
            </button>
          </form>
        </div>
      </div>

      <div className="border-t border-dark-800">
        <div className="container-page flex flex-col items-center justify-between gap-4 py-6 sm:flex-row">
          <p className="text-sm text-dark-400">
            &copy; {new Date().getFullYear()} FuelFit Protein. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-xs text-dark-500">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Cookie Policy</span>
          </div>
        </div>
      </div>
    </footer>
  )
}