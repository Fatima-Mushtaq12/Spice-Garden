import type { Metadata } from 'next'
import { Hero } from '@/components/home/Hero'
import { TrustBar } from '@/components/home/TrustBar'
import { FeaturedDishes } from '@/components/home/FeaturedDishes'
import { HowItWorks } from '@/components/home/HowItWorks'
import { Testimonials } from '@/components/home/Testimonials'
import { LocationSection } from '@/components/home/LocationSection'

export const metadata: Metadata = {
  title: 'Spice Garden — Authentic Pakistani Cuisine, Lahore',
  description:
    'Spice Garden serves authentic Pakistani food in Lahore. Order online for fast delivery or book your table. Biryanis, karahis, grills and more.',
}

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Restaurant',
            name: 'Spice Garden',
            image: 'https://spicegarden.pk/images/og-image.jpg',
            servesCuisine: 'Pakistani',
            address: {
              '@type': 'PostalAddress',
              streetAddress: '45 MM Alam Road, Gulberg III',
              addressLocality: 'Lahore',
              addressRegion: 'Punjab',
              postalCode: '54000',
              addressCountry: 'PK',
            },
            telephone: '+924235761234',
            url: 'https://spicegarden.pk',
            openingHours: [
              'Mo-Th 12:00-23:00',
              'Fr-Sa 12:00-00:00',
              'Su 13:00-23:00',
            ],
            priceRange: '$$',
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: '4.9',
              reviewCount: '328',
            },
          }),
        }}
      />
      <Hero />
      <TrustBar />
      <FeaturedDishes />
      <HowItWorks />
      <Testimonials />
      <LocationSection />
    </>
  )
}
