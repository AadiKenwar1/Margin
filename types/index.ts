export type Category = 'clothing' | 'shoes'

export type Confidence = 'low' | 'medium' | 'high'
export type Demand = 'low' | 'medium' | 'high'
export type Verdict =
  | 'Strong Flip'
  | 'Good Resale Opportunity'
  | 'Price Carefully'
  | 'Pass'
  | 'High Risk'

export interface MarketplaceEstimate {
  average_price: number
  range_low: number
  range_high: number
  confidence: Confidence
  demand: Demand
}

export interface RelistCheckResult {
  category: Category
  item_name: string
  detected_brand: string | null
  detected_model: string | null
  condition_estimate: string
  marketplace_estimates: {
    grailed: MarketplaceEstimate
    stockx: MarketplaceEstimate
    ebay: MarketplaceEstimate
    depop: MarketplaceEstimate
    mercari: MarketplaceEstimate
    facebook_marketplace: MarketplaceEstimate
  }
  overall_estimated_value: number
  recommended_relist_price: number
  quick_sale_price: number
  max_profit_price: number
  best_platform: string
  estimated_sell_time: string
  verdict: Verdict
  reasoning: string[]
  confidence: Confidence
}

export interface Profile {
  id: string
  email: string
  relist_checks: number
  total_relist_checks_used: number
  created_at: string
  updated_at: string
}

export interface Scan {
  id: string
  user_id: string
  category: Category
  item_name: string
  detected_brand: string | null
  detected_model: string | null
  image_urls: string[]
  result_json: RelistCheckResult
  recommended_relist_price: number
  quick_sale_price: number
  max_profit_price: number
  best_platform: string
  confidence: Confidence
  created_at: string
}

export interface Payment {
  id: string
  user_id: string
  stripe_session_id: string
  package_type: string
  relist_checks_added: number
  amount_paid: number
  payment_status: string
  created_at: string
}

export type PackageType = '20' | '120' | '1000'

export interface CheckPackage {
  type: PackageType
  checks: number
  price: number
  label: string
  badge?: string
  description?: string
}
