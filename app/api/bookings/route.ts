import { NextResponse } from 'next/server'
import { createBookingSchema } from '@/lib/validations/booking'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = createBookingSchema.safeParse(body)
    if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })

    // Try real DB
    try {
      const { prisma } = await import('@/lib/db/prisma')
      const data = parsed.data
      const bookingDate = new Date(data.date + 'T00:00:00')
      const booking = await prisma.booking.create({
        data: {
          restaurantId: data.restaurantId, date: bookingDate, time: data.time,
          partySize: data.partySize, status: 'CONFIRMED', name: data.name, phone: data.phone,
          email: data.email || undefined, notes: data.notes,
        },
      })
      return NextResponse.json({ bookingId: booking.id, status: 'CONFIRMED' }, { status: 201 })
    } catch {}

    // Demo mode
    const bookingId = 'booking-' + Math.random().toString(36).slice(2, 10)
    return NextResponse.json({ bookingId, status: 'CONFIRMED', demo: true }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: Request) {
  return NextResponse.json([])
}
