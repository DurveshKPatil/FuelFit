import type { Metadata } from 'next'
import { Inter, Caladea } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import CartDrawer from '@/components/cart/CartDrawer'
import { Toaster } from '@/components/ui/Toaster'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const caladea = Caladea({ weight: ['400', '700'], subsets: ['latin'], variable: '--font-display' })

export const metadata: Metadata = {
  title: {
    default: 'FuelFit Protein | Premium Protein Supplements',
    template: '%s | FuelFit Protein',
  },
  description:
    'Shop premium protein powders, isolates, casein, plant proteins, and more. Fast shipping, money-back guarantee, and subscription savings.',
  keywords: ['protein powder', 'whey protein', 'supplements', 'muscle building', 'protein'],
  openGraph: {
    title: 'FuelFit Protein',
    description: 'Premium protein supplements for every goal.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${caladea.variable}`}>
      <body className="flex min-h-screen flex-col font-sans">
        <Providers>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <CartDrawer />
          <Toaster />
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}