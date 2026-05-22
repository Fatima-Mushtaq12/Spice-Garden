'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Plus, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/store/cartStore'
import { formatPrice } from '@/lib/utils'
import { toast } from '@/components/ui/use-toast'

interface FeaturedItem {
  id: string
  name: string
  description: string
  price: number
  imageUrl: string | null
}

export function FeaturedDishes() {
  const [dishes, setDishes] = useState<FeaturedItem[]>([])
  const [loading, setLoading] = useState(true)
  const { addItem } = useCartStore()

  useEffect(() => {
    fetch('/api/menu?featured=true')
      .then((r) => r.json())
      .then((data) => {
        const allItems: FeaturedItem[] = []
        if (Array.isArray(data.categories)) {
          data.categories.forEach((cat: any) => {
            cat.items?.forEach((item: any) => allItems.push(item))
          })
        }
        setDishes(allItems.slice(0, 6))
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleAdd = (dish: FeaturedItem) => {
    addItem({
      menuItemId: dish.id,
      name: dish.name,
      price: dish.price,
      quantity: 1,
      selectedModifiers: [],
      imageUrl: dish.imageUrl || undefined,
    })
    toast({ title: 'Added to cart', description: dish.name, variant: 'default' })
  }

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-primary-500 text-sm font-semibold uppercase tracking-widest">Our Specialties</span>
          <h2 className="text-4xl font-bold mt-2">Featured Dishes</h2>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
            Handpicked favourites from our master chefs — the dishes Lahore can't stop talking about.
          </p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-2xl bg-muted animate-pulse h-72" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {dishes.map((dish, i) => (
              <motion.div
                key={dish.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="group rounded-2xl border bg-card overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={dish.imageUrl || `https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&q=70`}
                    alt={dish.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-base">{dish.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{dish.description}</p>
                  <div className="flex items-center justify-between mt-4">
                    <span className="font-bold text-primary-500">{formatPrice(dish.price)}</span>
                    <button
                      onClick={() => handleAdd(dish)}
                      className="w-9 h-9 rounded-xl bg-primary-500 text-white flex items-center justify-center hover:bg-primary-600 active:scale-95 transition-all"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <div className="text-center mt-10">
          <Button asChild variant="outline" size="lg">
            <Link href="/menu" className="flex items-center gap-2">
              View Full Menu <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
