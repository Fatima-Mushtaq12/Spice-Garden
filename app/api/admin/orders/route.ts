import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { prisma } = await import('@/lib/db/prisma')
    const { auth } = await import('@/lib/auth')
    const session = await auth()
    if (!session?.user || !['STAFF', 'ADMIN'].includes((session.user as any).role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    const orders = await prisma.order.findMany({
      include: { items: { include: { menuItem: { select: { name: true } } } }, user: { select: { name: true, email: true, phone: true } } },
      orderBy: { createdAt: 'desc' }, take: 50,
    })
    return NextResponse.json({ orders, total: orders.length })
  } catch {
    return NextResponse.json({ orders: [], total: 0 })
  }
}
