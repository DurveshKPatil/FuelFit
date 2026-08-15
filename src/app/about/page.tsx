'use client'

import { useState } from 'react'
import { useToast } from '@/components/ui/Toaster'

export default function AboutPage() {
  const { toast } = useToast()
  const [submitted, setSubmitted] = useState(false)
  return (
    <div>
      <section className="bg-dark-950 py-16 text-white">
        <div className="container-page">
          <p className="text-sm font-medium uppercase tracking-wider text-primary-400">
            About FuelFit
          </p>
          <h1 className="mt-2 max-w-2xl text-4xl font-bold">
            Your trusted partner for premium nutrition
          </h1>
          <p className="mt-4 max-w-2xl text-dark-300">
            We curate the best nutrition products from top brands and bring them to you
            through our partnership with Amazon.in. Browse our selection, add to cart,
            and complete your purchase on Amazon for a secure, trusted shopping experience.
          </p>
        </div>
      </section>

      <section id="how-it-works" className="container-page py-16">
        <h2 className="section-title mb-8 text-center">How It Works</h2>
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="card p-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-xl font-bold text-primary-700">1</div>
            <h3 className="mt-4 text-xl font-bold">Browse Products</h3>
            <p className="mt-3 text-dark-600">
              Explore our curated selection of premium nutrition products. Read reviews,
              check nutrition facts, and find what&apos;s right for you.
            </p>
          </div>
          <div className="card p-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-xl font-bold text-primary-700">2</div>
            <h3 className="mt-4 text-xl font-bold">Add to Cart</h3>
            <p className="mt-3 text-dark-600">
              Found something you like? Add it to your cart. You can add multiple
              products from different brands.
            </p>
          </div>
          <div className="card p-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-xl font-bold text-primary-700">3</div>
            <h3 className="mt-4 text-xl font-bold">Buy on Amazon</h3>
            <p className="mt-3 text-dark-600">
              When you&apos;re ready, click &quot;Buy on Amazon&quot; and you&apos;ll be
              redirected to Amazon.in to complete your secure purchase.
            </p>
          </div>
        </div>
      </section>

      <section className="container-page py-16">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="card p-8">
            <h3 className="text-xl font-bold">Our Mission</h3>
            <p className="mt-3 text-dark-600">
              To make clean, effective, and honestly-labeled nutrition accessible to
              everyone — from first-time gym goers to professional athletes.
            </p>
          </div>
          <div className="card p-8">
            <h3 className="text-xl font-bold">Trusted Partners</h3>
            <p className="mt-3 text-dark-600">
              We partner with Amazon.in to bring you authentic products with secure
              payment, fast delivery, and easy returns.
            </p>
          </div>
          <div className="card p-8">
            <h3 className="text-xl font-bold">Quality First</h3>
            <p className="mt-3 text-dark-600">
              We carefully select products from reputable brands that meet our
              standards for quality, transparency, and value.
            </p>
          </div>
        </div>
      </section>

      <section id="faq" className="bg-dark-50 py-16">
        <div className="container-page max-w-3xl">
          <h2 className="section-title mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              {
                q: 'How does FuelFit work?',
                a: 'FuelFit is an affiliate partner of Amazon. We curate and list products on our site. When you click "Buy on Amazon", you\'re redirected to Amazon.in to complete your purchase. Your order, payment, and shipping are all handled by Amazon.',
              },
              {
                q: 'Why should I buy through FuelFit?',
                a: 'We do the research to find the best nutrition products so you don\'t have to. Our curated selection saves you time, and you still get all the benefits of shopping on Amazon — secure payment, fast delivery, and easy returns.',
              },
              {
                q: 'Is my payment secure?',
                a: 'Yes! All payments are processed through Amazon.in, one of the world\'s most trusted e-commerce platforms. We never see or store your payment information.',
              },
              {
                q: 'What about returns and refunds?',
                a: 'Since your purchase is through Amazon.in, you\'re covered by Amazon\'s return policy. You can return products directly through Amazon for a full refund.',
              },
              {
                q: 'Do you charge extra fees?',
                a: 'No. The prices you see on our site match the prices on Amazon. We earn a small commission from Amazon for referring you, at no extra cost to you.',
              },
            ].map((item) => (
              <div key={item.q} className="card p-6">
                <h3 className="font-semibold">{item.q}</h3>
                <p className="mt-2 text-sm text-dark-600">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="container-page max-w-3xl py-16">
        <h2 className="section-title mb-8 text-center">Contact Us</h2>
        <form
          className="card space-y-4 p-8"
          onSubmit={(e) => {
            e.preventDefault()
            setSubmitted(true)
            toast('Message sent! We will get back to you soon.', 'success')
          }}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Name</label>
              <input className="input" required />
            </div>
            <div>
              <label className="label">Email</label>
              <input type="email" className="input" required />
            </div>
          </div>
          <div>
            <label className="label">Message</label>
            <textarea className="input" rows={5} required />
          </div>
          <button className="btn-primary">{submitted ? 'Message Sent!' : 'Send Message'}</button>
        </form>
      </section>

      <section className="border-t border-dark-100 bg-dark-50 py-8">
        <div className="container-page max-w-3xl text-center text-sm text-dark-500">
          <p>
            As an Amazon Associate, FuelFit earns from qualifying purchases. This
            helps us keep the site running at no extra cost to you.
          </p>
        </div>
      </section>
    </div>
  )
}
