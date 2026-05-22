import type { Metadata } from 'next'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Gallery',
  description: 'Browse photos of our authentic Pakistani dishes, restaurant ambiance and culinary events at Spice Garden, Lahore.',
}

const images = [
  { src: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=600&q=80', alt: 'Chicken Biryani', category: 'Food' },
  { src: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&q=80', alt: 'Chicken Karahi', category: 'Food' },
  { src: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80', alt: 'Mixed BBQ Platter', category: 'Food' },
  { src: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&q=80', alt: 'Seekh Kabab', category: 'Food' },
  { src: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80', alt: 'Restaurant Interior', category: 'Ambiance' },
  { src: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&q=80', alt: 'Dining Area', category: 'Ambiance' },
  { src: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&q=80', alt: 'Samosa Chaat', category: 'Food' },
  { src: 'https://images.unsplash.com/photo-1567206563114-c179900d4f75?w=600&q=80', alt: 'Gulab Jamun', category: 'Desserts' },
  { src: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80', alt: 'Chef at Work', category: 'Kitchen' },
  { src: 'https://images.unsplash.com/photo-1581299894007-aaa50297cf16?w=600&q=80', alt: 'Cooking', category: 'Kitchen' },
  { src: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&q=80', alt: 'Lamb Nihari', category: 'Food' },
  { src: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=600&q=80', alt: 'Mango Lassi', category: 'Beverages' },
]

export default function GalleryPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ImageGallery',
            name: 'Spice Garden Gallery',
            url: 'https://spicegarden.pk/gallery',
          }),
        }}
      />

      {/* Header */}
      <section className="relative h-56 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute inset-0 bg-secondary/75" />
        <div className="relative z-10 text-center text-white">
          <h1 className="text-4xl font-bold mb-2">Our Gallery</h1>
          <p className="text-gray-300">A visual taste of Spice Garden</p>
        </div>
      </section>

      {/* Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            {images.map((img, i) => (
              <div key={i} className="break-inside-avoid rounded-2xl overflow-hidden relative group cursor-pointer">
                <Image
                  src={img.src}
                  alt={img.alt}
                  width={400}
                  height={300}
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-secondary/0 group-hover:bg-secondary/40 transition-colors duration-300 flex items-end">
                  <div className="p-3 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 opacity-0 group-hover:opacity-100">
                    <span className="text-xs font-medium text-white bg-primary-500 px-2 py-0.5 rounded-full">{img.category}</span>
                    <p className="text-sm text-white font-semibold mt-1">{img.alt}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
