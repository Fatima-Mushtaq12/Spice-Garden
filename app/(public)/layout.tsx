import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { CartDrawer } from '@/components/layout/CartDrawer'
import { Toaster } from '@/components/ui/toaster'

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  let user = null
  try {
    const { auth } = await import('@/lib/auth')
    const session = await auth()
    user = session?.user as any
  } catch {}
  return (
    <>
      <Navbar user={user} />
      <main className="min-h-screen pt-16">{children}</main>
      <Footer />
      <CartDrawer />
      <Toaster />
    </>
  )
}
