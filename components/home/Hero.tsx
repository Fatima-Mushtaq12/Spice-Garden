'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, CalendarDays } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Hero() {
  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-secondary via-secondary/95 to-secondary/80"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=1920&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundBlendMode: 'multiply',
        }}
      />
      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-secondary/90 via-secondary/70 to-transparent" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <span className="inline-flex items-center gap-2 bg-primary-500/20 text-primary-300 border border-primary-500/30 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-primary-400 animate-pulse" />
              Open Now · Est. 30 min delivery
            </span>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
              Authentic<br />
              <span className="text-primary-400">Flavours</span>,<br />
              Delivered
            </h1>

            <p className="text-lg text-gray-300 mb-8 leading-relaxed max-w-lg">
              Experience the rich heritage of Pakistani cuisine from Spice Garden, Lahore's finest.
              From aromatic biryanis to sizzling karahis — crafted fresh, every order.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="xl">
                <Link href="/order" className="flex items-center gap-2">
                  Order Now
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button asChild size="xl" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                <Link href="/book" className="flex items-center gap-2">
                  <CalendarDays className="w-5 h-5" />
                  Book a Table
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
      >
        <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-1">
          <div className="w-1.5 h-3 bg-white/60 rounded-full" />
        </div>
      </motion.div>
    </section>
  )
}
