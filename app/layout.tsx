import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Spice Garden — Authentic Pakistani Cuisine, Lahore',
    template: '%s | Spice Garden',
  },
  description:
    'Order authentic Pakistani food online from Spice Garden, Lahore. Fast delivery, easy ordering, and unforgettable flavours.',
  keywords: ['Pakistani food', 'restaurant Lahore', 'online food ordering', 'biryani', 'karahi'],
  openGraph: {
    type: 'website',
    locale: 'en_PK',
    url: 'https://spicegarden.pk',
    siteName: 'Spice Garden',
    title: 'Spice Garden — Authentic Pakistani Cuisine',
    description: 'Authentic flavours, delivered to your door.',
    images: [{ url: '/images/og-image.jpg', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  )
}
