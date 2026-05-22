'use client'

import { create } from 'zustand'

interface SessionStore {
  restaurantId: string | null
  setRestaurantId: (id: string) => void
}

export const useSessionStore = create<SessionStore>((set) => ({
  restaurantId: null,
  setRestaurantId: (id) => set({ restaurantId: id }),
}))
