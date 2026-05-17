'use client'

import { useEffect, useState } from 'react'
import type { Category } from '@/types'

const CLOTHING_STEPS = [
  'Identifying garment...',
  'Detecting brand...',
  'Analyzing tags & labels...',
  'Estimating garment era...',
  'Checking Grailed pricing...',
  'Checking Depop pricing...',
  'Checking eBay market data...',
  'Cross-checking resale markets...',
  'Calculating best relist price...',
]

const SHOE_STEPS = [
  'Identifying sneaker...',
  'Detecting model & colorway...',
  'Estimating condition...',
  'Checking StockX pricing...',
  'Checking eBay sold data...',
  'Checking Grailed listings...',
  'Cross-checking resale markets...',
  'Calculating best relist price...',
]

interface AnalyzingLoaderProps {
  category: Category
}

export function AnalyzingLoader({ category }: AnalyzingLoaderProps) {
  const steps = category === 'clothing' ? CLOTHING_STEPS : SHOE_STEPS
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < steps.length - 1) {
          setCompletedSteps((c) => [...c, prev])
          return prev + 1
        }
        clearInterval(interval)
        return prev
      })
    }, 900)

    return () => clearInterval(interval)
  }, [steps.length])

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-5 page-enter">
      {/* Animated logo */}
      <div className="relative mb-10">
        <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center mb-1">
          <span className="text-black font-black text-2xl">M</span>
        </div>
        {/* Pulsing rings */}
        <div className="absolute inset-0 rounded-2xl border border-white/20 animate-ping" />
        <div className="absolute -inset-2 rounded-3xl border border-white/10 animate-pulse" />
      </div>

      <h2 className="text-white font-black text-xl mb-2">
        Running Relist Check
      </h2>
      <p className="text-zinc-500 text-sm mb-10 text-center">
        Cross-checking resale markets for{' '}
        <span className="text-zinc-300">{category === 'clothing' ? 'clothing' : 'sneakers'}</span>
      </p>

      {/* Steps list */}
      <div className="w-full max-w-xs space-y-2.5">
        {steps.map((step, i) => {
          const isDone = completedSteps.includes(i)
          const isCurrent = currentStep === i
          const isPending = i > currentStep

          return (
            <div
              key={step}
              className="flex items-center gap-3 transition-all duration-300"
              style={{
                opacity: isPending ? 0.25 : 1,
              }}
            >
              <div className="w-5 h-5 flex-shrink-0 flex items-center justify-center">
                {isDone ? (
                  <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : isCurrent ? (
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <div className="w-2 h-2 rounded-full bg-zinc-700" />
                )}
              </div>
              <span
                className={
                  isDone
                    ? 'text-zinc-500 text-sm line-through'
                    : isCurrent
                    ? 'text-white text-sm font-medium'
                    : 'text-zinc-600 text-sm'
                }
              >
                {step}
              </span>
            </div>
          )
        })}
      </div>

      <p className="text-zinc-700 text-xs mt-10 text-center">
        AI-estimated marketplace averages · Powered by GPT-4o
      </p>
    </div>
  )
}
