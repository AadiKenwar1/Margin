interface MarketplaceLogoProps {
  marketplaceKey: string
  size?: number
  className?: string
}

const FAVICON_DOMAINS: Record<string, string> = {
  grailed: 'grailed.com',
  stockx: 'stockx.com',
  ebay: 'ebay.com',
  depop: 'depop.com',
  mercari: 'mercari.com',
  facebook_marketplace: 'facebook.com',
}

export function MarketplaceLogo({ marketplaceKey, size = 24, className = '' }: MarketplaceLogoProps) {
  const domain = FAVICON_DOMAINS[marketplaceKey]
  if (!domain) return null

  return (
    <img
      src={`https://www.google.com/s2/favicons?domain=${domain}&sz=64`}
      alt={marketplaceKey}
      width={size}
      height={size}
      className={`rounded-md object-contain ${className}`}
      style={{ imageRendering: 'auto' }}
    />
  )
}
