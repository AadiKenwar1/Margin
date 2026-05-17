'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const navItems = [
  {
    href: '/check',
    label: 'Check',
    icon: (active: boolean) => (
      <svg
        className={cn('w-5 h-5 transition-all', active ? 'text-white' : 'text-zinc-500')}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={active ? 2.5 : 2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
        />
      </svg>
    ),
  },
  {
    href: '/profile',
    label: 'Profile',
    icon: (active: boolean) => (
      <svg
        className={cn('w-5 h-5 transition-all', active ? 'text-white' : 'text-zinc-500')}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={active ? 2.5 : 2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM12 14a7 7 0 0 0-7 7h14a7 7 0 0 0-7-7z"
        />
      </svg>
    ),
  },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-xl border-t border-zinc-900 z-50">
      <div className="flex items-center justify-around pb-safe px-6 pt-2 max-w-lg mx-auto">
        {navItems.map((item) => {
          const active = pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center gap-1 py-2 px-6 rounded-xl transition-all duration-200',
                active ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
              )}
            >
              {item.icon(active)}
              <span className={cn('text-xs font-medium', active ? 'text-white' : 'text-zinc-500')}>
                {item.label}
              </span>
              {active && (
                <div className="w-1 h-1 bg-white rounded-full" />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
