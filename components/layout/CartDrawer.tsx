'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Tag, X } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useCartStore } from '@/store/cartStore'
import { formatPrice } from '@/lib/utils'

export function CartDrawer() {
  const {
    items, isOpen, setOpen,
    removeItem, updateQuantity,
    appliedCoupon, removeCoupon,
    subtotal, discount, deliveryFee, total,
  } = useCartStore()

  const sub = subtotal()
  const disc = discount()
  const fee = deliveryFee()
  const tot = total()

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent side="right" className="w-full sm:max-w-md flex flex-col p-0">
        <SheetHeader className="px-6 py-4 border-b">
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-primary-500" />
            Your Cart
            {items.length > 0 && (
              <span className="ml-auto text-sm font-normal text-muted-foreground">
                {items.reduce((s, i) => s + i.quantity, 0)} items
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 gap-4 px-6">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center">
              <ShoppingBag className="w-10 h-10 text-muted-foreground" />
            </div>
            <div className="text-center">
              <p className="font-semibold text-lg">Your cart is empty</p>
              <p className="text-sm text-muted-foreground mt-1">Add delicious dishes to get started</p>
            </div>
            <Button asChild onClick={() => setOpen(false)}>
              <Link href="/menu">Browse Menu</Link>
            </Button>
          </div>
        ) : (
          <>
            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              <AnimatePresence>
                {items.map((item) => {
                  const modifierTotal = item.selectedModifiers.reduce((s, m) => s + m.price, 0)
                  const itemTotal = (item.price + modifierTotal) * item.quantity
                  return (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex gap-3"
                    >
                      {item.imageUrl && (
                        <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                          <Image src={item.imageUrl} alt={item.name} width={64} height={64} className="object-cover w-full h-full" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{item.name}</p>
                        {item.selectedModifiers.length > 0 && (
                          <p className="text-xs text-muted-foreground mt-0.5 truncate">
                            {item.selectedModifiers.map((m) => m.option).join(', ')}
                          </p>
                        )}
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-1 bg-muted rounded-lg p-0.5">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-background transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-background transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold">{formatPrice(itemTotal)}</span>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="w-7 h-7 flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors rounded-lg hover:bg-muted"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>

            {/* Summary */}
            <div className="border-t px-6 py-4 space-y-3">
              {appliedCoupon && (
                <div className="flex items-center justify-between text-sm bg-green-50 dark:bg-green-900/20 rounded-xl px-3 py-2">
                  <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                    <Tag className="w-4 h-4" />
                    <span className="font-medium">{appliedCoupon.code}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-700 dark:text-green-400">-{formatPrice(disc)}</span>
                    <button onClick={removeCoupon} className="text-muted-foreground hover:text-foreground">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>{formatPrice(sub)}</span>
                </div>
                {disc > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-{formatPrice(disc)}</span>
                  </div>
                )}
                <div className="flex justify-between text-muted-foreground">
                  <span>Delivery fee</span>
                  <span>{fee === 0 ? <span className="text-green-600">Free</span> : formatPrice(fee)}</span>
                </div>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold text-base">
                <span>Total</span>
                <span className="text-primary-500">{formatPrice(tot)}</span>
              </div>
              {fee > 0 && (
                <p className="text-xs text-muted-foreground">
                  Add {formatPrice(1500 - sub)} more for free delivery
                </p>
              )}
              <Button asChild size="lg" className="w-full mt-2" onClick={() => setOpen(false)}>
                <Link href="/order" className="flex items-center gap-2">
                  Checkout — {formatPrice(tot)}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
