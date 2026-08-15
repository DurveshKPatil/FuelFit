import type { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      role: string
    } & DefaultSession['user']
  }

  interface User {
    role?: string
  }
}

export type Role = 'CUSTOMER' | 'ADMIN'

export interface Product {
  id: string
  name: string
  slug: string
  description: string
  shortDesc?: string | null
  price: number
  compareAtPrice?: number | null
  images: string[]
  category: string
  flavor?: string | null
  size?: string | null
  weight?: string | null
  proteinPerServing?: number | null
  servingsPerContainer?: number | null
  ingredients?: string | null
  nutritionFacts?: any | null
  tags: string[]
  featured: boolean
  isActive: boolean
  inventory: number
  amazonAsin?: string | null
  affiliateLink?: string | null
  amazonUrl?: string | null
  rating?: number | null
  ratingCount?: number | null
  bestSellerRank?: string | null
  boughtInPastMonth?: string | null
  createdAt: Date
  updatedAt: Date
}

export interface CartItem {
  id: string
  productId: string
  product: Product
  quantity: number
  variant?: Record<string, any> | null
}

export interface CartState {
  items: CartItem[]
  addItem: (product: Product, quantity?: number, variant?: Record<string, any>) => void
  removeItem: (productId: string, variant?: Record<string, any>) => void
  updateQuantity: (productId: string, quantity: number, variant?: Record<string, any>) => void
  clearCart: () => void
}
