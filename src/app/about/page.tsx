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
            Premium protein, engineered by athletes for athletes
          </h1>
          <p className="mt-4 max-w-2xl text-dark-300">
            We started FuelFit because we were tired of proprietary blends, hidden
            fillers, and protein that didn&apos;t deliver what the label promised.
            Every product we make is third-party tested, nutritionally transparent,
            and backed by a 30-day money-back guarantee.
          </p>
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
            <h3 className="text-xl font-bold">Our Standards</h3>
            <p className="mt-3 text-dark-600">
              No proprietary blends. No artificial colors. Every batch is tested by
              independent labs to verify purity, potency, and label accuracy.
            </p>
          </div>
          <div className="card p-8">
            <h3 className="text-xl font-bold">Our Guarantee</h3>
            <p className="mt-3 text-dark-600">
              Love your protein or get a full refund within 30 days. No questions
              asked, no restocking fees, no hassle.
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
                q: 'How much protein do I need per day?',
                a: 'Most active adults benefit from 1.6-2.2g of protein per kilogram of body weight daily. A single scoop of our protein delivers 24-27g to help you hit your targets.',
              },
              {
                q: 'When should I take protein?',
                a: 'Protein is most effective spread across the day. Many people prefer a shake post-workout or before bed, but consistent daily intake matters most.',
              },
              {
                q: 'Is your protein third-party tested?',
                a: 'Yes. Every batch is tested by independent laboratories to verify protein content, purity, and absence of banned substances.',
              },
              {
                q: 'How does the subscription work?',
                a: 'Choose your product, set a delivery schedule, and save 20% on every order. You can pause, skip, or cancel anytime from your account.',
              },
              {
                q: 'What is your return policy?',
                a: 'We offer a 30-day money-back guarantee. If you are not satisfied, contact us within 30 days for a full refund.',
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

      <section id="shipping" className="border-t border-dark-100 bg-dark-50 py-16">
        <div className="container-page max-w-3xl">
          <h2 className="section-title mb-8 text-center">Shipping & Returns</h2>
          <div className="space-y-4">
            <div className="card p-6">
              <h3 className="font-semibold">Shipping</h3>
              <p className="mt-2 text-sm text-dark-600">
                Free standard shipping on orders over $75. Orders ship within 24 hours
                and typically arrive in 5-7 business days.
              </p>
            </div>
            <div className="card p-6">
              <h3 className="font-semibold">Returns</h3>
              <p className="mt-2 text-sm text-dark-600">
                We offer a 30-day money-back guarantee on all products. Contact support
                to initiate a return and receive a prepaid shipping label.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}