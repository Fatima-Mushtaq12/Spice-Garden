import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db/prisma'
import Link from 'next/link'
import Image from 'next/image'
import { formatDate, formatPrice, generateOrderRef, ORDER_STATUS_LABELS } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { User, Package, CalendarDays } from 'lucide-react'

export const metadata = { title: 'My Account' }

export default async function AccountPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const userId = (session.user as any).id
  const [orders, bookings] = await Promise.all([
    prisma.order.findMany({
      where: { userId },
      include: { items: { include: { menuItem: { select: { name: true } } } } },
      orderBy: { createdAt: 'desc' },
      take: 10,
    }),
    prisma.booking.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      take: 5,
    }),
  ])

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      {/* Profile */}
      <div className="flex items-center gap-5 mb-10 p-6 rounded-2xl border bg-card">
        {session.user.image ? (
          <Image src={session.user.image} alt={session.user.name || ''} width={72} height={72} className="rounded-full" />
        ) : (
          <div className="w-18 h-18 w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-primary-500" />
          </div>
        )}
        <div>
          <h1 className="text-2xl font-bold">{session.user.name}</h1>
          <p className="text-muted-foreground">{session.user.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Orders */}
        <div>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Package className="w-5 h-5 text-primary-500" /> Recent Orders
          </h2>
          {orders.length === 0 ? (
            <div className="text-center py-8 border rounded-2xl bg-muted/20">
              <p className="text-muted-foreground">No orders yet</p>
              <Button asChild className="mt-3" size="sm"><Link href="/menu">Order Now</Link></Button>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => (
                <Link key={order.id} href={`/track/${order.id}`} className="block p-4 rounded-2xl border bg-card hover:border-primary-300 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono font-bold text-primary-500">#{generateOrderRef(order.id)}</span>
                    <Badge variant={order.status === 'DELIVERED' ? 'success' : order.status === 'CANCELLED' ? 'destructive' : 'default'}>
                      {ORDER_STATUS_LABELS[order.status]}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">
                    {order.items.map((i) => i.menuItem.name).join(', ').slice(0, 60)}...
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{formatDate(order.createdAt)}</span>
                    <span className="font-semibold">{formatPrice(order.total)}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Bookings */}
        <div>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-primary-500" /> Reservations
          </h2>
          {bookings.length === 0 ? (
            <div className="text-center py-8 border rounded-2xl bg-muted/20">
              <p className="text-muted-foreground">No reservations yet</p>
              <Button asChild className="mt-3" size="sm"><Link href="/book">Book a Table</Link></Button>
            </div>
          ) : (
            <div className="space-y-3">
              {bookings.map((b) => (
                <div key={b.id} className="p-4 rounded-2xl border bg-card">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono font-bold text-primary-500">#{b.id.slice(-8).toUpperCase()}</span>
                    <Badge variant={b.status === 'CONFIRMED' ? 'success' : b.status === 'CANCELLED' ? 'destructive' : 'default'}>{b.status}</Badge>
                  </div>
                  <p className="text-sm font-medium">{formatDate(b.date)} at {b.time}</p>
                  <p className="text-xs text-muted-foreground">{b.partySize} guests</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
