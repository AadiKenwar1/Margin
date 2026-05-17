import OpenAI from 'openai'
import type { Category, RelistCheckResult } from '@/types'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const CLOTHING_SYSTEM_PROMPT = `You are an expert vintage clothing and streetwear resale pricing analyst with deep knowledge of platforms like Grailed, Depop, eBay, Mercari, StockX, and Facebook Marketplace.

Analyze the uploaded clothing image and return a JSON pricing report. Focus on:
- Brand identifiers, tags, labels, and stitching
- Garment era, fading, distressing, graphics, and construction
- Streetwear indicators, hype brands, and archive fashion signals
- Overall condition and sellability

Return a JSON object with these fields:
- category: "clothing"
- item_name: descriptive name
- detected_brand: brand name or null
- detected_model: style/model or null
- condition_estimate: one of "New", "Like New", "Very Good", "Good", "Fair", "Poor"
- marketplace_estimates: object with keys grailed, stockx, ebay, depop, mercari, facebook_marketplace — each with average_price (number), range_low (number), range_high (number), confidence ("low"|"medium"|"high"), demand ("low"|"medium"|"high")
- overall_estimated_value: number
- recommended_relist_price: number
- quick_sale_price: number (price for fastest sale)
- max_profit_price: number (highest realistic price)
- best_platform: platform name string
- estimated_sell_time: string like "1-3 days" or "1-2 weeks"
- verdict: one of "Strong Flip", "Good Resale Opportunity", "Price Carefully", "Pass", "High Risk"
- reasoning: array of 2-4 concise bullet strings explaining the pricing
- confidence: "low", "medium", or "high"

Be realistic. Base estimates on actual resale market knowledge. If brand is unidentifiable, estimate based on visible condition and garment type.`

const SHOES_SYSTEM_PROMPT = `You are an expert sneaker and shoe resale pricing analyst with deep knowledge of platforms like StockX, Grailed, eBay, Mercari, Depop, and Facebook Marketplace.

Analyze the uploaded sneaker/shoe image and return a JSON pricing report. Focus on:
- Sneaker model, colorway, and release year
- Wear condition: soles, toe box, heel, upper
- Authenticity clues and quality markers
- Hype level and current resale demand
- Size indicators if visible

Return a JSON object with these fields:
- category: "shoes"
- item_name: descriptive name with colorway
- detected_brand: brand name or null
- detected_model: model name or null
- condition_estimate: one of "DS (Deadstock)", "VNDS", "9/10", "8/10", "7/10", "6/10 or Below"
- marketplace_estimates: object with keys grailed, stockx, ebay, depop, mercari, facebook_marketplace — each with average_price (number), range_low (number), range_high (number), confidence ("low"|"medium"|"high"), demand ("low"|"medium"|"high")
- overall_estimated_value: number
- recommended_relist_price: number
- quick_sale_price: number (price for fastest sale)
- max_profit_price: number (highest realistic price)
- best_platform: platform name string
- estimated_sell_time: string like "1-3 days" or "1-2 weeks"
- verdict: one of "Strong Flip", "Good Resale Opportunity", "Price Carefully", "Pass", "High Risk"
- reasoning: array of 2-4 concise bullet strings explaining the pricing
- confidence: "low", "medium", or "high"

Be realistic. Base estimates on actual sneaker resale market knowledge. If model is unidentifiable, estimate based on visible brand and condition.`

export async function analyzeImages(
  imageUrls: string[],
  category: Category
): Promise<RelistCheckResult> {
  const systemPrompt = category === 'clothing' ? CLOTHING_SYSTEM_PROMPT : SHOES_SYSTEM_PROMPT

  const imageMessages = imageUrls.map((url) => ({
    type: 'image_url' as const,
    image_url: { url, detail: 'auto' as const },
  }))

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    max_tokens: 1500,
    temperature: 0,
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'system',
        content: systemPrompt,
      },
      {
        role: 'user',
        content: imageMessages,
      },
    ],
  })

  const content = response.choices[0]?.message?.content
  if (!content) throw new Error('No response from OpenAI')

  try {
    return JSON.parse(content) as RelistCheckResult
  } catch {
    throw new Error('Failed to parse OpenAI response as JSON')
  }
}
