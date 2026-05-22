'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react'

const testimonials = [
  {
    id: 1,
    name: 'Ayesha Malik',
    date: 'March 2024',
    rating: 5,
    review: 'The Chicken Karahi was absolutely spectacular — tender, aromatic and arrived piping hot. Delivery was faster than expected. This is now our family\'s go-to for special occasions!',
    avatar: 'AM',
  },
  {
    id: 2,
    name: 'Bilal Chaudhry',
    date: 'April 2024',
    rating: 5,
    review: 'I\'ve tried every biryani place in Lahore. Spice Garden\'s Beef Biryani is in a league of its own. The rice perfectly absorbs the spices and the meat is melt-in-your-mouth tender.',
    avatar: 'BC',
  },
  {
    id: 3,
    name: 'Sana Iqbal',
    date: 'May 2024',
    rating: 5,
    review: 'Booked a table for my husband\'s birthday and the staff went above and beyond. The food presentation was restaurant-quality and the live tracking feature for delivery is genius!',
    avatar: 'SI',
  },
]

export function Testimonials() {
  const [current, setCurrent] = useState(0)

  const prev = () => setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length)
  const next = () => setCurrent((c) => (c + 1) % testimonials.length)

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="text-primary-500 text-sm font-semibold uppercase tracking-widest">Reviews</span>
          <h2 className="text-4xl font-bold mt-2">What Our Customers Say</h2>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-muted/30 border rounded-2xl p-8 md:p-10 relative"
            >
              <Quote className="absolute top-6 right-6 w-8 h-8 text-primary-200" />
              <div className="flex gap-1 mb-5">
                {Array.from({ length: testimonials[current].rating }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-lg leading-relaxed text-foreground mb-8">
                "{testimonials[current].review}"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold">
                  {testimonials[current].avatar}
                </div>
                <div>
                  <p className="font-semibold">{testimonials[current].name}</p>
                  <p className="text-sm text-muted-foreground">{testimonials[current].date}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-full border flex items-center justify-center hover:border-primary-500 hover:text-primary-500 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`w-2 h-2 rounded-full transition-all ${i === current ? 'bg-primary-500 w-6' : 'bg-muted-foreground/30'}`}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="w-10 h-10 rounded-full border flex items-center justify-center hover:border-primary-500 hover:text-primary-500 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
