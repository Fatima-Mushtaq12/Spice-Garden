import Link from 'next/link'
import { Facebook, Instagram, MessageCircle, MapPin, Phone, Mail, Clock } from 'lucide-react'

const footerLinks = {
  company: [
    { href: '/about', label: 'About Us' },
    { href: '/gallery', label: 'Gallery' },
    { href: '/menu', label: 'Our Menu' },
    { href: '/book', label: 'Reservations' },
  ],
  legal: [
    { href: '/privacy', label: 'Privacy Policy' },
    { href: '/terms', label: 'Terms of Service' },
    { href: '/refund', label: 'Refund Policy' },
  ],
}

export function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 pt-14 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-primary-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="font-bold text-xl text-white">
                Spice <span className="text-primary-400">Garden</span>
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-5">
              Authentic Pakistani flavours crafted with love since 2018. From our kitchen to your table.
            </p>
            <div className="flex gap-3">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center hover:bg-primary-500 transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center hover:bg-primary-500 transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="https://wa.me/923001234567" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center hover:bg-primary-500 transition-colors">
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-primary-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex gap-3 text-sm text-gray-400">
                <MapPin className="w-4 h-4 text-primary-400 flex-shrink-0 mt-0.5" />
                45 MM Alam Road, Gulberg III, Lahore, Punjab 54000
              </li>
              <li>
                <a href="tel:+924235761234" className="flex gap-3 text-sm text-gray-400 hover:text-primary-400 transition-colors">
                  <Phone className="w-4 h-4 text-primary-400 flex-shrink-0" />
                  +92 42 3576 1234
                </a>
              </li>
              <li>
                <a href="mailto:hello@spicegarden.pk" className="flex gap-3 text-sm text-gray-400 hover:text-primary-400 transition-colors">
                  <Mail className="w-4 h-4 text-primary-400 flex-shrink-0" />
                  hello@spicegarden.pk
                </a>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 className="font-semibold text-white mb-4">Opening Hours</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              {[
                { day: 'Mon – Thu', hours: '12:00 PM – 11:00 PM' },
                { day: 'Fri – Sat', hours: '12:00 PM – 12:00 AM' },
                { day: 'Sunday', hours: '1:00 PM – 11:00 PM' },
              ].map(({ day, hours }) => (
                <li key={day} className="flex justify-between gap-4">
                  <span className="text-gray-300">{day}</span>
                  <span>{hours}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex items-center gap-2 text-xs text-primary-400">
              <div className="w-2 h-2 rounded-full bg-primary-400 animate-pulse" />
              Currently Open for Delivery
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} Spice Garden Restaurant. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {footerLinks.legal.map((link) => (
              <Link key={link.href} href={link.href} className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
                {link.label}
              </Link>
            ))}
          </div>
          {/* Payment icons */}
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className="px-2 py-1 rounded border border-white/20 font-mono">VISA</span>
            <span className="px-2 py-1 rounded border border-white/20 font-mono">MC</span>
            <span className="px-2 py-1 rounded border border-white/20 font-mono">JCB</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
