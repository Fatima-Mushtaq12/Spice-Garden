'use client'

import { motion } from 'framer-motion'
import { Star, ShoppingBag, Clock, Award } from 'lucide-react'

const metrics = [
  { icon: ShoppingBag, value: '5,000+', label: 'Happy Orders', color: 'text-primary-500' },
  { icon: Star, value: '4.9 ★', label: 'Google Rating', color: 'text-yellow-500' },
  { icon: Award, value: 'Est. 2018', label: 'Years of Excellence', color: 'text-blue-500' },
  { icon: Clock, value: '~30 min', label: 'Avg. Delivery', color: 'text-green-500' },
]

export function TrustBar() {
  return (
    <section className="bg-background border-b">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {metrics.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center text-center gap-2"
            >
              <div className={`w-12 h-12 rounded-2xl bg-muted flex items-center justify-center ${m.color}`}>
                <m.icon className="w-6 h-6" />
              </div>
              <span className="text-2xl font-bold">{m.value}</span>
              <span className="text-sm text-muted-foreground">{m.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
