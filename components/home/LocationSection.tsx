'use client'

import { motion } from 'framer-motion'
import { MapPin, Phone, Clock, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'

const hours = [
  { day: 'Monday – Thursday', hours: '12:00 PM – 11:00 PM' },
  { day: 'Friday – Saturday', hours: '12:00 PM – 12:00 AM' },
  { day: 'Sunday', hours: '1:00 PM – 11:00 PM' },
]

export function LocationSection() {
  return (
    <section className="py-20 bg-muted/20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-primary-500 text-sm font-semibold uppercase tracking-widest">Visit Us</span>
          <h2 className="text-4xl font-bold mt-2">Find Us in Lahore</h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* Map placeholder */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl overflow-hidden border bg-muted h-80 lg:h-full min-h-[320px] flex items-center justify-center relative"
          >
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&q=70')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
            <div className="absolute inset-0 bg-secondary/40" />
            <a
              href="https://maps.google.com/?q=Gulberg+III+Lahore"
              target="_blank"
              rel="noopener noreferrer"
              className="relative z-10 flex items-center gap-2 bg-background px-4 py-2 rounded-xl shadow-lg text-sm font-medium hover:bg-primary-500 hover:text-white transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Open in Google Maps
            </a>
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-6 h-6 text-primary-500" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Address</h3>
                <p className="text-muted-foreground mt-1">45 MM Alam Road, Gulberg III<br />Lahore, Punjab 54000, Pakistan</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center flex-shrink-0">
                <Phone className="w-6 h-6 text-primary-500" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Phone</h3>
                <a href="tel:+924235761234" className="text-muted-foreground hover:text-primary-500 transition-colors mt-1 block">
                  +92 42 3576 1234
                </a>
                <a href="tel:+923001234567" className="text-muted-foreground hover:text-primary-500 transition-colors">
                  +92 300 123 4567 (WhatsApp)
                </a>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center flex-shrink-0">
                <Clock className="w-6 h-6 text-primary-500" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-3">Opening Hours</h3>
                <div className="space-y-2">
                  {hours.map(({ day, hours: h }) => (
                    <div key={day} className="flex justify-between text-sm gap-4">
                      <span className="text-muted-foreground">{day}</span>
                      <span className="font-medium">{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <Button asChild size="lg" className="w-full sm:w-auto">
              <a href="https://maps.google.com/?q=Gulberg+III+Lahore" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Get Directions
              </a>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
