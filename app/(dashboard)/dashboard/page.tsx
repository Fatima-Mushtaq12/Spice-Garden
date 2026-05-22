'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, Clock, ChefHat, Bike, Package, TrendingUp, DollarSign, ShoppingBag, AlertCircle, Power, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { connectSocket, disconnectSocket, joinRestaurantRoom } from '@/lib/socket'
import { formatPrice, formatTime, generateOrderRef, ORDER_STATUS_LABELS } from '@/lib/utils'
import { toast } from '@/components/ui/use-toast'
import { Toaster } from '@/components/ui/toaster'

interface OrderItem { id: string; quantity: number; unitPrice: number; menuItem: { name: string } }
interface Order {
  id: string; status: string; type: string; total: number; estimatedTime: number | null; createdAt: string; notes: string | null;
  items: OrderItem[]
  user: { name: string | null; phone: string | null } | null
}

const STATUS_COLOR: Record<string, string> = {
  PENDING: 'warning',
  CONFIRMED: 'default',
  PREPARING: 'default',
  READY: 'success',
  OUT_FOR_DELIVERY: 'default',
  DELIVERED: 'success',
  CANCELLED: 'destructive',
}

const NEXT_STATUS: Record<string, string | null> = {
  PENDING: 'CONFIRMED',
  CONFIRMED: 'PREPARING',
  PREPARING: 'READY',
  READY: 'OUT_FOR_DELIVERY',
  OUT_FOR_DELIVERY: 'DELIVERED',
  DELIVERED: null,
}

export default function DashboardPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [restaurantOpen, setRestaurantOpen] = useState(true)
  const [stats, setStats] = useState({ today: 0, revenue: 0, avg: 0, pending: 0 })

  const restaurantId = process.env.NEXT_PUBLIC_RESTAURANT_ID || 'default'

  useEffect(() => {
    fetchOrders()
    const socket = connectSocket()
    joinRestaurantRoom(restaurantId)
    socket.on('order:new', fetchOrders)
    socket.on('order:status-changed', fetchOrders)
    return () => {
      socket.off('order:new')
      socket.off('order:status-changed')
      disconnectSocket()
    }
  }, [])

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/admin/orders?limit=30')
      const data = await res.json()
      if (data.orders) {
        setOrders(data.orders)
        const paid = data.orders.filter((o: Order) => ['CONFIRMED', 'PREPARING', 'READY', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(o.status))
        const today = paid.filter((o: Order) => new Date(o.createdAt).toDateString() === new Date().toDateString())
        setStats({
          today: today.length,
          revenue: today.reduce((s: number, o: Order) => s + o.total, 0),
          avg: today.length > 0 ? today.reduce((s: number, o: Order) => s + o.total, 0) / today.length : 0,
          pending: data.orders.filter((o: Order) => o.status === 'PENDING').length,
        })
      }
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (orderId: string, status: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (!res.ok) throw new Error('Failed')
      setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status } : o))
      toast({ title: 'Order updated', description: `Status: ${ORDER_STATUS_LABELS[status]}` })
    } catch {
      toast({ title: 'Failed to update order', variant: 'destructive' })
    }
  }

  const pendingOrders = orders.filter((o) => ['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'OUT_FOR_DELIVERY'].includes(o.status))

  return (
    <div className="min-h-screen bg-background">
      <Toaster />
      {/* Header */}
      <div className="bg-card border-b sticky top-0 z-30">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">S</span>
            </div>
            <h1 className="text-xl font-bold">Staff Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Power className={`w-4 h-4 ${restaurantOpen ? 'text-green-500' : 'text-muted-foreground'}`} />
              <span className="text-sm font-medium">{restaurantOpen ? 'Open' : 'Closed'}</span>
              <Switch checked={restaurantOpen} onCheckedChange={setRestaurantOpen} />
            </div>
            <Button variant="ghost" size="icon" onClick={fetchOrders}><RefreshCw className="w-4 h-4" /></Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: ShoppingBag, label: "Today's Orders", value: stats.today, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
            { icon: DollarSign, label: 'Revenue Today', value: formatPrice(stats.revenue), color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20' },
            { icon: TrendingUp, label: 'Avg Order', value: formatPrice(stats.avg), color: 'text-primary-500', bg: 'bg-primary-50 dark:bg-primary-900/20' },
            { icon: AlertCircle, label: 'Pending', value: stats.pending, color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/20' },
          ].map(({ icon: Icon, label, value, color, bg }) => (
            <motion.div key={label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-2xl border p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
              </div>
              <p className="text-2xl font-bold">{value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
            </motion.div>
          ))}
        </div>

        {/* Active Orders */}
        <div>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            Active Orders
            {stats.pending > 0 && (
              <span className="w-6 h-6 rounded-full bg-primary-500 text-white text-xs flex items-center justify-center animate-pulse">{stats.pending}</span>
            )}
          </h2>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-48 rounded-2xl bg-muted animate-pulse" />)}
            </div>
          ) : pendingOrders.length === 0 ? (
            <div className="text-center py-16 border rounded-2xl bg-muted/20">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
              <p className="font-semibold text-lg">All caught up!</p>
              <p className="text-muted-foreground text-sm">No active orders right now</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              <AnimatePresence>
                {pendingOrders.map((order) => {
                  const next = NEXT_STATUS[order.status]
                  const elapsed = Math.round((Date.now() - new Date(order.createdAt).getTime()) / 60000)
                  return (
                    <motion.div
                      key={order.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className={`bg-card rounded-2xl border p-4 space-y-3 ${order.status === 'PENDING' ? 'border-orange-300 dark:border-orange-700' : ''}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-primary-500">#{generateOrderRef(order.id)}</span>
                          <Badge variant={STATUS_COLOR[order.status] as any}>{ORDER_STATUS_LABELS[order.status]}</Badge>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {elapsed}m ago
                        </div>
                      </div>

                      <div className="text-sm space-y-1">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex justify-between">
                            <span>{item.menuItem.name} × {item.quantity}</span>
                            <span className="text-muted-foreground">{formatPrice(item.unitPrice * item.quantity)}</span>
                          </div>
                        ))}
                      </div>

                      {order.notes && (
                        <div className="text-xs bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 p-2 rounded-lg">
                          Note: {order.notes}
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <span className="font-bold">{formatPrice(order.total)}</span>
                        <span className="text-sm text-muted-foreground capitalize">{order.type.replace('_', ' ')}</span>
                      </div>

                      <div className="flex gap-2">
                        {next && (
                          <Button size="sm" className="flex-1 gap-1" onClick={() => updateStatus(order.id, next)}>
                            <ChefHat className="w-3.5 h-3.5" />
                            {ORDER_STATUS_LABELS[next]}
                          </Button>
                        )}
                        {order.status === 'PENDING' && (
                          <Button size="sm" variant="destructive" className="gap-1" onClick={() => updateStatus(order.id, 'CANCELLED')}>
                            <XCircle className="w-3.5 h-3.5" />
                          </Button>
                        )}
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
