'use client'

import { useEffect, useState, use } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CheckCircle, Clock, ChefHat, Bike, Package, PhoneCall,
  RefreshCw, Star, MapPin,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatPrice, formatDate, formatTime, generateOrderRef, ORDER_STATUS_LABELS } from '@/lib/utils'
import { connectSocket, disconnectSocket, joinOrderRoom } from '@/lib/socket'

interface OrderData {
  id: string
  status: string
  type: string
  estimatedTime: number | null
  total: number
  subtotal: number
  deliveryFee: number
  discount: number
  paymentMethod: string
  paymentStatus: string
  createdAt: string
  items: Array<{ id: string; quantity: number; unitPrice: number; menuItem: { name: string } }>
  driver?: { user: { name: string | null }; currentLat: number | null; currentLng: number | null } | null
}

const STATUS_STEPS = ['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'OUT_FOR_DELIVERY', 'DELIVERED'] as const

const STEP_ICONS = {
  PENDING: Package,
  CONFIRMED: CheckCircle,
  PREPARING: ChefHat,
  READY: Package,
  OUT_FOR_DELIVERY: Bike,
  DELIVERED: CheckCircle,
}

function getStepIndex(status: string) {
  return STATUS_STEPS.indexOf(status as any)
}

export default function TrackPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [order, setOrder] = useState<OrderData | null>(null)
  const [loading, setLoading] = useState(true)
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${id}`)
        if (res.ok) {
          const data = await res.json()
          setOrder(data)
          if (data.status === 'DELIVERED') setShowConfetti(true)
        }
      } finally {
        setLoading(false)
      }
    }
    fetchOrder()

    const socket = connectSocket()
    joinOrderRoom(id)

    socket.on('order:status-changed', ({ orderId, status, estimatedTime }: any) => {
      if (orderId === id) {
        setOrder((prev) => prev ? { ...prev, status, estimatedTime } : prev)
        if (status === 'DELIVERED') setShowConfetti(true)
      }
    })

    socket.on('order:driver-location', ({ orderId, lat, lng }: any) => {
      if (orderId === id) {
        setOrder((prev) => prev && prev.driver ? { ...prev, driver: { ...prev.driver, currentLat: lat, currentLng: lng } } : prev)
      }
    })

    return () => {
      socket.off('order:status-changed')
      socket.off('order:driver-location')
      disconnectSocket()
    }
  }, [id])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading order...</p>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-2">Order not found</h2>
        <Button asChild><Link href="/">Back to Home</Link></Button>
      </div>
    )
  }

  const currentStep = getStepIndex(order.status)
  const isCancelled = order.status === 'CANCELLED'
  const isDelivered = order.status === 'DELIVERED'

  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl">
      {/* Confetti effect */}
      <AnimatePresence>
        {showConfetti && isDelivered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 pointer-events-none z-50"
          >
            {Array.from({ length: 30 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ y: -20, x: `${Math.random() * 100}vw`, opacity: 1 }}
                animate={{ y: '100vh', opacity: 0, rotate: Math.random() * 360 }}
                transition={{ duration: 2 + Math.random() * 2, delay: Math.random() * 0.5 }}
                className="absolute w-3 h-3 rounded-sm"
                style={{ backgroundColor: ['#D85A30', '#FFD700', '#1D9E75', '#4A90E2'][i % 4] }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold">
              {isDelivered ? 'Order Delivered!' : 'Tracking Your Order'}
            </h1>
            <p className="text-muted-foreground mt-1">
              Order #{generateOrderRef(order.id)} · {formatDate(order.createdAt)}
            </p>
          </div>
          {!isDelivered && !isCancelled && (
            <div className="flex items-center gap-2 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 px-4 py-2 rounded-xl">
              <Clock className="w-4 h-4" />
              <span className="font-semibold">
                {order.estimatedTime ? `~${order.estimatedTime} min` : 'Estimating...'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Status bar */}
      {!isCancelled && (
        <div className="p-6 rounded-2xl border bg-card mb-6">
          <div className="flex items-center justify-between relative">
            {/* Progress line */}
            <div className="absolute top-6 left-6 right-6 h-0.5 bg-muted">
              <motion.div
                className="h-full bg-primary-500"
                initial={{ width: '0%' }}
                animate={{ width: `${Math.max(0, (currentStep / (STATUS_STEPS.length - 1)) * 100)}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            {STATUS_STEPS.map((status, i) => {
              const Icon = STEP_ICONS[status]
              const isDone = i < currentStep
              const isActive = i === currentStep
              return (
                <div key={status} className="flex flex-col items-center gap-2 relative z-10">
                  <motion.div
                    animate={isActive ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                      isDone ? 'bg-primary-500 text-white' :
                      isActive ? 'bg-primary-500 text-white ring-4 ring-primary-200' :
                      'bg-muted text-muted-foreground'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </motion.div>
                  <span className={`text-xs font-medium text-center max-w-[60px] ${isActive ? 'text-primary-500' : isDone ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {ORDER_STATUS_LABELS[status]}
                  </span>
                </div>
              )
            })}
          </div>

          <div className="mt-6 p-3 bg-muted/50 rounded-xl">
            <p className="text-sm font-medium text-center">
              {isDelivered
                ? 'Your order has been delivered. Enjoy your meal!'
                : `Status: ${ORDER_STATUS_LABELS[order.status] || order.status}`}
            </p>
          </div>
        </div>
      )}

      {isCancelled && (
        <div className="p-6 rounded-2xl border border-destructive/30 bg-destructive/5 mb-6 text-center">
          <p className="font-semibold text-destructive text-lg">Order Cancelled</p>
          <p className="text-sm text-muted-foreground mt-1">Your order has been cancelled. Please contact support for a refund.</p>
        </div>
      )}

      {/* Order items */}
      <div className="p-5 rounded-2xl border bg-card space-y-4 mb-6">
        <h3 className="font-semibold">Items Ordered</h3>
        {order.items.map((item) => (
          <div key={item.id} className="flex justify-between text-sm">
            <span className="text-muted-foreground">{item.menuItem.name} × {item.quantity}</span>
            <span>{formatPrice(item.unitPrice * item.quantity)}</span>
          </div>
        ))}
        <div className="border-t pt-3 space-y-1 text-sm">
          <div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
          {order.discount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>-{formatPrice(order.discount)}</span></div>}
          <div className="flex justify-between text-muted-foreground"><span>Delivery</span><span>{order.deliveryFee === 0 ? 'Free' : formatPrice(order.deliveryFee)}</span></div>
          <div className="flex justify-between font-bold text-base mt-2">
            <span>Total Paid</span>
            <span className="text-primary-500">{formatPrice(order.total)}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        {isDelivered && (
          <Button asChild className="flex-1">
            <Link href="/menu" className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4" /> Re-order
            </Link>
          </Button>
        )}
        <Button asChild variant="outline" className="flex-1">
          <a href="tel:+924235761234" className="flex items-center gap-2">
            <PhoneCall className="w-4 h-4" /> Contact Support
          </a>
        </Button>
        {isDelivered && (
          <Button asChild variant="outline" className="flex-1">
            <Link href="/menu" className="flex items-center gap-2">
              <Star className="w-4 h-4" /> Leave Review
            </Link>
          </Button>
        )}
      </div>
    </div>
  )
}
