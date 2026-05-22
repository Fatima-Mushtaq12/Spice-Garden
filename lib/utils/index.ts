import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(amount: number): string {
  return `PKR ${amount.toLocaleString('en-PK')}`
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('en-PK', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function formatTime(date: Date | string): string {
  return new Date(date).toLocaleTimeString('en-PK', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function slugify(text: string): string {
  return text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text
  return text.slice(0, length) + '...'
}

export function generateOrderRef(id: string): string {
  return id.slice(-6).toUpperCase()
}

export const ORDER_STATUS_LABELS: Record<string, string> = {
  PENDING: 'Order Received',
  CONFIRMED: 'Confirmed',
  PREPARING: 'Being Prepared',
  READY: 'Ready for Pickup',
  OUT_FOR_DELIVERY: 'Out for Delivery',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
}

export const DIETARY_TAG_LABELS: Record<string, { label: string; color: string }> = {
  vegetarian: { label: 'Vegetarian', color: 'bg-green-100 text-green-700' },
  vegan: { label: 'Vegan', color: 'bg-emerald-100 text-emerald-700' },
  spicy: { label: 'Spicy', color: 'bg-red-100 text-red-700' },
  halal: { label: 'Halal', color: 'bg-teal-100 text-teal-700' },
  'gluten-free': { label: 'Gluten Free', color: 'bg-yellow-100 text-yellow-700' },
}
