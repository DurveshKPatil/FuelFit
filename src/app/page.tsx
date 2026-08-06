import { getFeaturedProducts } from '@/lib/data'
import ProductCard from '@/components/products/ProductCard'
import Link from 'next/link'
import { ArrowRight, ShieldCheck, Truck, Leaf, RotateCcw } from 'lucide-react'

const features = [
  {
    icon: Truck,
    title: 'Fast Free Shipping',
    desc: 'Free shipping on orders over $75, delivered in 5-7 business days.',
  },
  {
    icon: ShieldCheck,
    title: 'Third-Party Tested',
    desc: 'Every batch is independently tested for purity and label accuracy.',
  },
  {
    icon: RotateCcw,
    title: '30-Day Guarantee',
    desc: 'Not satisfied? Full refund within 30 days, no questions asked.',
  },
  {
    icon: Leaf,
    title: 'Clean Ingredients',
    desc: 'No artificial colors, no fillers, no proprietary blends. Ever.',
  },
]

export default async function HomePage() {
  const featured = await getFeaturedProducts()

  return (
    <div>
      <section className="relative overflow-hidden bg-dark-950 text-white">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1920&q=80"
            alt=""
            className="h-full w-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-dark-950 via-dark-950/80 to-dark-950/40" />
        </div>
        <div className="container-page relative py-24 lg:py-32">
          <p className="badge-primary mb-4 rounded-full bg-primary-600/20 text-primary-300">
            New: Subscription Savings Up to 20%
          </p>
          <h1 className="max-w-2xl text-4xl font-bold sm:text-5xl lg:text-6xl">
            Fuel Your Gains With{' '}
            <span className="text-primary-500">Premium Protein</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-dark-300">
            Clean, third-party-tested protein powders and supplements engineered by
            athletes, for athletes. Free shipping over $75.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/products" className="btn-primary px-6 py-3 text-base">
              Shop Protein
            </Link>
            <Link
              href="/products?sort=featured"
              className="btn px-6 py-3 text-base text-white ring-1 ring-white/30 hover:bg-white/10"
            >
              Best Sellers <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
          <div className="mt-12 flex flex-wrap gap-8 text-sm text-dark-300">
            <div>
              <p className="text-2xl font-bold text-white">27g+</p>
              <p>Protein Per Serving</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">50K+</p>
              <p>Happy Customers</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">4.9/5</p>
              <p>Average Rating</p>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page py-16">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div key={f.title} className="flex gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-100 text-primary-600">
                <f.icon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold">{f.title}</h3>
                <p className="mt-1 text-sm text-dark-500">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-dark-50 py-16">
        <div className="container-page">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-wider text-primary-600">
                Best Sellers
              </p>
              <h2 className="section-title mt-1">Customer Favorites</h2>
            </div>
            <Link href="/products" className="hidden items-center gap-1 text-sm font-semibold text-primary-600 hover:text-primary-700 sm:flex">
              View all products <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="mt-8 text-center sm:hidden">
            <Link href="/products" className="btn-secondary">
              View all products
            </Link>
          </div>
        </div>
      </section>

      <section className="container-page grid gap-8 py-16 lg:grid-cols-2">
        <div className="relative overflow-hidden rounded-2xl bg-dark-900 p-10 text-white">
          <img
            src="https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&q=80"
            alt="Subscriptions"
            className="absolute inset-0 h-full w-full object-cover opacity-20"
          />
          <div className="relative">
            <p className="text-sm font-medium uppercase tracking-wider text-primary-400">
              Subscribe & Save
            </p>
            <h2 className="mt-2 text-3xl font-bold">Never Run Out Again</h2>
            <p className="mt-4 max-w-md text-dark-300">
              Get 20% off, free shipping, and flexible scheduling with our
              subscription plans. Pause or cancel anytime.
            </p>
            <Link href="/products?subscription=true" className="btn-primary mt-6">
              Start Saving 20%
            </Link>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-2xl bg-primary-600 p-10 text-white">
          <img
            src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=80"
            alt="Bundle and save"
            className="absolute inset-0 h-full w-full object-cover opacity-20"
          />
          <div className="relative">
            <p className="text-sm font-medium uppercase tracking-wider text-primary-100">
              Bundle & Save
            </p>
            <h2 className="mt-2 text-3xl font-bold">Build Your Stack</h2>
            <p className="mt-4 max-w-md text-primary-50">
              Combine protein, BCAAs, and creatine to save up to 25%. Perfect
              stacks for cutting, bulking, or maintenance.
            </p>
            <Link href="/products?category=bundles" className="btn mt-6 bg-white text-primary-700 hover:bg-primary-50">
              Shop Bundles
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-dark-100 bg-dark-950 py-16 text-center text-white">
        <div className="container-page max-w-2xl">
          <h2 className="text-3xl font-bold">Ready to Reach Your Goals?</h2>
          <p className="mt-4 text-dark-300">
            Join 50,000+ athletes who trust FuelFit for their protein.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link href="/products" className="btn-primary px-8 py-3">
              Shop Now
            </Link>
            <Link href="/register" className="btn px-8 py-3 text-white ring-1 ring-white/30 hover:bg-white/10">
              Create Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}