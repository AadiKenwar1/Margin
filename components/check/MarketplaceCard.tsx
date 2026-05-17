'use client'

import { formatCurrency } from '@/lib/utils'
import { MarketplaceLogo } from '@/components/ui/MarketplaceLogo'
import type { MarketplaceEstimate } from '@/types'
import { cn } from '@/lib/utils'

interface MarketplaceCardProps {
  marketplace: {
    key: string
    label: string
    color: string
  }
  estimate: MarketplaceEstimate
  isBest?: boolean
}

const demandColors: Record<string, string> = {
  high: 'text-emerald-400',
  medium: 'text-amber-400',
  low: 'text-zinc-500',
}

const confidenceWidth: Record<string, string> = {
  low: 'w-1/3',
  medium: 'w-2/3',
  high: 'w-full',
}

export function MarketplaceCard({ marketplace, estimate, isBest }: MarketplaceCardProps) {
  return (
    <div
      className={cn(
        'bg-zinc-900 border rounded-2xl p-3 flex flex-col gap-2 transition-all',
        isBest ? 'border-zinc-600' : 'border-zinc-800'
      )}
    >
      {/* Top row: logo + demand */}
      <div className="flex items-center justify-between">
        <MarketplaceLogo marketplaceKey={marketplace.key} size={20} className="flex-shrink-0" />
        <span className={cn('text-xs font-medium capitalize', demandColors[estimate.demand] ?? 'text-zinc-500')}>
          {estimate.demand}
        </span>
      </div>

      {/* Platform name + best badge */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-white font-semibold text-xs leading-tight">{marketplace.label}</span>
        {isBest && (
          <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded-full leading-none">
            Best
          </span>
        )}
      </div>

      {/* Avg price */}
      <p className="text-white font-bold text-base leading-none">{formatCurrency(estimate.average_price)}</p>

      {/* Range */}
      <p className="text-zinc-500 text-[11px] leading-none">
        {formatCurrency(estimate.range_low)}–{formatCurrency(estimate.range_high)}
      </p>

      {/* Confidence bar */}
      <div className="h-0.5 bg-zinc-800 rounded-full overflow-hidden mt-auto">
        <div
          className={cn(
            'h-full rounded-full',
            confidenceWidth[estimate.confidence],
            estimate.confidence === 'high'
              ? 'bg-emerald-500'
              : estimate.confidence === 'medium'
              ? 'bg-amber-500'
              : 'bg-zinc-600'
          )}
        />
      </div>
    </div>
  )
}
