const AMAZON_DOMAIN = process.env.AMAZON_DOMAIN || 'amazon.in'
const AFFILIATE_TAG = process.env.AMAZON_AFFILIATE_TAG || ''

export interface AmazonCartItem {
  asin: string
  quantity: number
  affiliateLink?: string
}

export function buildAmazonProductUrl(asin: string): string {
  const base = `https://www.${AMAZON_DOMAIN}/dp/${asin}`
  return AFFILIATE_TAG ? `${base}?tag=${AFFILIATE_TAG}` : base
}

export function buildAmazonCartUrl(items: AmazonCartItem[]): string {
  if (items.length === 0) return `https://www.${AMAZON_DOMAIN}`

  if (items.length === 1) {
    if (items[0].affiliateLink) return items[0].affiliateLink
    return buildAmazonProductUrl(items[0].asin)
  }

  const params = new URLSearchParams()
  items.forEach((item, index) => {
    const num = index + 1
    params.set(`ASIN.${num}`, item.asin)
    params.set(`Quantity.${num}`, String(item.quantity))
  })

  if (AFFILIATE_TAG) {
    params.set('tag', AFFILIATE_TAG)
  }

  return `https://www.${AMAZON_DOMAIN}/gp/cart/view.html?${params.toString()}`
}

export function buildAmazonSearchUrl(query: string): string {
  const params = new URLSearchParams({ k: query })
  if (AFFILIATE_TAG) {
    params.set('tag', AFFILIATE_TAG)
  }
  return `https://www.${AMAZON_DOMAIN}/s?${params.toString()}`
}
