import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { auth } from '@/lib/auth'

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const role = (session.user as any).role
    if (!['STAFF', 'ADMIN', 'DRIVER'].includes(role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { status, estimatedTime } = body

    const validStatuses = ['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED']
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    const order = await prisma.order.update({
      where: { id: params.id },
      data: {
        status,
        estimatedTime: estimatedTime ?? undefined,
      },
      include: {
        items: { include: { menuItem: { select: { name: true } } } },
      },
    })

    // Emit socket event (via HTTP to socket server)
    const socketUrl = process.env.SOCKET_SERVER_URL
    if (socketUrl) {
      await fetch(`${socketUrl}/emit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'order:status-changed',
          room: `order:${params.id}`,
          data: { orderId: params.id, status, estimatedTime },
        }),
      }).catch(() => {})

      await fetch(`${socketUrl}/emit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'order:status-changed',
          room: `restaurant:${order.restaurantId}`,
          data: { orderId: params.id, status, estimatedTime },
        }),
      }).catch(() => {})
    }

    return NextResponse.json({ success: true, order })
  } catch (error) {
    console.error('[PATCH /api/orders/[id]/status]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
