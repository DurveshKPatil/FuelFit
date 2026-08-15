'use client'

import Link from 'next/link'
import { CheckCircle2, ExternalLink } from 'lucide-react'
import { buildAmazonProductUrl } from '@/lib/amazon'

export default function CheckoutSuccessPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
          <CheckCircle2 className="h-10 w-10 text-green-600" />
        </div>
        <h1 className="mt-6 text-3xl font-bold">Thank You!</h1>
        <p className="mt-3 text-dark-600">
          You&apos;re being redirected to Amazon.in to complete your purchase. If you
          weren&apos;t redirected automatically, click the button below.
        </p>

        <div className="mt-8 space-y-3">
          <a
            href="https://www.amazon.in"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary flex w-full items-center justify-center gap-2"
          >
            Go to Amazon.in
            <ExternalLink className="h-4 w-4" />
          </a>
          <Link href="/products" className="btn-secondary block w-full text-center">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}
