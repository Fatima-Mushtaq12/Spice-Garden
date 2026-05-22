import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { Toaster } from '@/components/ui/toaster'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session?.user) redirect('/login')
  if ((session.user as any).role !== 'ADMIN') redirect('/')
  return (
    <>
      {children}
      <Toaster />
    </>
  )
}
