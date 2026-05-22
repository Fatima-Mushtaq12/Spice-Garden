'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShoppingBag, Minus, Plus, Trash2, Tag, X, Truck, UtensilsCrossed,
  Package, Clock, CreditCard, Loader2, ArrowLeft, MapPin, CheckCircle,
} from 'lucide-react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { useCartStore } from '@/store/cartStore'
import { formatPrice } from '@/lib/utils'
import { toast } from '@/components/ui/use-toast'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '')

const checkoutSchema = z.object({
  type: z.enum(['DELIVERY', 'DINE_IN', 'TAKEAWAY']),
  name: z.string().min(2, 'Name required'),
  phone: z.string().min(10, 'Valid phone number required'),
  email: z.string().email().optional().or(z.literal('')),
  addressLine1: z.string().optional(),
  city: z.string().optional(),
  notes: z.string().optional(),
  scheduled: z.enum(['asap', 'schedule']).default('asap'),
  scheduledTime: z.string().optional(),
  couponCode: z.string().optional(),
})
type CheckoutForm = z.infer<typeof checkoutSchema>

export default function OrderPage() {
  const router = useRouter()
  const {
    items, appliedCoupon, removeCoupon,
    updateQuantity, removeItem,
    subtotal, discount, deliveryFee, total,
    applyCoupon, clearCart,
  } = useCartStore()

  const [orderType, setOrderType] = useState<'DELIVERY' | 'DINE_IN' | 'TAKEAWAY'>('DELIVERY')
  const [couponInput, setCouponInput] = useState('')
  const [couponLoading, setCouponLoading] = useState(false)
  const [step, setStep] = useState<'cart' | 'details' | 'payment'>('cart')
  const [orderId, setOrderId] = useState<string | null>(null)
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  const sub = subtotal()
  const disc = discount()
  const fee = deliveryFee()
  const tot = total()

  const { register, handleSubmit, formState: { errors } } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { type: 'DELIVERY', scheduled: 'asap' },
  })

  const handleCoupon = async () => {
    if (!couponInput.trim()) return
    setCouponLoading(true)
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponInput.trim().toUpperCase(), subtotal: sub }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Invalid coupon')
      applyCoupon({ code: data.code, type: data.type, value: data.value })
      toast({ title: 'Coupon applied!', description: `You saved ${formatPrice(data.discountAmount)}`, variant: 'default' })
      setCouponInput('')
    } catch (err: any) {
      toast({ title: 'Invalid coupon', description: err.message, variant: 'destructive' })
    } finally {
      setCouponLoading(false)
    }
  }

  const onDetailsSubmit = async (data: CheckoutForm) => {
    setIsCreating(true)
    try {
      const restaurantId = process.env.NEXT_PUBLIC_RESTAURANT_ID || 'default'
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          restaurantId,
          type: orderType,
          items: items.map((i) => ({
            menuItemId: i.menuItemId,
            quantity: i.quantity,
            unitPrice: i.price,
            selectedModifiers: i.selectedModifiers,
          })),
          deliveryAddress: orderType === 'DELIVERY' ? {
            line1: data.addressLine1,
            city: data.city || 'Lahore',
          } : undefined,
          couponCode: appliedCoupon?.code,
          notes: data.notes,
          contact: { name: data.name, phone: data.phone, email: data.email },
          paymentMethod: 'card',
        }),
      })
      const result = await res.json()
      if (!res.ok) throw new Error(result.error || 'Failed to create order')
      setOrderId(result.orderId)
      setClientSecret(result.clientSecret)
      setStep('payment')
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' })
    } finally {
      setIsCreating(false)
    }
  }

  if (items.length === 0 && step === 'cart') {
    return (
      <div className="container mx-auto px-4 py-24 flex flex-col items-center text-center">
        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="w-10 h-10 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
        <p className="text-muted-foreground mb-8">Add some delicious dishes to get started</p>
        <Button asChild size="lg"><Link href="/menu">Browse Menu</Link></Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex items-center gap-3 mb-8">
        {step !== 'cart' && (
          <button onClick={() => setStep(step === 'payment' ? 'details' : 'cart')} className="p-2 rounded-xl hover:bg-muted transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        <h1 className="text-3xl font-bold">
          {step === 'cart' ? 'Your Cart' : step === 'details' ? 'Order Details' : 'Payment'}
        </h1>
        {/* Step indicator */}
        <div className="ml-auto flex items-center gap-2">
          {(['cart', 'details', 'payment'] as const).map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                step === s ? 'bg-primary-500 text-white' :
                (['cart', 'details', 'payment'].indexOf(step) > i ? 'bg-green-500 text-white' : 'bg-muted text-muted-foreground')
              }`}>
                {['cart', 'details', 'payment'].indexOf(step) > i ? <CheckCircle className="w-4 h-4" /> : i + 1}
              </div>
              {i < 2 && <div className={`w-8 h-0.5 ${['cart', 'details', 'payment'].indexOf(step) > i ? 'bg-green-500' : 'bg-muted'}`} />}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left: main content */}
        <div className="lg:col-span-3 space-y-6">
          <AnimatePresence mode="wait">
            {step === 'cart' && (
              <motion.div key="cart" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-4">
                {items.map((item) => {
                  const modTotal = item.selectedModifiers.reduce((s, m) => s + m.price, 0)
                  return (
                    <div key={item.id} className="flex gap-4 p-4 rounded-2xl border bg-card">
                      {item.imageUrl && (
                        <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                          <Image src={item.imageUrl} alt={item.name} width={80} height={80} className="object-cover w-full h-full" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold">{item.name}</p>
                        {item.selectedModifiers.length > 0 && (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {item.selectedModifiers.map((m) => `${m.name}: ${m.option}`).join(', ')}
                          </p>
                        )}
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-1 bg-muted rounded-xl p-0.5">
                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-background transition-colors">
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-background transition-colors">
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-semibold">{formatPrice((item.price + modTotal) * item.quantity)}</span>
                            <button onClick={() => removeItem(item.id)} className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors rounded-lg hover:bg-muted">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}

                {/* Coupon */}
                <div className="p-4 rounded-2xl border bg-card">
                  <p className="font-semibold mb-3">Promo Code</p>
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between bg-green-50 dark:bg-green-900/20 rounded-xl px-3 py-2">
                      <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                        <Tag className="w-4 h-4" />
                        <span className="font-medium">{appliedCoupon.code}</span>
                        <span className="text-sm">— {formatPrice(disc)} off</span>
                      </div>
                      <button onClick={removeCoupon}><X className="w-4 h-4 text-muted-foreground hover:text-foreground" /></button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Input value={couponInput} onChange={(e) => setCouponInput(e.target.value.toUpperCase())} placeholder="Enter promo code" className="uppercase" onKeyDown={(e) => e.key === 'Enter' && handleCoupon()} />
                      <Button onClick={handleCoupon} disabled={couponLoading || !couponInput} variant="outline">
                        {couponLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Apply'}
                      </Button>
                    </div>
                  )}
                </div>

                <Button size="lg" className="w-full" onClick={() => setStep('details')}>
                  Continue to Details
                </Button>
              </motion.div>
            )}

            {step === 'details' && (
              <motion.div key="details" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                <form onSubmit={handleSubmit(onDetailsSubmit)} className="space-y-5">
                  {/* Order type */}
                  <div className="grid grid-cols-3 gap-3 p-1 bg-muted rounded-xl">
                    {([['DELIVERY', 'Delivery', Truck], ['DINE_IN', 'Dine In', UtensilsCrossed], ['TAKEAWAY', 'Takeaway', Package]] as const).map(([type, label, Icon]) => (
                      <button key={type} type="button" onClick={() => setOrderType(type)}
                        className={`flex flex-col items-center gap-1 py-3 rounded-xl text-sm font-medium transition-all ${orderType === type ? 'bg-background shadow text-primary-500' : 'text-muted-foreground'}`}>
                        <Icon className="w-5 h-5" />
                        {label}
                      </button>
                    ))}
                  </div>

                  {/* Contact */}
                  <div className="p-4 rounded-2xl border bg-card space-y-4">
                    <h3 className="font-semibold">Contact Details</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label>Name *</Label>
                        <Input {...register('name')} placeholder="Ahmed Khan" className="mt-1" />
                        {errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}
                      </div>
                      <div>
                        <Label>Phone *</Label>
                        <Input {...register('phone')} placeholder="+92 300 1234567" className="mt-1" />
                        {errors.phone && <p className="text-xs text-destructive mt-1">{errors.phone.message}</p>}
                      </div>
                    </div>
                    <div>
                      <Label>Email (optional)</Label>
                      <Input {...register('email')} type="email" placeholder="ahmed@email.com" className="mt-1" />
                    </div>
                  </div>

                  {/* Address (delivery only) */}
                  {orderType === 'DELIVERY' && (
                    <div className="p-4 rounded-2xl border bg-card space-y-4">
                      <h3 className="font-semibold flex items-center gap-2"><MapPin className="w-4 h-4 text-primary-500" /> Delivery Address</h3>
                      <div>
                        <Label>Street Address *</Label>
                        <Input {...register('addressLine1')} placeholder="House 5, Street 12, DHA Phase 5" className="mt-1" />
                      </div>
                      <div>
                        <Label>City</Label>
                        <Input {...register('city')} defaultValue="Lahore" className="mt-1" />
                      </div>
                    </div>
                  )}

                  {/* Schedule */}
                  <div className="p-4 rounded-2xl border bg-card space-y-3">
                    <h3 className="font-semibold flex items-center gap-2"><Clock className="w-4 h-4 text-primary-500" /> When?</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {(['asap', 'schedule'] as const).map((opt) => (
                        <label key={opt} className="flex items-center gap-3 p-3 rounded-xl border cursor-pointer hover:border-primary-500 transition-colors">
                          <input {...register('scheduled')} type="radio" value={opt} className="accent-primary-500" />
                          <span className="text-sm font-medium">{opt === 'asap' ? 'ASAP (~30 min)' : 'Schedule'}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <Label>Special Instructions</Label>
                    <Textarea {...register('notes')} placeholder="Extra spicy, no onions..." className="mt-1" rows={3} />
                  </div>

                  <Button type="submit" size="lg" className="w-full gap-2" disabled={isCreating}>
                    {isCreating ? <><Loader2 className="w-4 h-4 animate-spin" />Creating Order...</> : <><CreditCard className="w-4 h-4" />Proceed to Payment</>}
                  </Button>
                </form>
              </motion.div>
            )}

            {step === 'payment' && clientSecret && orderId && (
              <motion.div key="payment" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'stripe' } }}>
                  <PaymentForm orderId={orderId} total={tot} onSuccess={() => {
                    clearCart()
                    router.push(`/track/${orderId}`)
                  }} />
                </Elements>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right: Order summary */}
        <div className="lg:col-span-2">
          <div className="sticky top-24 p-5 rounded-2xl border bg-card space-y-4">
            <h3 className="font-semibold">Order Summary</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {items.map((item) => {
                const modTotal = item.selectedModifiers.reduce((s, m) => s + m.price, 0)
                return (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{item.name} × {item.quantity}</span>
                    <span>{formatPrice((item.price + modTotal) * item.quantity)}</span>
                  </div>
                )
              })}
            </div>
            <Separator />
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span>{formatPrice(sub)}</span></div>
              {disc > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>-{formatPrice(disc)}</span></div>}
              <div className="flex justify-between text-muted-foreground">
                <span>Delivery</span>
                <span>{fee === 0 ? <span className="text-green-600">Free</span> : formatPrice(fee)}</span>
              </div>
            </div>
            <Separator />
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span className="text-primary-500">{formatPrice(tot)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function PaymentForm({ orderId, total, onSuccess }: { orderId: string; total: number; onSuccess: () => void }) {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements) return
    setLoading(true)
    setError(null)
    const { error: stripeError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/track/${orderId}`,
      },
      redirect: 'if_required',
    })
    if (stripeError) {
      setError(stripeError.message || 'Payment failed')
      setLoading(false)
    } else {
      onSuccess()
    }
  }

  return (
    <form onSubmit={handlePay} className="space-y-5">
      <div className="p-4 rounded-2xl border bg-card">
        <h3 className="font-semibold flex items-center gap-2 mb-4"><CreditCard className="w-4 h-4 text-primary-500" /> Payment</h3>
        <PaymentElement />
        {error && <p className="text-sm text-destructive mt-3">{error}</p>}
      </div>
      <Button type="submit" size="lg" className="w-full" disabled={!stripe || loading}>
        {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Processing...</> : `Pay ${formatPrice(total)}`}
      </Button>
    </form>
  )
}
