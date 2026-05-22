import { NextResponse } from 'next/server'
import { z } from 'zod'

const schema = z.object({
  code: z.string().min(1),
  subtotal: z.number().positive(),
})

const DEMO_COUPONS: Record<string, { type: 'PERCENTAGE' | 'FIXED'; value: number; minOrderAmount: number }> = {
  WELCOME10: { type: 'PERCENTAGE', value: 10, minOrderAmount: 0 },
  FIRST50: { type: 'FIXED', value: 50, minOrderAmount: 500 },
  SUMMER20: { type: 'PERCENTAGE', value: 20, minOrderAmount: 0 },
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) return NextResponse.json({ error: 'Invalid request' }, { status: 400 })

    const { code, subtotal } = parsed.data
    const upper = code.toUpperCase()

    // Try DB first
    try {
      const { prisma } = await import('@/lib/db/prisma')
      const coupon = await prisma.coupon.findUnique({ where: { code: upper } })
      if (coupon) {
        if (!coupon.isActive) return NextResponse.json({ error: 'Coupon is no longer active' }, { status: 400 })
        if (coupon.expiresAt && coupon.expiresAt < new Date()) return NextResponse.json({ error: 'Coupon has expired' }, { status: 400 })
        if (coupon.minOrderAmount > 0 && subtotal < coupon.minOrderAmount) {
          return NextResponse.json({ error: `Minimum order is PKR ${coupon.minOrderAmount}` }, { status: 400 })
        }
        const discountAmount = coupon.type === 'PERCENTAGE' ? Math.round((subtotal * coupon.value) / 100) : Math.min(coupon.value, subtotal)
        return NextResponse.json({ code: coupon.code, type: coupon.type, value: coupon.value, discountAmount })
      }
    } catch {}

    // Fall back to demo coupons
    if (upper === 'SUMMER20') return NextResponse.json({ error: 'This coupon has expired' }, { status: 400 })
    const demo = DEMO_COUPONS[upper]
    if (!demo) return NextResponse.json({ error: 'Coupon not found' }, { status: 404 })
    if (demo.minOrderAmount > 0 && subtotal < demo.minOrderAmount) {
      return NextResponse.json({ error: `Minimum order is PKR ${demo.minOrderAmount}` }, { status: 400 })
    }
    const discountAmount = demo.type === 'PERCENTAGE' ? Math.round((subtotal * demo.value) / 100) : Math.min(demo.value, subtotal)
    return NextResponse.json({ code: upper, type: demo.type, value: demo.value, discountAmount })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
