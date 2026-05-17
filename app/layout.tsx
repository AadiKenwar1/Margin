import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Margin — Know What to Relist It For',
  description:
    'AI-powered resale pricing intelligence for clothing and sneakers. Cross-check resale markets and find your best relist price.',
  keywords: ['resale', 'sneakers', 'clothing', 'pricing', 'StockX', 'Grailed', 'eBay', 'Depop'],
  openGraph: {
    title: 'Margin',
    description: 'Know what to relist it for.',
    type: 'website',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#000000',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-black text-white min-h-screen">
        {children}
      </body>
    </html>
  )
}
