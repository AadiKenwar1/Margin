'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push('/check')
    router.refresh()
  }

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-white mb-2">Welcome back</h1>
        <p className="text-zinc-500 text-sm">Sign in to your Margin account</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
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
        <Input
          id="password"
          type="password"
          label="Password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        <Button type="submit" fullWidth size="lg" loading={loading} className="mt-2">
          Sign In
        </Button>
      </form>

      <p className="text-center text-zinc-500 text-sm mt-6">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="text-white font-medium hover:underline">
          Sign up free
        </Link>
      </p>
    </div>
  )
}
