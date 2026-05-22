import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { CartDrawer } from '@/components/layout/CartDrawer'
import { Toaster } from '@/components/ui/toaster'
import { auth } from '@/lib/auth'

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  return (
    <>
      <Navbar user={session?.user as any} />
      <main className="min-h-screen pt-16">{children}</main>
      <Footer />
      <CartDrawer />
      <Toaster />
    </>
  )
}
