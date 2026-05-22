'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  LayoutDashboard, ShoppingBag, UtensilsCrossed, Users,
  CalendarDays, Tag, Settings, TrendingUp, Download,
  Plus, Edit, Trash2, ToggleLeft, ToggleRight, Loader2,
} from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend,
} from 'recharts'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatPrice, formatDate, generateOrderRef, ORDER_STATUS_LABELS } from '@/lib/utils'
import { toast } from '@/components/ui/use-toast'

type Tab = 'overview' | 'orders' | 'menu' | 'bookings' | 'coupons'

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>('overview')
  const [analytics, setAnalytics] = useState<any>(null)
  const [orders, setOrders] = useState<any[]>([])
  const [menuCategories, setMenuCategories] = useState<any[]>([])
  const [coupons, setCoupons] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Order filters
  const [orderStatus, setOrderStatus] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [analyticsRes, menuRes] = await Promise.all([
        fetch('/api/admin/analytics'),
        fetch('/api/menu'),
      ])
      const [analyticsData, menuData] = await Promise.all([analyticsRes.json(), menuRes.json()])
      setAnalytics(analyticsData)
      setMenuCategories(menuData.categories || [])
    } finally {
      setLoading(false)
    }
  }

  const loadOrders = async () => {
    const params = new URLSearchParams()
    if (orderStatus) params.set('status', orderStatus)
    if (startDate) params.set('startDate', startDate)
    if (endDate) params.set('endDate', endDate)
    params.set('limit', '100')
    const res = await fetch(`/api/admin/orders?${params}`)
    const data = await res.json()
    setOrders(data.orders || [])
  }

  const toggleItemAvailability = async (itemId: string, isAvailable: boolean) => {
    await fetch(`/api/admin/menu/${itemId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isAvailable }),
    })
    setMenuCategories((prev) =>
      prev.map((cat) => ({
        ...cat,
        items: cat.items.map((i: any) => i.id === itemId ? { ...i, isAvailable } : i),
      }))
    )
  }

  const exportOrders = () => {
    const csv = [
      ['ID', 'Date', 'Status', 'Type', 'Total', 'Customer'].join(','),
      ...orders.map((o) =>
        [
          generateOrderRef(o.id),
          formatDate(o.createdAt),
          o.status,
          o.type,
          o.total,
          o.user?.name || 'Guest',
        ].join(',')
      ),
    ].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `orders-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  const navItems: { id: Tab; label: string; icon: any }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'menu', label: 'Menu', icon: UtensilsCrossed },
    { id: 'bookings', label: 'Bookings', icon: CalendarDays },
    { id: 'coupons', label: 'Coupons', icon: Tag },
  ]

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-56 border-r bg-card flex-shrink-0 hidden md:flex flex-col">
        <div className="p-4 border-b">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="font-bold">Admin Panel</span>
          </div>
        </div>
        <nav className="p-2 flex-1">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => { setActiveTab(id); if (id === 'orders') loadOrders() }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors mb-1 ${
                activeTab === id ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20' : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        {/* Mobile tab bar */}
        <div className="md:hidden flex gap-1 p-2 border-b overflow-x-auto">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setActiveTab(id)} className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ${activeTab === id ? 'bg-primary-500 text-white' : 'bg-muted text-muted-foreground'}`}>
              <Icon className="w-3.5 h-3.5" />{label}
            </button>
          ))}
        </div>

        <div className="p-6 space-y-6">
          {/* OVERVIEW */}
          {activeTab === 'overview' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <h1 className="text-2xl font-bold">Overview</h1>
              {loading ? (
                <div className="flex items-center justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-primary-500" /></div>
              ) : analytics ? (
                <>
                  {/* Summary cards */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: "Today's Orders", value: analytics.today.orders, sub: `${analytics.month.orders} this month`, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
                      { label: 'Today Revenue', value: formatPrice(analytics.today.revenue), sub: 'Paid orders only', color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20' },
                      { label: 'Avg Order Value', value: formatPrice(analytics.today.avgOrderValue), sub: 'Today\'s average', color: 'text-primary-500', bg: 'bg-primary-50 dark:bg-primary-900/20' },
                      { label: 'Monthly Orders', value: analytics.month.orders, sub: 'Last 30 days', color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20' },
                    ].map(({ label, value, sub, color, bg }) => (
                      <Card key={label}>
                        <CardContent className="p-4">
                          <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-3`}>
                            <TrendingUp className={`w-5 h-5 ${color}`} />
                          </div>
                          <p className="text-2xl font-bold">{value}</p>
                          <p className="text-sm font-medium mt-0.5">{label}</p>
                          <p className="text-xs text-muted-foreground">{sub}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Revenue Chart */}
                  {analytics.revenueByDay?.length > 0 && (
                    <Card>
                      <CardHeader><CardTitle>Revenue — Last 30 Days</CardTitle></CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={280}>
                          <AreaChart data={analytics.revenueByDay}>
                            <defs>
                              <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#D85A30" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#D85A30" stopOpacity={0} />
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                            <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                            <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                            <Tooltip formatter={(v: number) => [formatPrice(v), 'Revenue']} />
                            <Area type="monotone" dataKey="revenue" stroke="#D85A30" fill="url(#colorRev)" strokeWidth={2} />
                          </AreaChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  )}

                  {/* Top dishes */}
                  {analytics.topDishes?.length > 0 && (
                    <Card>
                      <CardHeader><CardTitle>Top 5 Dishes (Last 30 Days)</CardTitle></CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {analytics.topDishes.map((d: any, i: number) => (
                            <div key={d.menuItemId} className="flex items-center gap-3">
                              <span className="w-6 h-6 rounded-full bg-primary-100 text-primary-600 text-xs font-bold flex items-center justify-center">{i + 1}</span>
                              <span className="flex-1 text-sm font-medium">{d.name}</span>
                              <span className="text-sm text-muted-foreground">{d.quantity} orders</span>
                              <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-primary-500 rounded-full" style={{ width: `${(d.quantity / analytics.topDishes[0].quantity) * 100}%` }} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </>
              ) : null}
            </motion.div>
          )}

          {/* ORDERS */}
          {activeTab === 'orders' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <h1 className="text-2xl font-bold">Orders</h1>
                <Button onClick={exportOrders} variant="outline" size="sm" className="gap-2">
                  <Download className="w-4 h-4" /> Export CSV
                </Button>
              </div>
              {/* Filters */}
              <div className="flex flex-wrap gap-3">
                <select value={orderStatus} onChange={(e) => setOrderStatus(e.target.value)} className="h-10 rounded-lg border border-input bg-background px-3 text-sm">
                  <option value="">All Statuses</option>
                  {Object.entries(ORDER_STATUS_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
                <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-40" placeholder="From date" />
                <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-40" placeholder="To date" />
                <Button onClick={loadOrders} size="sm">Filter</Button>
              </div>

              {orders.length === 0 ? (
                <div className="text-center py-12 border rounded-2xl bg-muted/20">
                  <p className="text-muted-foreground">No orders found. Apply filters and click Filter.</p>
                </div>
              ) : (
                <div className="rounded-xl border overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/50">
                      <tr>
                        {['Order', 'Date', 'Customer', 'Type', 'Status', 'Total'].map((h) => (
                          <th key={h} className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wide">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order.id} className="border-t hover:bg-muted/30 transition-colors">
                          <td className="px-4 py-3 font-mono text-primary-500 font-semibold">#{generateOrderRef(order.id)}</td>
                          <td className="px-4 py-3 text-muted-foreground">{formatDate(order.createdAt)}</td>
                          <td className="px-4 py-3">{order.user?.name || 'Guest'}</td>
                          <td className="px-4 py-3 capitalize">{order.type.replace('_', ' ')}</td>
                          <td className="px-4 py-3">
                            <Badge variant={order.status === 'DELIVERED' ? 'success' : order.status === 'CANCELLED' ? 'destructive' : 'default'}>
                              {ORDER_STATUS_LABELS[order.status] || order.status}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 font-semibold">{formatPrice(order.total)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          )}

          {/* MENU */}
          {activeTab === 'menu' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Menu Management</h1>
              </div>
              {menuCategories.map((cat) => (
                <div key={cat.id}>
                  <h3 className="font-semibold text-lg mb-3">{cat.name}</h3>
                  <div className="rounded-xl border overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="text-left px-4 py-2.5 font-semibold text-xs uppercase">Item</th>
                          <th className="text-left px-4 py-2.5 font-semibold text-xs uppercase">Price</th>
                          <th className="text-left px-4 py-2.5 font-semibold text-xs uppercase">Available</th>
                          <th className="text-left px-4 py-2.5 font-semibold text-xs uppercase">Tags</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cat.items.map((item: any) => (
                          <tr key={item.id} className="border-t hover:bg-muted/20 transition-colors">
                            <td className="px-4 py-3 font-medium">{item.name}</td>
                            <td className="px-4 py-3 text-primary-500 font-semibold">{formatPrice(item.price)}</td>
                            <td className="px-4 py-3">
                              <Switch
                                checked={item.isAvailable}
                                onCheckedChange={(v) => toggleItemAvailability(item.id, v)}
                              />
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex flex-wrap gap-1">
                                {item.dietaryTags.map((t: string) => (
                                  <Badge key={t} variant="outline" className="text-xs">{t}</Badge>
                                ))}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* BOOKINGS */}
          {activeTab === 'bookings' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
              <h1 className="text-2xl font-bold">Bookings</h1>
              <BookingsTab />
            </motion.div>
          )}

          {/* COUPONS */}
          {activeTab === 'coupons' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
              <h1 className="text-2xl font-bold">Coupons</h1>
              <CouponsTab />
            </motion.div>
          )}
        </div>
      </main>
    </div>
  )
}

function BookingsTab() {
  const [bookings, setBookings] = useState<any[]>([])
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])

  useEffect(() => {
    fetch(`/api/bookings?date=${date}`)
      .then((r) => r.json())
      .then((data) => Array.isArray(data) && setBookings(data))
  }, [date])

  return (
    <div className="space-y-4">
      <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-48" />
      {bookings.length === 0 ? (
        <p className="text-center text-muted-foreground py-12 border rounded-2xl bg-muted/20">No bookings for this date</p>
      ) : (
        <div className="rounded-xl border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>{['Name', 'Phone', 'Party', 'Time', 'Status', 'Notes'].map((h) => (
                <th key={h} className="text-left px-4 py-2.5 font-semibold text-xs uppercase">{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id} className="border-t hover:bg-muted/20">
                  <td className="px-4 py-3 font-medium">{b.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{b.phone}</td>
                  <td className="px-4 py-3">{b.partySize} guests</td>
                  <td className="px-4 py-3">{b.time}</td>
                  <td className="px-4 py-3"><Badge variant={b.status === 'CONFIRMED' ? 'success' : b.status === 'CANCELLED' ? 'destructive' : 'default'}>{b.status}</Badge></td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">{b.notes || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function CouponsTab() {
  const [coupons, setCoupons] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ code: '', type: 'PERCENTAGE', value: '', minOrderAmount: '', usageLimit: '', expiresAt: '' })

  useEffect(() => {
    fetch('/api/admin/analytics').finally(() => setLoading(false))
    // In production would have a coupons API
    setCoupons([
      { id: '1', code: 'WELCOME10', type: 'PERCENTAGE', value: 10, minOrderAmount: 0, usageCount: 45, usageLimit: null, expiresAt: null, isActive: true },
      { id: '2', code: 'FIRST50', type: 'FIXED', value: 50, minOrderAmount: 500, usageCount: 12, usageLimit: 100, expiresAt: null, isActive: true },
      { id: '3', code: 'SUMMER20', type: 'PERCENTAGE', value: 20, minOrderAmount: 0, usageCount: 200, usageLimit: 200, expiresAt: '2024-09-01', isActive: false },
    ])
    setLoading(false)
  }, [])

  return (
    <div className="space-y-4">
      <Button onClick={() => setShowForm(!showForm)} className="gap-2" variant="outline">
        <Plus className="w-4 h-4" /> Add Coupon
      </Button>

      {showForm && (
        <div className="p-5 rounded-2xl border bg-card space-y-4">
          <h3 className="font-semibold">New Coupon</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div><label className="text-xs font-medium">Code</label><Input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} placeholder="PROMO10" className="mt-1" /></div>
            <div><label className="text-xs font-medium">Type</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="mt-1 flex h-11 w-full rounded-lg border border-input bg-background px-3 text-sm">
                <option value="PERCENTAGE">Percentage</option>
                <option value="FIXED">Fixed Amount</option>
              </select>
            </div>
            <div><label className="text-xs font-medium">Value</label><Input type="number" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} placeholder={form.type === 'PERCENTAGE' ? '10' : '50'} className="mt-1" /></div>
            <div><label className="text-xs font-medium">Min Order (PKR)</label><Input type="number" value={form.minOrderAmount} onChange={(e) => setForm({ ...form, minOrderAmount: e.target.value })} placeholder="0" className="mt-1" /></div>
            <div><label className="text-xs font-medium">Usage Limit</label><Input type="number" value={form.usageLimit} onChange={(e) => setForm({ ...form, usageLimit: e.target.value })} placeholder="Unlimited" className="mt-1" /></div>
            <div><label className="text-xs font-medium">Expires At</label><Input type="date" value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} className="mt-1" /></div>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => { toast({ title: 'Coupon created!', description: form.code }); setShowForm(false) }}>Create Coupon</Button>
            <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </div>
      )}

      <div className="rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>{['Code', 'Type', 'Value', 'Min Order', 'Used', 'Expires', 'Active'].map((h) => (
              <th key={h} className="text-left px-4 py-2.5 font-semibold text-xs uppercase">{h}</th>
            ))}</tr>
          </thead>
          <tbody>
            {coupons.map((c) => (
              <tr key={c.id} className="border-t hover:bg-muted/20">
                <td className="px-4 py-3 font-mono font-bold text-primary-500">{c.code}</td>
                <td className="px-4 py-3">{c.type}</td>
                <td className="px-4 py-3">{c.type === 'PERCENTAGE' ? `${c.value}%` : formatPrice(c.value)}</td>
                <td className="px-4 py-3">{c.minOrderAmount > 0 ? formatPrice(c.minOrderAmount) : '—'}</td>
                <td className="px-4 py-3">{c.usageCount}{c.usageLimit ? `/${c.usageLimit}` : ''}</td>
                <td className="px-4 py-3 text-muted-foreground">{c.expiresAt ? formatDate(c.expiresAt) : 'Never'}</td>
                <td className="px-4 py-3">
                  <Switch
                    checked={c.isActive}
                    onCheckedChange={(v) => setCoupons((prev) => prev.map((p) => p.id === c.id ? { ...p, isActive: v } : p))}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
