'use client'

import { motion } from 'framer-motion'
import { UtensilsCrossed, ShoppingCart, Zap } from 'lucide-react'

const steps = [
  {
    number: '01',
    icon: UtensilsCrossed,
    title: 'Browse Our Menu',
    description: 'Explore our extensive menu of authentic Pakistani dishes, from aromatic biryanis to grilled specialities.',
  },
  {
    number: '02',
    icon: ShoppingCart,
    title: 'Place Your Order',
    description: 'Add items to your cart, apply promo codes, enter your address, and pay securely online.',
  },
  {
    number: '03',
    icon: Zap,
    title: 'Fast Delivery',
    description: 'Our dedicated drivers deliver hot, fresh food right to your door in about 30 minutes.',
  },
]

export function HowItWorks() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="text-primary-500 text-sm font-semibold uppercase tracking-widest">Simple Process</span>
          <h2 className="text-4xl font-bold mt-2">How It Works</h2>
          <p className="text-muted-foreground mt-3">Three easy steps to enjoy our food at home</p>
        </motion.div>

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-10 left-[calc(16.66%+2rem)] right-[calc(16.66%+2rem)] h-0.5 bg-gradient-to-r from-primary-200 via-primary-400 to-primary-200" />

          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="flex flex-col items-center text-center relative"
            >
              <div className="relative w-20 h-20 mb-6">
                <div className="w-20 h-20 rounded-2xl bg-primary-500 flex items-center justify-center shadow-lg shadow-primary-500/30">
                  <step.icon className="w-9 h-9 text-white" />
                </div>
                <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-background border-2 border-primary-500 text-primary-500 text-xs font-bold flex items-center justify-center">
                  {step.number}
                </span>
              </div>
              <h3 className="font-semibold text-xl mb-3">{step.title}</h3>
              <p className="text-muted-foreground leading-relaxed max-w-xs">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
