'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion, AnimatePresence } from 'framer-motion'
import { CalendarDays, Clock, Users, CheckCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { createBookingSchema, type CreateBookingInput } from '@/lib/validations/booking'
import { toast } from '@/components/ui/use-toast'
import { Toaster } from '@/components/ui/toaster'

const RESTAURANT_ID = process.env.NEXT_PUBLIC_RESTAURANT_ID || 'default'

const TIME_SLOTS = [
  '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
  '3:00 PM', '3:30 PM', '4:00 PM', '6:00 PM', '6:30 PM', '7:00 PM',
  '7:30 PM', '8:00 PM', '8:30 PM', '9:00 PM', '9:30 PM', '10:00 PM',
]

interface BookingConfirmation {
  id: string
  date: string
  time: string
  partySize: number
  name: string
}

export default function BookPage() {
  const [confirmation, setConfirmation] = useState<BookingConfirmation | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const today = new Date().toISOString().split('T')[0]

  const { register, handleSubmit, watch, formState: { errors }, setValue } = useForm<CreateBookingInput>({
    resolver: zodResolver(createBookingSchema),
    defaultValues: { restaurantId: RESTAURANT_ID, partySize: 2 },
  })

  const selectedDate = watch('date')

  const onSubmit = async (data: CreateBookingInput) => {
    if (!selectedTime) {
      toast({ title: 'Please select a time slot', variant: 'destructive' })
      return
    }
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, time: selectedTime }),
      })
      const result = await res.json()
      if (!res.ok) throw new Error(result.error || 'Booking failed')
      setConfirmation({ id: result.bookingId, date: data.date, time: selectedTime, partySize: data.partySize, name: data.name })
    } catch (err: any) {
      toast({ title: 'Booking failed', description: err.message, variant: 'destructive' })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (confirmation) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-lg">
        <Toaster />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-8 rounded-2xl border bg-card"
        >
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Table Booked!</h2>
          <p className="text-muted-foreground mb-6">We've sent a confirmation to your phone. See you soon!</p>
          <div className="bg-muted/50 rounded-xl p-5 space-y-3 text-left mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                <span className="text-primary-600 font-bold text-xs">Ref</span>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Booking Reference</p>
                <p className="font-bold text-primary-500 font-mono">{confirmation.id.slice(-8).toUpperCase()}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                <CalendarDays className="w-4 h-4 text-primary-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Date & Time</p>
                <p className="font-semibold">{new Date(confirmation.date + 'T12:00:00').toLocaleDateString('en-PK', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} at {confirmation.time}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                <Users className="w-4 h-4 text-primary-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Party Size</p>
                <p className="font-semibold">{confirmation.partySize} {confirmation.partySize === 1 ? 'Guest' : 'Guests'}</p>
              </div>
            </div>
          </div>
          <Button onClick={() => setConfirmation(null)} variant="outline" className="w-full">Book Another Table</Button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-2xl">
      <Toaster />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="text-center mb-10">
          <span className="text-primary-500 text-sm font-semibold uppercase tracking-widest">Reservations</span>
          <h1 className="text-4xl font-bold mt-2">Book a Table</h1>
          <p className="text-muted-foreground mt-2">Reserve your spot at Spice Garden for an unforgettable dining experience</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Date + Party Size */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <Label className="flex items-center gap-2 mb-2"><CalendarDays className="w-4 h-4 text-primary-500" />Date *</Label>
              <Input
                {...register('date')}
                type="date"
                min={today}
                className="cursor-pointer"
              />
              {errors.date && <p className="text-xs text-destructive mt-1">{errors.date.message}</p>}
            </div>
            <div>
              <Label className="flex items-center gap-2 mb-2"><Users className="w-4 h-4 text-primary-500" />Party Size *</Label>
              <select
                {...register('partySize', { valueAsNumber: true })}
                className="flex h-11 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {Array.from({ length: 20 }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Time slots */}
          <div>
            <Label className="flex items-center gap-2 mb-3"><Clock className="w-4 h-4 text-primary-500" />Available Times *</Label>
            {!selectedDate ? (
              <p className="text-sm text-muted-foreground py-4 text-center border rounded-xl">Please select a date first</p>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                {TIME_SLOTS.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedTime(slot)}
                    className={`py-2.5 px-2 rounded-xl text-sm font-medium border transition-all ${
                      selectedTime === slot
                        ? 'bg-primary-500 text-white border-primary-500'
                        : 'bg-background border-border hover:border-primary-500 hover:text-primary-500'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Contact */}
          <div className="p-5 rounded-2xl border bg-card space-y-4">
            <h3 className="font-semibold">Your Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>Full Name *</Label>
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
            <div>
              <Label>Special Requests</Label>
              <Textarea {...register('notes')} placeholder="Dietary requirements, occasion, seating preference..." className="mt-1" rows={3} />
            </div>
          </div>

          <Button type="submit" size="lg" className="w-full" disabled={isSubmitting || !selectedTime}>
            {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" />Confirming...</> : 'Confirm Booking'}
          </Button>
        </form>
      </motion.div>
    </div>
  )
}
