'use client'

import { Button } from '@/components/ui/Button'
import { MarketplaceLogo } from '@/components/ui/MarketplaceLogo'
import type { Category } from '@/types'

interface CategorySelectProps {
  onSelect: (category: Category) => void
}

export function CategorySelect({ onSelect }: CategorySelectProps) {
  return (
    <div className="min-h-screen bg-black flex flex-col px-5 pt-8 page-enter">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-6 h-6 bg-white rounded-md flex items-center justify-center">
            <span className="text-black font-black text-xs">M</span>
          </div>
          <span className="text-white font-bold tracking-tight">Margin</span>
        </div>
        <h1 className="text-2xl font-black text-white mb-2">Relist Check</h1>
        <p className="text-zinc-500 text-sm">
          What are you selling? This shapes your pricing intelligence.
        </p>
      </div>

      {/* Category cards */}
      <div className="space-y-3 mb-8">
        <button
          onClick={() => onSelect('clothing')}
          className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-5 text-left hover:border-zinc-600 hover:bg-zinc-800/50 active:scale-[0.98] transition-all duration-200"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center text-2xl">
                👕
              </div>
              <div>
                <h2 className="text-white font-bold text-base">Clothing</h2>
                <p className="text-zinc-500 text-xs mt-0.5">
                  Streetwear · Vintage · Designer · Archive
                </p>
              </div>
            </div>
            <svg
              className="text-zinc-600 w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {[
              { key: 'grailed', name: 'Grailed' },
              { key: 'depop', name: 'Depop' },
              { key: 'ebay', name: 'eBay' },
              { key: 'mercari', name: 'Mercari' },
              { key: 'facebook_marketplace', name: 'FB Marketplace' },
            ].map((m) => (
              <div key={m.key} className="flex items-center gap-1 bg-zinc-800 px-2 py-1 rounded-lg">
                <MarketplaceLogo marketplaceKey={m.key} size={14} />
                <span className="text-zinc-500 text-xs whitespace-nowrap">{m.name}</span>
              </div>
            ))}
          </div>
        </button>

        <button
          onClick={() => onSelect('shoes')}
          className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-5 text-left hover:border-zinc-600 hover:bg-zinc-800/50 active:scale-[0.98] transition-all duration-200"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center text-2xl">
                👟
              </div>
              <div>
                <h2 className="text-white font-bold text-base">Shoes</h2>
                <p className="text-zinc-500 text-xs mt-0.5">
                  Sneakers · Hype Releases · Classics
                </p>
              </div>
            </div>
            <svg
              className="text-zinc-600 w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {[
              { key: 'stockx', name: 'StockX' },
              { key: 'ebay', name: 'eBay' },
              { key: 'grailed', name: 'Grailed' },
              { key: 'mercari', name: 'Mercari' },
              { key: 'facebook_marketplace', name: 'FB Marketplace' },
            ].map((m) => (
              <div key={m.key} className="flex items-center gap-1 bg-zinc-800 px-2 py-1 rounded-lg">
                <MarketplaceLogo marketplaceKey={m.key} size={14} />
                <span className="text-zinc-500 text-xs whitespace-nowrap">{m.name}</span>
              </div>
            ))}
          </div>
        </button>
      </div>

      {/* Info */}
      <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-4">
        <p className="text-zinc-500 text-xs leading-relaxed">
          Your category determines which marketplaces and pricing signals are used. Shoe analysis
          focuses on StockX, eBay, and sneaker-specific demand. Clothing analysis focuses on
          Grailed, Depop, and vintage/streetwear signals.
        </p>
      </div>
    </div>
  )
}
