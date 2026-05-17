import { createAdminClient } from '@/lib/supabase/admin'
import type { Profile, Scan, RelistCheckResult, Category } from '@/types'

export async function getProfile(userId: string): Promise<Profile | null> {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) return null
  return data as Profile
}

export async function deductRelistCheck(userId: string): Promise<boolean> {
  const supabase = createAdminClient()

  const { data, error } = await supabase.rpc('deduct_relist_check', {
    p_user_id: userId,
  })

  if (error || !data) return false
  return true
}

export async function refundRelistCheck(userId: string): Promise<void> {
  const supabase = createAdminClient()
  await supabase.rpc('refund_relist_check', { p_user_id: userId })
}

export async function addRelistChecks(userId: string, amount: number): Promise<void> {
  const supabase = createAdminClient()
  await supabase.rpc('add_relist_checks', {
    p_user_id: userId,
    p_amount: amount,
  })
}

export async function saveScan(params: {
  userId: string
  category: Category
  imageUrls: string[]
  result: RelistCheckResult
}): Promise<Scan | null> {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('scans')
    .insert({
      user_id: params.userId,
      category: params.category,
      item_name: params.result.item_name,
      detected_brand: params.result.detected_brand,
      detected_model: params.result.detected_model,
      image_urls: params.imageUrls,
      result_json: params.result,
      recommended_relist_price: params.result.recommended_relist_price,
      quick_sale_price: params.result.quick_sale_price,
      max_profit_price: params.result.max_profit_price,
      best_platform: params.result.best_platform,
      confidence: params.result.confidence,
    })
    .select()
    .single()

  if (error) return null
  return data as Scan
}

export async function getUserScans(userId: string): Promise<Scan[]> {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('scans')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) return []
  return data as Scan[]
}

export async function getScanById(scanId: string, userId: string): Promise<Scan | null> {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('scans')
    .select('*')
    .eq('id', scanId)
    .eq('user_id', userId)
    .single()

  if (error) return null
  return data as Scan
}

export async function recordPayment(params: {
  userId: string
  stripeSessionId: string
  packageType: string
  relistChecksAdded: number
  amountPaid: number
  paymentStatus: string
}): Promise<void> {
  const supabase = createAdminClient()
  await supabase.from('payments').insert({
    user_id: params.userId,
    stripe_session_id: params.stripeSessionId,
    package_type: params.packageType,
    relist_checks_added: params.relistChecksAdded,
    amount_paid: params.amountPaid,
    payment_status: params.paymentStatus,
  })
}

export async function getPaymentBySessionId(sessionId: string) {
  const supabase = createAdminClient()
  const { data } = await supabase
    .from('payments')
    .select('*')
    .eq('stripe_session_id', sessionId)
    .single()
  return data
}
