'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface SelectedModifier {
  name: string
  option: string
  price: number
}

export interface CartItem {
  id: string
  menuItemId: string
  name: string
  price: number
  quantity: number
  selectedModifiers: SelectedModifier[]
  imageUrl?: string
}

interface AppliedCoupon {
  code: string
  type: 'PERCENTAGE' | 'FIXED'
  value: number
}

interface CartStore {
  items: CartItem[]
  appliedCoupon: AppliedCoupon | null
  isOpen: boolean

  addItem: (item: Omit<CartItem, 'id'>) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, qty: number) => void
  clearCart: () => void
  applyCoupon: (coupon: AppliedCoupon) => void
  removeCoupon: () => void
  setOpen: (open: boolean) => void

  subtotal: () => number
  discount: () => number
  deliveryFee: () => number
  total: () => number
}

function generateId(): string {
  return Math.random().toString(36).slice(2, 9)
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      appliedCoupon: null,
      isOpen: false,

      addItem: (newItem) => {
        const existing = get().items.find(
          (i) =>
            i.menuItemId === newItem.menuItemId &&
            JSON.stringify(i.selectedModifiers) === JSON.stringify(newItem.selectedModifiers)
        )
        if (existing) {
          set((state) => ({
            items: state.items.map((i) =>
              i.id === existing.id ? { ...i, quantity: i.quantity + newItem.quantity } : i
            ),
          }))
        } else {
          set((state) => ({
            items: [...state.items, { ...newItem, id: generateId() }],
          }))
        }
      },

      removeItem: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),

      updateQuantity: (id, qty) => {
        if (qty <= 0) {
          get().removeItem(id)
          return
        }
        set((state) => ({
          items: state.items.map((i) => (i.id === id ? { ...i, quantity: qty } : i)),
        }))
      },

      clearCart: () => set({ items: [], appliedCoupon: null }),

      applyCoupon: (coupon) => set({ appliedCoupon: coupon }),

      removeCoupon: () => set({ appliedCoupon: null }),

      setOpen: (open) => set({ isOpen: open }),

      subtotal: () =>
        get().items.reduce((sum, item) => {
          const modifierTotal = item.selectedModifiers.reduce((s, m) => s + m.price, 0)
          return sum + (item.price + modifierTotal) * item.quantity
        }, 0),

      discount: () => {
        const coupon = get().appliedCoupon
        if (!coupon) return 0
        const subtotal = get().subtotal()
        if (coupon.type === 'PERCENTAGE') return (subtotal * coupon.value) / 100
        return coupon.value
      },

      deliveryFee: () => {
        const subtotal = get().subtotal()
        return subtotal > 0 && subtotal < 1500 ? 150 : 0
      },

      total: () => {
        const subtotal = get().subtotal()
        const discount = get().discount()
        const deliveryFee = get().deliveryFee()
        return Math.max(0, subtotal - discount + deliveryFee)
      },
    }),
    {
      name: 'spice-garden-cart',
      partialize: (state) => ({
        items: state.items,
        appliedCoupon: state.appliedCoupon,
      }),
    }
  )
)
