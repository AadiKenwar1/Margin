import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { stripe, STRIPE_PACKAGES, type PackageKey } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { packageType } = body as { packageType: PackageKey }

    if (!packageType || !STRIPE_PACKAGES[packageType]) {
      return NextResponse.json({ error: 'Invalid package' }, { status: 400 })
    }

    const pkg = STRIPE_PACKAGES[packageType]
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || request.headers.get('origin') || 'http://localhost:3000'

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: user.email,
      metadata: {
        user_id: user.id,
        package_type: packageType,
        relist_checks: pkg.checks.toString(),
      },
      line_items: [
        {
          price_data: {
            currency: 'usd',
            unit_amount: pkg.price,
            product_data: {
              name: `Margin — ${pkg.label}`,
              description: `${pkg.checks} Relist Checks for Margin resale pricing intelligence`,
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/profile?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/profile?payment=cancelled`,
    })

    return NextResponse.json({ url: session.url }, { status: 200 })
  } catch (error) {
    console.error('Stripe checkout error:', error)
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}
