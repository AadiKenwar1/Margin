import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { MarketplaceLogo } from '@/components/ui/MarketplaceLogo'

export default async function LandingPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect('/check')
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-5 pt-6 pb-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-white rounded-lg flex items-center justify-center">
            <span className="text-black font-black text-xs">M</span>
          </div>
          <span className="text-white font-bold text-lg tracking-tight">Margin</span>
        </div>
        <Link href="/login">
          <Button variant="secondary" size="sm">
            Sign In
          </Button>
        </Link>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col px-5 pt-10 pb-8">
        {/* Main headline */}
        <h1 className="text-4xl sm:text-5xl font-black text-white leading-[1.1] tracking-tight mb-4">
          Know what to
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 to-zinc-400">
            relist it for.
          </span>
        </h1>

        <p className="text-zinc-400 text-base leading-relaxed mb-8 max-w-sm">
          Upload a photo of your clothing or sneakers and instantly see what it&apos;s selling for
          across Grailed, StockX, eBay, Depop, Mercari, and Facebook Marketplace.
        </p>

        {/* CTA */}
        <Link href="/signup" className="mb-4">
          <Button size="lg" fullWidth className="text-base font-bold py-4">
            Start Free Relist Check
          </Button>
        </Link>
        <p className="text-center text-zinc-600 text-xs mb-10">
          3 free Relist Checks — no credit card required
        </p>

        {/* Feature pills */}
        <div className="flex flex-wrap gap-2 mb-12">
          {[
            'Cross-check resale prices',
            'Find the best marketplace',
            'Know your margins',
            'Built for resellers',
          ].map((feat) => (
            <span
              key={feat}
              className="bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs px-3 py-1.5 rounded-full"
            >
              {feat}
            </span>
          ))}
        </div>

        {/* Marketplace grid */}
        <div className="mb-12">
          <p className="text-zinc-600 text-xs font-medium uppercase tracking-widest mb-4">
            Cross-checks platforms
          </p>
          <div className="grid grid-cols-3 gap-2">
            {[
              { key: 'stockx', name: 'StockX' },
              { key: 'grailed', name: 'Grailed' },
              { key: 'ebay', name: 'eBay' },
              { key: 'depop', name: 'Depop' },
              { key: 'mercari', name: 'Mercari' },
              { key: 'facebook_marketplace', name: 'FB Mkt' },
            ].map((m) => (
              <div
                key={m.key}
                className="flex flex-col items-center justify-center gap-1.5 py-3 rounded-xl border border-zinc-800 bg-zinc-950"
              >
                <MarketplaceLogo marketplaceKey={m.key} size={24} />
                <span className="text-zinc-500 text-xs font-medium">{m.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Social proof */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 mb-8">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-zinc-700 rounded-full flex items-center justify-center text-sm flex-shrink-0">
              👟
            </div>
            <div>
              <p className="text-zinc-200 text-sm leading-relaxed">
                &ldquo;Finally know what to price my flips. Margin saved me from underselling my
                Air Max 1s by $40.&rdquo;
              </p>
              <p className="text-zinc-600 text-xs mt-1.5">Sneaker Reseller · Chicago</p>
            </div>
          </div>
        </div>

        {/* How it works */}
        <div className="mb-10">
          <p className="text-zinc-600 text-xs font-medium uppercase tracking-widest mb-5">
            How it works
          </p>
          <div className="space-y-4">
            {[
              {
                step: '01',
                title: 'Choose Category',
                desc: 'Select Clothing or Shoes',
              },
              {
                step: '02',
                title: 'Upload Photos',
                desc: 'Add up to 3 images',
              },
              {
                step: '03',
                title: 'Get Pricing Intelligence',
                desc: 'AI cross-checks 6 resale markets',
              },
              {
                step: '04',
                title: 'Know Your Margin',
                desc: 'See recommended relist price and best platform',
              },
            ].map((item) => (
              <div key={item.step} className="flex items-start gap-4">
                <span className="text-zinc-700 text-xs font-mono font-bold w-6 flex-shrink-0 pt-0.5">
                  {item.step}
                </span>
                <div>
                  <p className="text-zinc-200 text-sm font-medium">{item.title}</p>
                  <p className="text-zinc-500 text-xs mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <Link href="/signup">
          <Button size="lg" fullWidth className="text-base font-bold py-4">
            Start Free — 3 Checks Included
          </Button>
        </Link>
      </main>

      {/* Footer */}
      <footer className="px-5 py-6 border-t border-zinc-900">
        <p className="text-center text-zinc-700 text-xs">
          © 2025 Margin. Built for fashion resellers and sneaker flippers.
        </p>
      </footer>
    </div>
  )
}
