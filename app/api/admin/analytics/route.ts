import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const { prisma } = await import('@/lib/db/prisma')
    const now = new Date()
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const startOf30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const [todayOrders, todayRevenue, monthOrders] = await Promise.all([
      prisma.order.count({ where: { createdAt: { gte: startOfToday }, paymentStatus: 'PAID' } }),
      prisma.order.aggregate({ where: { createdAt: { gte: startOfToday }, paymentStatus: 'PAID' }, _sum: { total: true }, _avg: { total: true } }),
      prisma.order.count({ where: { createdAt: { gte: startOf30Days }, paymentStatus: 'PAID' } }),
    ])
    return NextResponse.json({
      today: { orders: todayOrders, revenue: todayRevenue._sum.total || 0, avgOrderValue: todayRevenue._avg.total || 0 },
      month: { orders: monthOrders },
      topDishes: [],
      revenueByDay: [],
    })
  } catch {
    // Demo analytics data
    const days = Array.from({ length: 30 }, (_, i) => {
      const d = new Date(); d.setDate(d.getDate() - (29 - i))
      return { date: d.toISOString().split('T')[0], revenue: Math.round(15000 + Math.random() * 35000), orders: Math.round(8 + Math.random() * 22) }
    })
    return NextResponse.json({
      today: { orders: 24, revenue: 42800, avgOrderValue: 1783 },
      month: { orders: 487 },
      topDishes: [
        { menuItemId: '1', name: 'Chicken Karahi', quantity: 142 },
        { menuItemId: '2', name: 'Beef Biryani', quantity: 118 },
        { menuItemId: '3', name: 'Mixed Grill Platter', quantity: 89 },
        { menuItemId: '4', name: 'Lamb Nihari', quantity: 76 },
        { menuItemId: '5', name: 'Seekh Kabab', quantity: 65 },
      ],
      revenueByDay: days,
    })
  }
}
