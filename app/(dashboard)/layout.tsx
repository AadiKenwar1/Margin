import { BottomNav } from '@/components/navigation/BottomNav'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <div className="flex-1 pb-20">
        {children}
      </div>
      <BottomNav />
    </div>
  )
}
