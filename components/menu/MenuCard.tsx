'use client'

import Image from 'next/image'
import { Plus } from 'lucide-react'
import { motion } from 'framer-motion'
import { useCartStore } from '@/store/cartStore'
import { formatPrice, DIETARY_TAG_LABELS } from '@/lib/utils'
import { toast } from '@/components/ui/use-toast'
import type { MenuItem } from './ItemModal'

interface MenuCardProps {
  item: MenuItem
  onOpen: (item: MenuItem) => void
  index: number
}

export function MenuCard({ item, onOpen, index }: MenuCardProps) {
  const { addItem } = useCartStore()

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!item.isAvailable) return
    if (item.modifiers.some((m) => m.required)) {
      onOpen(item)
      return
    }
    addItem({
      menuItemId: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      selectedModifiers: [],
      imageUrl: item.imageUrl || undefined,
    })
    toast({ title: 'Added!', description: item.name })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.05, 0.4) }}
      onClick={() => item.isAvailable && onOpen(item)}
      className={`group rounded-2xl border bg-card overflow-hidden transition-all duration-300 ${
        item.isAvailable
          ? 'hover:shadow-md hover:-translate-y-0.5 cursor-pointer'
          : 'opacity-60 cursor-not-allowed'
      }`}
    >
      {/* Image */}
      <div className="relative aspect-video overflow-hidden bg-muted">
        <Image
          src={item.imageUrl || 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&q=70'}
          alt={item.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className={`object-cover ${item.isAvailable ? 'group-hover:scale-105 transition-transform duration-500' : 'grayscale'}`}
        />
        {!item.isAvailable && (
          <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
            <span className="bg-background text-sm font-medium px-3 py-1 rounded-full border">Unavailable</span>
          </div>
        )}
        {/* Dietary tags */}
        <div className="absolute bottom-2 left-2 flex flex-wrap gap-1">
          {item.dietaryTags.slice(0, 2).map((tag) => {
            const t = DIETARY_TAG_LABELS[tag]
            return t ? (
              <span key={tag} className={`text-xs px-2 py-0.5 rounded-full font-medium backdrop-blur-sm ${t.color}`}>
                {t.label}
              </span>
            ) : null
          })}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold">{item.name}</h3>
        {item.description && (
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2 leading-relaxed">{item.description}</p>
        )}
        <div className="flex items-center justify-between mt-4">
          <span className="font-bold text-primary-500">{formatPrice(item.price)}</span>
          {item.isAvailable ? (
            <button
              onClick={handleQuickAdd}
              className="w-9 h-9 rounded-xl bg-primary-500 text-white flex items-center justify-center hover:bg-primary-600 active:scale-95 transition-all"
              aria-label={`Add ${item.name} to cart`}
            >
              <Plus className="w-4 h-4" />
            </button>
          ) : (
            <span className="text-xs text-muted-foreground px-2 py-1 bg-muted rounded-lg">Unavailable</span>
          )}
        </div>
      </div>
    </motion.div>
  )
}
