'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Search, SlidersHorizontal } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { MenuCard } from '@/components/menu/MenuCard'
import { ItemModal } from '@/components/menu/ItemModal'
import type { MenuItem } from '@/components/menu/ItemModal'

interface Category {
  id: string
  name: string
  items: MenuItem[]
}

const DIETARY_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'vegetarian', label: 'Vegetarian' },
  { id: 'spicy', label: 'Spicy' },
  { id: 'halal', label: 'Halal' },
  { id: 'gluten-free', label: 'Gluten Free' },
]

export default function MenuPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState('all')
  const [activeCategory, setActiveCategory] = useState('')
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({})

  useEffect(() => {
    fetch('/api/menu')
      .then((r) => r.json())
      .then((data) => {
        setCategories(data.categories || [])
        if (data.categories?.[0]) setActiveCategory(data.categories[0].id)
      })
      .finally(() => setLoading(false))
  }, [])

  // Update active category on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveCategory(entry.target.id.replace('cat-', ''))
          }
        })
      },
      { threshold: 0.3, rootMargin: '-80px 0px -60% 0px' }
    )
    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref)
    })
    return () => observer.disconnect()
  }, [categories])

  const scrollToCategory = (id: string) => {
    const el = sectionRefs.current[id]
    if (el) {
      const offset = 130
      const top = el.getBoundingClientRect().top + window.scrollY - offset
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }

  const filteredCategories = categories
    .map((cat) => ({
      ...cat,
      items: cat.items.filter((item) => {
        const matchesSearch =
          search === '' ||
          item.name.toLowerCase().includes(search.toLowerCase()) ||
          item.description?.toLowerCase().includes(search.toLowerCase())
        const matchesFilter =
          activeFilter === 'all' || item.dietaryTags.includes(activeFilter)
        return matchesSearch && matchesFilter
      }),
    }))
    .filter((cat) => cat.items.length > 0)

  return (
    <>
      <div className="sticky top-16 z-30 bg-background/95 backdrop-blur border-b shadow-sm">
        <div className="container mx-auto px-4">
          {/* Search + filter row */}
          <div className="flex items-center gap-3 py-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search dishes..."
                className="pl-9"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {DIETARY_FILTERS.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setActiveFilter(f.id)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
                    activeFilter === f.id
                      ? 'bg-primary-500 text-white'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
          {/* Category tabs */}
          <div className="flex gap-1 overflow-x-auto scrollbar-hide pb-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => scrollToCategory(cat.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
                  activeCategory === cat.id
                    ? 'text-primary-500 border-b-2 border-primary-500 rounded-none'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="rounded-2xl bg-muted animate-pulse h-64" />
            ))}
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <SlidersHorizontal className="w-12 h-12 text-muted-foreground mb-4" />
            <p className="text-lg font-semibold">No dishes found</p>
            <p className="text-sm text-muted-foreground mt-1">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="space-y-14">
            {filteredCategories.map((cat) => (
              <section
                key={cat.id}
                id={`cat-${cat.id}`}
                ref={(el) => { sectionRefs.current[cat.id] = el }}
              >
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="mb-6"
                >
                  <h2 className="text-2xl font-bold">{cat.name}</h2>
                  <div className="w-12 h-1 bg-primary-500 rounded-full mt-2" />
                </motion.div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {cat.items.map((item, i) => (
                    <MenuCard key={item.id} item={item} onOpen={setSelectedItem} index={i} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>

      <ItemModal item={selectedItem} open={!!selectedItem} onClose={() => setSelectedItem(null)} />
    </>
  )
}
