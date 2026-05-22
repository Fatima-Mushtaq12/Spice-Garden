import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Award, Heart, Users, Leaf } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about Spice Garden, Lahore\'s finest Pakistani restaurant established in 2018.',
}

const values = [
  { icon: Heart, title: 'Cooked with Love', description: 'Every dish is prepared by our chefs who grew up eating and loving authentic Pakistani home cooking.' },
  { icon: Leaf, title: 'Fresh Ingredients', description: 'We source our spices from the Anarkali spice market and vegetables from local farms daily.' },
  { icon: Users, title: 'Family Heritage', description: 'Our recipes have been passed down through generations, preserving the soul of Pakistani cuisine.' },
  { icon: Award, title: 'Award Winning', description: 'Best Restaurant Lahore 2022 & 2023 by Lahore Food Guide. 4.9 stars across 500+ reviews.' },
]

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'AboutPage',
            name: 'About Spice Garden',
            url: 'https://spicegarden.pk/about',
          }),
        }}
      />

      {/* Hero */}
      <section className="relative h-72 flex items-center overflow-hidden">
        <div className="absolute inset-0" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute inset-0 bg-secondary/70" />
        <div className="container mx-auto px-4 relative z-10 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">Our Story</h1>
          <p className="text-lg text-gray-300">Crafting authentic flavours since 2018</p>
        </div>
      </section>

      {/* Story */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-primary-500 text-sm font-semibold uppercase tracking-widest">Est. 2018</span>
              <h2 className="text-3xl font-bold mt-2 mb-6">Born from a Passion for Authentic Pakistani Food</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Spice Garden was founded by Chef Tariq and his wife Nadia with a simple dream: to recreate the authentic flavours of their grandmothers' kitchens in Lahore's Walled City.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                What started as a 20-seat restaurant on MM Alam Road has grown into one of Lahore's most beloved dining destinations, serving over 5,000 happy customers every month.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                We believe that food is more than sustenance — it's memory, culture and love. Every dish we serve carries the soul of Pakistani culinary heritage.
              </p>
              <Button asChild size="lg"><Link href="/menu">Explore Our Menu</Link></Button>
            </div>
            <div className="relative">
              <div className="rounded-2xl overflow-hidden h-80 relative">
                <Image src="https://images.unsplash.com/photo-1581299894007-aaa50297cf16?w=600&q=80" alt="Chef cooking" fill className="object-cover" />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-primary-500 text-white p-5 rounded-2xl shadow-xl">
                <p className="text-3xl font-bold">6+</p>
                <p className="text-sm opacity-90">Years of Excellence</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">What We Stand For</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(({ icon: Icon, title, description }) => (
              <div key={title} className="p-6 rounded-2xl border bg-card text-center">
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6 text-primary-500" />
                </div>
                <h3 className="font-semibold mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-secondary text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">Come Dine With Us</h2>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">Reserve a table or order online and experience the authentic taste of Pakistan.</p>
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg"><Link href="/book">Book a Table</Link></Button>
            <Button asChild size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10"><Link href="/order">Order Online</Link></Button>
          </div>
        </div>
      </section>
    </>
  )
}
