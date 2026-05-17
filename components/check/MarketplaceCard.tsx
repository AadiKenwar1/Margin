'use client'

import { formatCurrency } from '@/lib/utils'
import { DemandBadge } from '@/components/ui/Badge'
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

const confidenceWidth = {
  low: 'w-1/3',
  medium: 'w-2/3',
  high: 'w-full',
}

export function MarketplaceCard({ marketplace, estimate, isBest }: MarketplaceCardProps) {
  return (
    <div
      className={cn(
        'bg-zinc-900 border rounded-2xl p-4 transition-all',
        isBest ? 'border-zinc-600' : 'border-zinc-800'
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <MarketplaceLogo marketplaceKey={marketplace.key} size={22} className="flex-shrink-0" />
          <div className="flex items-center gap-2">
            <span className="text-white font-semibold text-sm">{marketplace.label}</span>
            {isBest && (
              <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                Best
              </span>
            )}
          </div>
        </div>
        <DemandBadge demand={estimate.demand} />
      </div>

      <div className="flex items-end justify-between mb-3">
        <div>
          <p className="text-zinc-500 text-xs mb-0.5">Avg price</p>
          <p className="text-white font-bold text-lg">{formatCurrency(estimate.average_price)}</p>
        </div>
        <div className="text-right">
          <p className="text-zinc-500 text-xs mb-0.5">Range</p>
          <p className="text-zinc-400 text-sm">
            {formatCurrency(estimate.range_low)} – {formatCurrency(estimate.range_high)}
          </p>
        </div>
      </div>

      {/* Confidence bar */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-zinc-600 text-xs">Confidence</span>
          <span className="text-zinc-500 text-xs capitalize">{estimate.confidence}</span>
        </div>
        <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className={cn(
              'h-full rounded-full transition-all',
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
    </div>
  )
}
