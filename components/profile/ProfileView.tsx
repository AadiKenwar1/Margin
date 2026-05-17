'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { PACKAGES } from '@/lib/utils'
import type { Profile } from '@/types'
import { cn } from '@/lib/utils'

interface ProfileViewProps {
  profile: Profile
}

export function ProfileView({ profile }: ProfileViewProps) {
  const router = useRouter()
  const [loadingPackage, setLoadingPackage] = useState<string | null>(null)
  const [logoutLoading, setLogoutLoading] = useState(false)

  async function handlePurchase(packageType: string) {
    setLoadingPackage(packageType)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packageType }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingPackage(null)
    }
  }

  async function handleLogout() {
    setLogoutLoading(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const checksColor =
    profile.relist_checks === 0
      ? 'text-red-400'
      : profile.relist_checks <= 3
      ? 'text-amber-400'
      : 'text-emerald-400'

  return (
    <div className="min-h-screen bg-black pb-8 page-enter">
      {/* Header */}
      <div className="px-5 pt-6 pb-6">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-6 h-6 bg-white rounded-md flex items-center justify-center">
            <span className="text-black font-black text-xs">M</span>
          </div>
          <span className="text-white font-bold tracking-tight">Margin</span>
        </div>
        <h1 className="text-2xl font-black text-white">Profile</h1>
      </div>

      {/* Account info */}
      <div className="px-5 mb-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-4 pb-4 border-b border-zinc-800">
            <div className="w-10 h-10 bg-zinc-700 rounded-full flex items-center justify-center text-lg flex-shrink-0">
              {profile.email[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium text-sm truncate">{profile.email}</p>
              <p className="text-zinc-500 text-xs">Reseller Account</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-zinc-800/50 rounded-xl p-3">
              <p className="text-zinc-500 text-xs mb-1">Remaining</p>
              <p className={cn('font-black text-2xl', checksColor)}>
                {profile.relist_checks}
              </p>
              <p className="text-zinc-600 text-xs">Relist Checks</p>
            </div>
            <div className="bg-zinc-800/50 rounded-xl p-3">
              <p className="text-zinc-500 text-xs mb-1">Total Used</p>
              <p className="text-white font-black text-2xl">
                {profile.total_relist_checks_used}
              </p>
              <p className="text-zinc-600 text-xs">All time</p>
            </div>
          </div>
        </div>
      </div>

      {/* Low checks warning */}
      {profile.relist_checks === 0 && (
        <div className="px-5 mb-4">
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
            <p className="text-red-400 text-sm font-medium">No Relist Checks remaining</p>
            <p className="text-red-400/70 text-xs mt-0.5">Purchase a package below to continue.</p>
          </div>
        </div>
      )}

      {/* Purchase packages */}
      <div className="px-5 mb-8">
        <h2 className="text-white font-bold text-base mb-3">Get More Relist Checks</h2>
        <div className="space-y-3">
          {PACKAGES.map((pkg) => (
            <div
              key={pkg.type}
              className={cn(
                'bg-zinc-900 border rounded-2xl p-5 relative overflow-hidden',
                pkg.badge ? 'border-zinc-600' : 'border-zinc-800'
              )}
            >
              {pkg.badge && (
                <div className="absolute top-3.5 right-4">
                  <span className="bg-white text-black text-xs font-black px-2 py-0.5 rounded-full">
                    {pkg.badge}
                  </span>
                </div>
              )}
              <div className="mb-3">
                <p className="text-white font-bold text-base">{pkg.label}</p>
                {pkg.description && (
                  <p className="text-zinc-500 text-xs mt-0.5">{pkg.description}</p>
                )}
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-white font-black text-2xl">${pkg.price}</span>
                  <span className="text-zinc-500 text-xs ml-2">
                    ~${(pkg.price / pkg.checks).toFixed(3)}/check
                  </span>
                </div>
                <Button
                  size="sm"
                  onClick={() => handlePurchase(pkg.type)}
                  loading={loadingPackage === pkg.type}
                  disabled={!!loadingPackage}
                >
                  Buy Now
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sign out */}
      <div className="px-5">
        <Button
          variant="ghost"
          fullWidth
          onClick={handleLogout}
          loading={logoutLoading}
          className="border border-zinc-800"
        >
          Sign Out
        </Button>
      </div>
    </div>
  )
}
