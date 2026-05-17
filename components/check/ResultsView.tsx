'use client'

import Link from 'next/link'
import { formatCurrency } from '@/lib/utils'
import { VerdictBadge, ConfidenceBadge } from '@/components/ui/Badge'
import { MarketplaceCard } from '@/components/check/MarketplaceCard'
import { Button } from '@/components/ui/Button'
import type { Scan } from '@/types'
import { MARKETPLACES } from '@/lib/utils'

interface ResultsViewProps {
  scan: Scan
}

export function ResultsView({ scan }: ResultsViewProps) {
  const result = scan.result_json
  if (!result) return null

  const categoryLabel = scan.category === 'clothing' ? 'Clothing' : 'Shoes'
  const categoryIcon = scan.category === 'clothing' ? '👕' : '👟'

  return (
    <div className="min-h-screen bg-black pb-8 page-enter">
      {/* Header */}
      <div className="px-5 pt-6 pb-4">
        <div className="flex items-center justify-between mb-4">
          <Link href="/check">
            <button className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              New Check
            </button>
          </Link>
          <span className="text-zinc-600 text-xs">
            {categoryIcon} {categoryLabel}
          </span>
        </div>
      </div>

      {/* Item info */}
      <div className="px-5 mb-6">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1">
            <h1 className="text-xl font-black text-white leading-tight">
              {result.item_name}
            </h1>
            {result.detected_brand && (
              <p className="text-zinc-400 text-sm mt-0.5">{result.detected_brand}</p>
            )}
            {result.detected_model && (
              <p className="text-zinc-500 text-xs mt-0.5">{result.detected_model}</p>
            )}
          </div>
          <VerdictBadge verdict={result.verdict} />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <ConfidenceBadge confidence={result.confidence} />
          <span className="text-zinc-700 text-xs border border-zinc-800 rounded-full px-2.5 py-0.5">
            {result.condition_estimate}
          </span>
          <span className="text-zinc-700 text-xs border border-zinc-800 rounded-full px-2.5 py-0.5">
            ~{result.estimated_sell_time}
          </span>
        </div>
      </div>

      {/* Pricing hero */}
      <div className="px-5 mb-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
          <p className="text-zinc-500 text-xs font-medium uppercase tracking-widest mb-4">
            Recommended Relist Price
          </p>
          <div className="text-4xl font-black text-white mb-4">
            {formatCurrency(result.recommended_relist_price)}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-zinc-800/50 rounded-xl p-3">
              <p className="text-zinc-500 text-xs mb-1">Quick Sale</p>
              <p className="text-emerald-400 font-bold text-lg">
                {formatCurrency(result.quick_sale_price)}
              </p>
            </div>
            <div className="bg-zinc-800/50 rounded-xl p-3">
              <p className="text-zinc-500 text-xs mb-1">Max Profit</p>
              <p className="text-amber-400 font-bold text-lg">
                {formatCurrency(result.max_profit_price)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Best platform */}
      <div className="px-5 mb-6">
        <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-zinc-500 text-xs font-medium uppercase tracking-widest mb-1">
                Best Platform to List
              </p>
              <p className="text-white font-black text-xl capitalize">{result.best_platform}</p>
            </div>
            <div className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-zinc-800">
            <p className="text-zinc-500 text-xs">
              Overall estimated value:{' '}
              <span className="text-zinc-300 font-medium">
                {formatCurrency(result.overall_estimated_value)}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Marketplace comparison */}
      <div className="px-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-white font-bold text-base">Platform Breakdown</h2>
          <span className="text-zinc-600 text-xs">AI-estimated</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {MARKETPLACES.map((marketplace) => {
            const key = marketplace.key as keyof typeof result.marketplace_estimates
            const estimate = result.marketplace_estimates[key]
            if (!estimate) return null
            return (
              <MarketplaceCard
                key={marketplace.key}
                marketplace={marketplace}
                estimate={estimate}
                isBest={result.best_platform.toLowerCase() === marketplace.label.toLowerCase() ||
                  result.best_platform.toLowerCase().includes(marketplace.key.toLowerCase())}
              />
            )
          })}
        </div>
        <p className="text-zinc-700 text-xs mt-3 text-center">
          AI-estimated marketplace averages · May differ from live resale markets
        </p>
      </div>

      {/* Reasoning */}
      {result.reasoning && result.reasoning.length > 0 && (
        <div className="px-5 mb-6">
          <h2 className="text-white font-bold text-base mb-3">Analysis Notes</h2>
          <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-4 space-y-2.5">
            {result.reasoning.map((point, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <span className="text-zinc-600 mt-0.5 flex-shrink-0">•</span>
                <p className="text-zinc-400 text-sm leading-relaxed">{point}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="px-5 mb-6">
        <p className="text-zinc-700 text-xs text-center leading-relaxed">
          Prices are AI-estimated marketplace averages and may differ from live resale markets.
          Always verify current prices before listing.
        </p>
      </div>

      {/* New check CTA */}
      <div className="px-5">
        <Link href="/check">
          <Button fullWidth size="lg">
            Run Another Relist Check
          </Button>
        </Link>
      </div>
    </div>
  )
}
