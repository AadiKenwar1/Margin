import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getScanById } from '@/lib/db'
import { ResultsView } from '@/components/check/ResultsView'

interface ResultsPageProps {
  params: Promise<{ id: string }>
}

export default async function ResultsPage({ params }: ResultsPageProps) {
  const { id } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) notFound()

  const scan = await getScanById(id, user.id)
  if (!scan) notFound()

  return <ResultsView scan={scan} />
}
