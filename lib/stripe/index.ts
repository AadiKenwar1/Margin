import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export const STRIPE_PACKAGES = {
  '20': {
    checks: 20,
    price: 499, // cents
    label: '20 Relist Checks',
  },
  '120': {
    checks: 120,
    price: 1499,
    label: '120 Relist Checks',
  },
  '1000': {
    checks: 1000,
    price: 4499,
    label: '1,000 Relist Checks',
  },
} as const

export type PackageKey = keyof typeof STRIPE_PACKAGES
