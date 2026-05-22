'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Minus, Plus, ShoppingCart, X } from 'lucide-react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useCartStore } from '@/store/cartStore'
import { formatPrice, DIETARY_TAG_LABELS } from '@/lib/utils'
import { toast } from '@/components/ui/use-toast'

interface ModifierOption {
  label: string
  price: number
}

interface Modifier {
  id: string
  name: string
  options: ModifierOption[]
  required: boolean
  maxSelections: number
}

export interface MenuItem {
  id: string
  name: string
  description: string | null
  price: number
  imageUrl: string | null
  isAvailable: boolean
  dietaryTags: string[]
  preparationTime: number
  modifiers: Modifier[]
}

interface ItemModalProps {
  item: MenuItem | null
  open: boolean
  onClose: () => void
}

export function ItemModal({ item, open, onClose }: ItemModalProps) {
  const [quantity, setQuantity] = useState(1)
  const [selectedModifiers, setSelectedModifiers] = useState<Record<string, string[]>>({})
  const { addItem } = useCartStore()

  if (!item) return null

  const toggleModifier = (modifierId: string, option: string, maxSel: number) => {
    setSelectedModifiers((prev) => {
      const current = prev[modifierId] || []
      if (current.includes(option)) {
        return { ...prev, [modifierId]: current.filter((o) => o !== option) }
      }
      if (current.length >= maxSel) {
        return { ...prev, [modifierId]: maxSel === 1 ? [option] : current }
      }
      return { ...prev, [modifierId]: [...current, option] }
    })
  }

  const modifierTotal = item.modifiers.reduce((sum, mod) => {
    const selected = selectedModifiers[mod.id] || []
    return sum + selected.reduce((s, opt) => {
      const o = mod.options.find((o) => o.label === opt)
      return s + (o?.price || 0)
    }, 0)
  }, 0)

  const lineTotal = (item.price + modifierTotal) * quantity

  const handleAdd = () => {
    const mods = item.modifiers.flatMap((mod) =>
      (selectedModifiers[mod.id] || []).map((opt) => {
        const o = mod.options.find((o) => o.label === opt)!
        return { name: mod.name, option: opt, price: o.price }
      })
    )
    addItem({
      menuItemId: item.id,
      name: item.name,
      price: item.price,
      quantity,
      selectedModifiers: mods,
      imageUrl: item.imageUrl || undefined,
    })
    toast({ title: 'Added to cart!', description: `${quantity}x ${item.name}`, variant: 'default' })
    setQuantity(1)
    setSelectedModifiers({})
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="p-0 overflow-hidden max-w-xl">
        {/* Image */}
        <div className="relative h-56 w-full">
          <Image
            src={item.imageUrl || 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&q=80'}
            alt={item.name}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <div className="absolute bottom-3 left-4 flex gap-2">
            {item.dietaryTags.map((tag) => {
              const t = DIETARY_TAG_LABELS[tag]
              return t ? (
                <span key={tag} className={`text-xs px-2 py-0.5 rounded-full font-medium ${t.color}`}>
                  {t.label}
                </span>
              ) : null
            })}
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-start justify-between gap-4 mb-3">
            <h2 className="text-xl font-bold">{item.name}</h2>
            <span className="text-xl font-bold text-primary-500 flex-shrink-0">{formatPrice(item.price)}</span>
          </div>
          {item.description && (
            <p className="text-sm text-muted-foreground leading-relaxed mb-5">{item.description}</p>
          )}
          <p className="text-xs text-muted-foreground mb-5">Prep time: ~{item.preparationTime} min</p>

          {/* Modifiers */}
          {item.modifiers.map((mod) => (
            <div key={mod.id} className="mb-5">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-sm">{mod.name}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${mod.required ? 'bg-red-100 text-red-600' : 'bg-muted text-muted-foreground'}`}>
                  {mod.required ? 'Required' : 'Optional'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {mod.options.map((opt) => {
                  const isSelected = (selectedModifiers[mod.id] || []).includes(opt.label)
                  return (
                    <button
                      key={opt.label}
                      onClick={() => toggleModifier(mod.id, opt.label, mod.maxSelections)}
                      className={`flex items-center justify-between px-3 py-2 rounded-xl text-sm border transition-all ${
                        isSelected
                          ? 'border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900/20'
                          : 'border-border hover:border-muted-foreground'
                      }`}
                    >
                      <span>{opt.label}</span>
                      {opt.price > 0 && <span className="text-muted-foreground">+{formatPrice(opt.price)}</span>}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}

          {/* Quantity + Add */}
          <div className="flex items-center gap-4 mt-6">
            <div className="flex items-center gap-1 bg-muted rounded-xl p-1">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-background transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center font-semibold">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-background transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <Button onClick={handleAdd} size="lg" className="flex-1 gap-2" disabled={!item.isAvailable}>
              <ShoppingCart className="w-4 h-4" />
              Add to Cart — {formatPrice(lineTotal)}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
