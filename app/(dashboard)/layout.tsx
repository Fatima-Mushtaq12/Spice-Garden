import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { Toaster } from '@/components/ui/toaster'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session?.user) redirect('/login')
  const role = (session.user as any).role
  if (!['STAFF', 'ADMIN'].includes(role)) redirect('/')
  return (
    <>
      {children}
      <Toaster />
    </>
  )
}
