import { createAdminClient } from '@/lib/supabase/admin'

interface RateLimitResult {
  allowed: boolean
  reason?: string
}

export async function checkRateLimit(userId: string): Promise<RateLimitResult> {
  const supabase = createAdminClient()

  const now = new Date()
  const oneMinuteAgo = new Date(now.getTime() - 60 * 1000)
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)

  // Check per-minute limit
  const { count: minuteCount } = await supabase
    .from('scans')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .gte('created_at', oneMinuteAgo.toISOString())

  if ((minuteCount ?? 0) >= 1) {
    return { allowed: false, reason: 'Rate limit: 1 Relist Check per minute. Please wait.' }
  }

  // Check per-day limit
  const { count: dayCount } = await supabase
    .from('scans')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .gte('created_at', oneDayAgo.toISOString())

  if ((dayCount ?? 0) >= 10) {
    return { allowed: false, reason: 'Daily limit reached: 10 Relist Checks per day.' }
  }

  return { allowed: true }
}
