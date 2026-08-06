'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem, CartState, Product } from '@/types'

function getItemKey(productId: string, variant?: Record<string, any> | null) {
  return productId + (variant ? JSON.stringify(variant) : '')
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (product: Product, quantity = 1, variant?: Record<string, any>) =>
        set((state) => {
          const key = getItemKey(product.id, variant)
          const existing = state.items.find((item) => getItemKey(item.productId, item.variant) === key)

          if (existing) {
            return {
              items: state.items.map((item) =>
                getItemKey(item.productId, item.variant) === key
                  ? { ...item, quantity: Math.min(item.quantity + quantity, item.product.inventory || 99) }
                  : item
              ),
            }
          }

          return {
            items: [
              ...state.items,
              {
                id: key,
                productId: product.id,
                product,
                quantity: Math.min(quantity, product.inventory || 99),
                variant,
              },
            ],
          }
        }),
      removeItem: (productId: string, variant?: Record<string, any>) =>
        set((state) => ({
          items: state.items.filter((item) => getItemKey(item.productId, item.variant) !== getItemKey(productId, variant)),
        })),
      updateQuantity: (productId: string, quantity: number, variant?: Record<string, any>) =>
        set((state) => ({
          items: state.items
            .map((item) =>
              getItemKey(item.productId, item.variant) === getItemKey(productId, variant)
                ? { ...item, quantity: Math.max(0, Math.min(quantity, item.product.inventory || 99)) }
                : item
            )
            .filter((item) => item.quantity > 0),
        })),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'protein-store-cart',
    }
  )
)

export function useCartTotals() {
  const items = useCartStore((state) => state.items)
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
  return { subtotal, itemCount }
}