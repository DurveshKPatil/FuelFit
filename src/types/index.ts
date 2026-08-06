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

export interface Order {
  id: string
  userId: string
  email: string
  status: string
  subtotal: number
  tax: number
  shipping: number
  total: number
  stripePaymentId?: string | null
  shippingAddress?: Record<string, any> | null
  billingAddress?: Record<string, any> | null
  notes?: string | null
  items: OrderItem[]
  createdAt: Date
}

export interface OrderItem {
  id: string
  productId: string
  product: Product
  quantity: number
  price: number
  variant?: Record<string, any> | null
}

export interface Subscription {
  id: string
  userId: string
  productId: string
  stripePriceId: string
  stripeSubscriptionId?: string | null
  status: string
  interval: string
  quantity: number
  currentPeriodEnd?: Date | null
  cancelAtPeriodEnd: boolean
  product: Product
  createdAt: Date
}