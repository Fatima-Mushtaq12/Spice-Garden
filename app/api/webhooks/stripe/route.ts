import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/db/prisma'
import { resend, FROM_EMAIL } from '@/lib/resend'
import { sendOrderConfirmationSMS } from '@/lib/twilio'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  const body = await request.text()
  const signature = headers().get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  let event
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err: any) {
    console.error('[Stripe Webhook] Signature verification failed:', err.message)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object as any
    const orderId = paymentIntent.metadata?.orderId

    if (orderId) {
      const order = await prisma.order.update({
        where: { id: orderId },
        data: {
          paymentStatus: 'PAID',
          status: 'CONFIRMED',
        },
        include: {
          items: { include: { menuItem: { select: { name: true } } } },
          user: { select: { name: true, email: true, phone: true } },
        },
      })

      // Notify socket server
      const socketUrl = process.env.SOCKET_SERVER_URL
      if (socketUrl) {
        await fetch(`${socketUrl}/emit`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: 'order:new',
            room: `restaurant:${order.restaurantId}`,
            data: { orderId, status: 'CONFIRMED' },
          }),
        }).catch(() => {})
      }

      // Send confirmation SMS
      if (order.user?.phone) {
        await sendOrderConfirmationSMS(order.user.phone, orderId, order.total).catch(console.error)
      }

      // Send confirmation email
      if (order.user?.email) {
        const itemsList = order.items.map((i) => `<tr><td>${i.menuItem.name}</td><td>×${i.quantity}</td><td>PKR ${(i.unitPrice * i.quantity).toLocaleString()}</td></tr>`).join('')
        await resend.emails.send({
          from: FROM_EMAIL,
          to: order.user.email,
          subject: `Order Confirmed #${orderId.slice(-6).toUpperCase()} — Spice Garden`,
          html: `
            <h2>Your order is confirmed!</h2>
            <p>Hi ${order.user.name || 'there'},</p>
            <p>We've received your order and our kitchen is already preparing it!</p>
            <table>
              <thead><tr><th>Item</th><th>Qty</th><th>Price</th></tr></thead>
              <tbody>${itemsList}</tbody>
            </table>
            <p><strong>Total: PKR ${order.total.toLocaleString()}</strong></p>
            <p>Estimated time: ~${order.estimatedTime || 30} minutes</p>
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/track/${orderId}">Track Your Order</a>
          `,
        }).catch(console.error)
      }
    }
  }

  if (event.type === 'payment_intent.payment_failed') {
    const paymentIntent = event.data.object as any
    const orderId = paymentIntent.metadata?.orderId
    if (orderId) {
      await prisma.order.update({
        where: { id: orderId },
        data: { paymentStatus: 'FAILED', status: 'CANCELLED' },
      }).catch(console.error)
    }
  }

  return NextResponse.json({ received: true })
}
