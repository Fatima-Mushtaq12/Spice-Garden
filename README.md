# Spice Garden — Full-Stack Restaurant Website

A production-grade restaurant website and online ordering system for **Spice Garden**, an authentic Pakistani restaurant in Lahore. Built with Next.js 14, TypeScript, Stripe, Socket.io and Supabase.

---

## Features

- **Online Ordering** — Full cart, checkout, Stripe payment, coupon codes
- **Real-time Tracking** — Socket.io live order status with step-by-step progress bar
- **Table Booking** — Date/time/party-size reservation with confirmation email & SMS
- **Staff Dashboard** — Live order queue, accept/reject, status updates
- **Admin Panel** — Revenue charts, order management, menu toggles, coupon management
- **Auth** — Google OAuth + credentials via NextAuth.js v5
- **Emails** — React Email + Resend for order & booking confirmations
- **SMS** — Twilio for order and booking notifications
- **Dark Mode** — Full dark mode support via Tailwind CSS
- **JSON-LD SEO** — Schema markup on all public pages

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router, TypeScript) |
| Styling | Tailwind CSS + shadcn/ui |
| Animation | Framer Motion |
| State | Zustand (with localStorage persistence) |
| Forms | React Hook Form + Zod |
| Database | PostgreSQL via Supabase (Prisma ORM) |
| Auth | NextAuth.js v5 (Google OAuth + Credentials) |
| Payments | Stripe (PaymentElement, Webhooks) |
| Real-time | Socket.io (Express server) |
| Email | Resend + React Email |
| SMS | Twilio |
| Maps | Google Maps JavaScript API |
| Charts | Recharts |

---

## Quick Start

### 1. Clone and install

```bash
cd "restaurant-website"
npm install --legacy-peer-deps
```

### 2. Configure environment variables

```bash
cp .env.example .env
```

Fill in all values in `.env`. The required keys are:

| Variable | Source |
|---|---|
| `DATABASE_URL` | Supabase → Project Settings → Database |
| `DIRECT_URL` | Same, without PgBouncer |
| `NEXTAUTH_SECRET` | Run `openssl rand -base64 32` |
| `GOOGLE_CLIENT_ID/SECRET` | Google Cloud Console OAuth 2.0 |
| `STRIPE_SECRET_KEY` | Stripe Dashboard → API Keys |
| `STRIPE_WEBHOOK_SECRET` | `stripe listen --forward-to localhost:3000/api/webhooks/stripe` |
| `RESEND_API_KEY` | resend.com → API Keys |
| `TWILIO_*` | Twilio Console |
| `NEXT_PUBLIC_GOOGLE_MAPS_KEY` | Google Cloud Console → Maps JavaScript API |
| `NEXT_PUBLIC_SUPABASE_*` | Supabase → Project Settings → API |

### 3. Set up the database

```bash
# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# Seed with sample data (restaurant, menu, users, coupons)
npm run db:seed
```

After seeding, copy the `Restaurant ID` printed at the end and add it to `.env`:
```
NEXT_PUBLIC_RESTAURANT_ID=<printed-id>
```

### 4. Start development

```bash
# Terminal 1: Next.js app
npm run dev

# Terminal 2: Socket.io server
npm run server:dev
```

Visit http://localhost:3000

---

## Project Structure

```
app/
  (public)/           Public routes (Home, Menu, Order, Track, Book, About, Gallery)
  (auth)/             Auth-gated routes (Account)
  (dashboard)/        Staff dashboard (role: STAFF or ADMIN)
  (admin)/            Admin panel (role: ADMIN)
  api/                API route handlers
components/
  ui/                 shadcn/ui primitives (Button, Card, Dialog, Sheet, etc.)
  layout/             Navbar, Footer, CartDrawer
  home/               Hero, TrustBar, FeaturedDishes, HowItWorks, Testimonials, LocationSection
  menu/               MenuCard, ItemModal
  order/              (used in app/(public)/order/page.tsx)
  tracking/           (used in app/(public)/track/[id]/page.tsx)
lib/
  db/prisma.ts        Prisma singleton
  auth.ts             NextAuth.js config
  stripe.ts           Stripe client
  socket.ts           Socket.io client helper
  resend.ts           Resend client
  twilio.ts           Twilio SMS helpers
  maps.ts             Google Maps loader + delivery zone check
  validations/        Zod schemas for order and booking
  utils/              cn(), formatPrice(), formatDate(), etc.
store/
  cartStore.ts        Zustand cart with localStorage persistence
  sessionStore.ts     Global session state
prisma/
  schema.prisma       Full database schema
  seed.ts             Seed script (restaurant, 20 menu items, 3 coupons, 3 users)
emails/
  OrderConfirmation.tsx
  BookingConfirmation.tsx
  OrderStatusUpdate.tsx
server/
  index.ts            Express + Socket.io server (deploy separately)
```

---

## Deployment

### Frontend → Vercel

1. Push to GitHub
2. Import project in Vercel
3. Add all environment variables
4. Set `NEXTAUTH_URL` to your Vercel domain

### Socket.io Server → Railway

1. Create new Railway project from GitHub repo
2. Set start command: `npm run server:start`
3. Set `PORT` environment variable
4. Copy the Railway URL to `SOCKET_SERVER_URL` and `NEXT_PUBLIC_SOCKET_URL`

### Stripe Webhooks

Register the webhook endpoint in Stripe Dashboard:
```
https://yourdomain.com/api/webhooks/stripe
```
Events to listen: `payment_intent.succeeded`, `payment_intent.payment_failed`

---

## Test Credentials

After running `npm run db:seed`:

| Role | Email | Notes |
|---|---|---|
| Admin | `admin@spicegarden.pk` | Access to `/admin` |
| Staff | `staff@spicegarden.pk` | Access to `/dashboard` |
| Driver | `driver@spicegarden.pk` | Driver account |

Test coupons: `WELCOME10` (10% off), `FIRST50` (PKR 50 off, min PKR 500)

Stripe test cards: `4242 4242 4242 4242` (any future date, any CVC)

---

## Database Schema

Key models: `User`, `Restaurant`, `MenuCategory`, `MenuItem`, `Modifier`, `Order`, `OrderItem`, `Booking`, `Coupon`, `Review`, `Driver`

See [`prisma/schema.prisma`](prisma/schema.prisma) for the full schema.

---

## Environment Variables

See [`.env.example`](.env.example) for all required variables with descriptions.

---

## License

MIT — free for personal and commercial use.
