import { NextResponse } from 'next/server'
import { createOrderSchema } from '@/lib/validations/order'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = createOrderSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
    }

    // Try real DB + Stripe
    try {
      const { prisma } = await import('@/lib/db/prisma')
      const { stripe } = await import('@/lib/stripe')
      const data = parsed.data

      let subtotal = data.items.reduce((s, i) => s + i.unitPrice * i.quantity, 0)
      let discount = 0
      let couponId: string | undefined

      if (data.couponCode) {
        try {
          const coupon = await prisma.coupon.findUnique({ where: { code: data.couponCode } })
          if (coupon?.isActive) {
            discount = coupon.type === 'PERCENTAGE' ? (subtotal * coupon.value) / 100 : coupon.value
            couponId = coupon.id
          }
        } catch {}
      }

      const deliveryFee = data.type === 'DELIVERY' ? (subtotal < 1500 ? 150 : 0) : 0
      const total = Math.max(0, subtotal - discount + deliveryFee)

      const order = await prisma.order.create({
        data: {
          restaurantId: data.restaurantId,
          status: 'PENDING', type: data.type, subtotal, deliveryFee, discount, total,
          paymentMethod: 'card', paymentStatus: 'PENDING', couponId,
          deliveryAddress: data.deliveryAddress as any,
          notes: data.notes, estimatedTime: 30,
          items: { create: data.items.map((i) => ({ menuItemId: i.menuItemId, quantity: i.quantity, unitPrice: i.unitPrice, selectedModifiers: i.selectedModifiers as any })) },
        },
      })

      const pi = await stripe.paymentIntents.create({
        amount: Math.round(total * 100), currency: 'pkr',
        automatic_payment_methods: { enabled: true },
        metadata: { orderId: order.id },
      })
      await prisma.order.update({ where: { id: order.id }, data: { stripePaymentId: pi.id } })
      return NextResponse.json({ orderId: order.id, clientSecret: pi.client_secret })
    } catch {}

    // Demo mode — return a fake order id and a demo clientSecret
    const data = parsed.data
    const subtotal = data.items.reduce((s, i) => s + i.unitPrice * i.quantity, 0)
    const deliveryFee = data.type === 'DELIVERY' ? (subtotal < 1500 ? 150 : 0) : 0
    const total = Math.max(0, subtotal + deliveryFee)
    const orderId = 'demo-' + Math.random().toString(36).slice(2, 10)

    return NextResponse.json({
      orderId,
      clientSecret: 'pi_demo_secret_demo',
      demo: true,
      message: 'Demo mode — connect Stripe to process real payments',
    })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
