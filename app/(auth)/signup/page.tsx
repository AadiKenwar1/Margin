'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { PasswordInput } from '@/components/ui/PasswordInput'

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      setLoading(false)
      return
    }

    const supabase = createClient()
    const { error: signUpError } = await supabase.auth.signUp({ email, password })

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })

    if (signInError) {
      setError(signInError.message)
      setLoading(false)
      return
    }

    router.push('/check')
    router.refresh()
  }

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-white mb-2">Start for free</h1>
        <p className="text-zinc-500 text-sm">
          Get 3 free Relist Checks — no credit card needed
        </p>
      </div>

      <form onSubmit={handleSignup} className="space-y-4">
        <Input
          id="email"
          type="email"
          label="Email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          autoFocus
        />
        <PasswordInput
          id="password"
          label="Password"
          placeholder="8+ characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
          autoComplete="new-password"
        />

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        <Button type="submit" fullWidth size="lg" loading={loading} className="mt-2">
          Create Account — Free
        </Button>
      </form>

      <div className="mt-5 flex items-center gap-3">
        <div className="flex-1 h-px bg-zinc-800" />
        <span className="text-zinc-600 text-xs">Includes</span>
        <div className="flex-1 h-px bg-zinc-800" />
      </div>
      <div className="mt-4 flex items-center justify-center gap-4">
        <div className="flex items-center gap-1.5">
          <span className="text-emerald-400 text-xs">✓</span>
          <span className="text-zinc-500 text-xs">3 free Relist Checks</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-emerald-400 text-xs">✓</span>
          <span className="text-zinc-500 text-xs">All 6 marketplaces</span>
        </div>
      </div>

      <p className="text-center text-zinc-500 text-sm mt-6">
        Already have an account?{' '}
        <Link href="/login" className="text-white font-medium hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  )
}
