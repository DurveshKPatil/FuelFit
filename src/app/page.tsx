import { getFeaturedProducts } from '@/lib/data'
import ProductCard from '@/components/products/ProductCard'
import Link from 'next/link'
import { ArrowRight, ShieldCheck, Truck, ExternalLink, ShoppingCart } from 'lucide-react'

const features = [
  {
    icon: ShoppingCart,
    title: 'Easy Shopping',
    desc: 'Browse products, add to cart, and checkout seamlessly on Amazon.in.',
  },
  {
    icon: ShieldCheck,
    title: 'Trusted Products',
    desc: 'We curate only the best nutrition products from reputable brands.',
  },
  {
    icon: ExternalLink,
    title: 'Secure Checkout',
    desc: 'All purchases are processed through Amazon.in for secure payment.',
  },
  {
    icon: Truck,
    title: 'Fast Delivery',
    desc: 'Enjoy Amazon\'s fast and reliable delivery across India.',
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
            Shop on FuelFit &bull; Checkout on Amazon.in
          </p>
          <h1 className="max-w-2xl text-4xl font-bold sm:text-5xl lg:text-6xl">
            Fuel Your Gains With{' '}
            <span className="text-primary-500">Premium Nutrition</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-dark-300">
            Discover top-rated nutrition products. Browse, add to cart, and
            complete your purchase on Amazon.in for secure checkout.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/products" className="btn-primary px-6 py-3 text-base">
              Shop Now
            </Link>
            <Link
              href="/about#how-it-works"
              className="btn px-6 py-3 text-base text-white ring-1 ring-white/30 hover:bg-white/10"
            >
              How It Works <ArrowRight className="ml-2 h-4 w-4" />
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

      <section className="container-page py-16">
        <div className="card mx-auto max-w-2xl p-10 text-center">
          <h2 className="text-3xl font-bold">How It Works</h2>
          <p className="mt-4 text-dark-600">
            Shopping with FuelFit is simple. Browse our curated products, add them
            to your cart, and when you&apos;re ready, click &quot;Buy on Amazon&quot; to
            complete your purchase on Amazon.in.
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            <div>
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-lg font-bold text-primary-700">1</div>
              <p className="mt-2 font-semibold">Browse</p>
              <p className="text-sm text-dark-500">Find products you love</p>
            </div>
            <div>
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-lg font-bold text-primary-700">2</div>
              <p className="mt-2 font-semibold">Add to Cart</p>
              <p className="text-sm text-dark-500">Select quantities</p>
            </div>
            <div>
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-lg font-bold text-primary-700">3</div>
              <p className="mt-2 font-semibold">Buy on Amazon</p>
              <p className="text-sm text-dark-500">Secure checkout</p>
            </div>
          </div>
          <Link href="/about#how-it-works" className="btn-primary mt-8 inline-block">
            Learn More
          </Link>
        </div>
      </section>

      <section className="border-t border-dark-100 bg-dark-950 py-16 text-center text-white">
        <div className="container-page max-w-2xl">
          <h2 className="text-3xl font-bold">Ready to Reach Your Goals?</h2>
          <p className="mt-4 text-dark-300">
            Join 50,000+ athletes who trust FuelFit for their nutrition.
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
