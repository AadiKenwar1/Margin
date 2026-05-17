import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { CheckPackage } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatCurrencyDecimal(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

export const PACKAGES: CheckPackage[] = [
  {
    type: '20',
    checks: 20,
    price: 4.99,
    label: '20 Relist Checks',
    description: 'Great for casual resellers',
  },
  {
    type: '120',
    checks: 120,
    price: 14.99,
    label: '120 Relist Checks',
    badge: 'Best Value',
    description: 'Perfect for regular flippers',
  },
  {
    type: '1000',
    checks: 1000,
    price: 44.99,
    label: '1,000 Relist Checks',
    description: 'For power sellers & high-volume thrift',
  },
]

export const MARKETPLACES = [
  { key: 'grailed', label: 'Grailed', color: '#ff6b35', category: ['clothing'] },
  { key: 'stockx', label: 'StockX', color: '#00FF87', category: ['shoes', 'clothing'] },
  { key: 'ebay', label: 'eBay', color: '#e43137', category: ['shoes', 'clothing'] },
  { key: 'depop', label: 'Depop', color: '#ff2300', category: ['clothing', 'shoes'] },
  { key: 'mercari', label: 'Mercari', color: '#E94BAC', category: ['clothing', 'shoes'] },
  { key: 'facebook_marketplace', label: 'FB Marketplace', color: '#1877f2', category: ['clothing', 'shoes'] },
] as const

export const RATE_LIMIT_PER_MINUTE = 1
export const RATE_LIMIT_PER_DAY = 10
export const FREE_CHECKS = 3
