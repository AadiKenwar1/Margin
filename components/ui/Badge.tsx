import { cn } from '@/lib/utils'
import type { Verdict, Confidence, Demand } from '@/types'

interface BadgeProps {
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple'
}

export function Badge({ children, className, variant = 'default' }: BadgeProps) {
  const variants = {
    default: 'bg-zinc-800 text-zinc-300 border-zinc-700',
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    danger: 'bg-red-500/10 text-red-400 border-red-500/20',
    info: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  )
}

export function VerdictBadge({ verdict }: { verdict: Verdict }) {
  const config: Record<Verdict, { label: string; variant: BadgeProps['variant'] }> = {
    'Strong Flip': { label: '🔥 Strong Flip', variant: 'success' },
    'Good Resale Opportunity': { label: '✅ Good Resale', variant: 'success' },
    'Price Carefully': { label: '⚠️ Price Carefully', variant: 'warning' },
    Pass: { label: '🚫 Pass', variant: 'danger' },
    'High Risk': { label: '⚡ High Risk', variant: 'danger' },
  }

  const { label, variant } = config[verdict] || { label: verdict, variant: 'default' }

  return (
    <Badge variant={variant} className="text-sm px-3 py-1">
      {label}
    </Badge>
  )
}

export function ConfidenceBadge({ confidence }: { confidence: Confidence }) {
  const config: Record<Confidence, { label: string; variant: BadgeProps['variant'] }> = {
    high: { label: 'High Confidence', variant: 'success' },
    medium: { label: 'Medium Confidence', variant: 'warning' },
    low: { label: 'Low Confidence', variant: 'danger' },
  }

  const { label, variant } = config[confidence]
  return <Badge variant={variant}>{label}</Badge>
}

export function DemandBadge({ demand }: { demand: Demand }) {
  const config: Record<Demand, { label: string; variant: BadgeProps['variant'] }> = {
    high: { label: '🔥 High Demand', variant: 'success' },
    medium: { label: '📈 Medium Demand', variant: 'warning' },
    low: { label: '📉 Low Demand', variant: 'danger' },
  }

  const { label, variant } = config[demand]
  return <Badge variant={variant}>{label}</Badge>
}
