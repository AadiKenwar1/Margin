'use client'

import { useRef } from 'react'
import { Button } from '@/components/ui/Button'
import type { Category } from '@/types'

interface ImageUploadProps {
  category: Category
  images: File[]
  onImagesChange: (images: File[]) => void
  onAnalyze: () => void
  onBack: () => void
  error: string
}

export function ImageUpload({
  category,
  images,
  onImagesChange,
  onAnalyze,
  onBack,
  error,
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const categoryLabel = category === 'clothing' ? 'Clothing' : 'Shoes'
  const categoryIcon = category === 'clothing' ? '👕' : '👟'
  const image = images[0] ?? null
  const previewUrl = image ? URL.createObjectURL(image) : null

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      onImagesChange([file])
    }
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  function removeImage() {
    onImagesChange([])
  }

  const tips =
    category === 'clothing'
      ? [
          'Show brand tags and labels clearly',
          'Capture any visible graphics or patches',
          'Good lighting helps identify condition',
        ]
      : [
          'Show the shoe from the side',
          'Capture the sole and any visible wear',
          'Good lighting helps identify the model',
        ]

  return (
    <div className="min-h-screen bg-black flex flex-col px-5 pt-8 page-enter">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={onBack}
          className="w-8 h-8 bg-zinc-900 rounded-full flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <div className="flex items-center gap-2">
            <span>{categoryIcon}</span>
            <span className="text-zinc-400 text-sm">{categoryLabel}</span>
          </div>
          <h1 className="text-xl font-black text-white">Upload a Photo</h1>
        </div>
      </div>

      {/* Single image slot */}
      <div className="mb-6">
        {previewUrl ? (
          <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-700 group">
            <img
              src={previewUrl}
              alt="Upload preview"
              className="w-full h-full object-cover"
            />
            <button
              onClick={removeImage}
              className="absolute top-3 right-3 w-8 h-8 bg-black/70 backdrop-blur-sm rounded-full flex items-center justify-center text-white text-base hover:bg-black/90 transition-colors"
            >
              ×
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full hover:bg-black/90 transition-colors"
            >
              Change
            </button>
          </div>
        ) : (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full aspect-square bg-zinc-950 border-2 border-dashed border-zinc-800 rounded-2xl flex flex-col items-center justify-center gap-3 hover:border-zinc-600 hover:bg-zinc-900 transition-all active:scale-[0.99]"
          >
            <div className="w-14 h-14 bg-zinc-900 rounded-2xl flex items-center justify-center">
              <svg className="w-7 h-7 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-zinc-300 text-sm font-medium">Tap to add photo</p>
              <p className="text-zinc-600 text-xs mt-0.5">Camera or gallery</p>
            </div>
          </button>
        )}
      </div>

      {/* Tips */}
      <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-4 mb-6">
        <p className="text-zinc-500 text-xs font-medium mb-2">For best results:</p>
        <ul className="space-y-1.5">
          {tips.map((tip, i) => (
            <li key={i} className="flex items-start gap-2 text-zinc-600 text-xs">
              <span className="text-zinc-700 mt-0.5">•</span>
              {tip}
            </li>
          ))}
        </ul>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl mb-4">
          {error}
        </div>
      )}

      <Button
        onClick={onAnalyze}
        fullWidth
        size="lg"
        disabled={!image}
        className="mb-3"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
        Run Relist Check
      </Button>
      <p className="text-center text-zinc-600 text-xs">Uses 1 Relist Check</p>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  )
}
