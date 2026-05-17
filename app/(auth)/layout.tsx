import Link from 'next/link'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-black flex flex-col">
      <header className="px-5 pt-6 pb-4">
        <Link href="/" className="inline-flex items-center gap-2">
          <div className="w-7 h-7 bg-white rounded-lg flex items-center justify-center">
            <span className="text-black font-black text-xs">M</span>
          </div>
          <span className="text-white font-bold text-lg tracking-tight">Margin</span>
        </Link>
      </header>
      <div className="flex-1 flex flex-col justify-center px-5 pb-10">
        {children}
      </div>
    </div>
  )
}
