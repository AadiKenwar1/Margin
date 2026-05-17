import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { analyzeImages } from '@/lib/openai/analyze'
import { deductRelistCheck, refundRelistCheck, saveScan, getProfile } from '@/lib/db'
import type { Category } from '@/types'

export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate user
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2. Parse request body
    const body = await request.json()
    const { imageUrls, category } = body as { imageUrls: string[]; category: Category }

    if (!imageUrls || !Array.isArray(imageUrls) || imageUrls.length === 0) {
      return NextResponse.json({ error: 'No images provided' }, { status: 400 })
    }

    if (imageUrls.length > 1) {
      return NextResponse.json({ error: 'Maximum 1 image allowed' }, { status: 400 })
    }

    // Validate all entries are base64 data URLs or https URLs
    const isValidImage = (s: string) =>
      s.startsWith('data:image/') || s.startsWith('https://')
    if (!imageUrls.every(isValidImage)) {
      return NextResponse.json({ error: 'Invalid image format' }, { status: 400 })
    }

    if (!category || !['clothing', 'shoes'].includes(category)) {
      return NextResponse.json({ error: 'Invalid category' }, { status: 400 })
    }

    // 3. Check relist check balance
    const profile = await getProfile(user.id)
    if (!profile || profile.relist_checks < 1) {
      return NextResponse.json(
        { error: 'No Relist Checks remaining. Purchase more to continue.' },
        { status: 402 }
      )
    }

    // 5. Deduct relist check (server-side, atomic)
    const deducted = await deductRelistCheck(user.id)
    if (!deducted) {
      return NextResponse.json(
        { error: 'Failed to deduct Relist Check. Please try again.' },
        { status: 402 }
      )
    }

    // 6. Run OpenAI analysis
    let result
    try {
      result = await analyzeImages(imageUrls, category)
    } catch (aiError) {
      // Refund on AI failure
      await refundRelistCheck(user.id)
      console.error('OpenAI error:', aiError)
      return NextResponse.json(
        { error: 'Analysis failed. Your Relist Check has been refunded.' },
        { status: 500 }
      )
    }

    // 7. Save scan to database (don't persist base64 images — no storage needed)
    const scan = await saveScan({
      userId: user.id,
      category,
      imageUrls: [],
      result,
    })

    if (!scan) {
      // Don't refund here — analysis succeeded, just save failed
      return NextResponse.json({ error: 'Failed to save results' }, { status: 500 })
    }

    return NextResponse.json({ scan, result }, { status: 200 })
  } catch (error) {
    console.error('Relist check error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
