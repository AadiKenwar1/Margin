'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CategorySelect } from '@/components/check/CategorySelect'
import { ImageUpload } from '@/components/check/ImageUpload'
import { AnalyzingLoader } from '@/components/check/AnalyzingLoader'
import type { Category } from '@/types'
import imageCompression from 'browser-image-compression'

type Step = 'category' | 'upload' | 'analyzing'

async function fileToBase64(file: File): Promise<string> {
  const buffer = await file.arrayBuffer()
  const bytes = new Uint8Array(buffer)
  let binary = ''
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  const base64 = btoa(binary)
  return `data:image/jpeg;base64,${base64}`
}

export default function CheckPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('category')
  const [category, setCategory] = useState<Category>('clothing')
  const [images, setImages] = useState<File[]>([])
  const [error, setError] = useState('')

  function handleCategorySelect(cat: Category) {
    setCategory(cat)
    setStep('upload')
  }

  async function handleAnalyze() {
    if (images.length === 0) {
      setError('Please add at least one photo')
      return
    }

    setError('')
    setStep('analyzing')

    try {
      // Compress images client-side before sending
      const compressionOptions = {
        maxSizeMB: 0.8,
        maxWidthOrHeight: 1024,
        useWebWorker: true,
        fileType: 'image/jpeg' as const,
        initialQuality: 0.72,
      }

      const base64Images: string[] = []
      for (const img of images) {
        const compressed = await imageCompression(img, compressionOptions)
        const base64 = await fileToBase64(compressed)
        base64Images.push(base64)
      }

      // Send base64 images directly to relist-check — no storage needed
      const checkRes = await fetch('/api/relist-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrls: base64Images,
          category,
        }),
      })

      const checkData = await checkRes.json()

      if (!checkRes.ok) {
        if (checkRes.status === 402) {
          router.push('/profile?reason=no-checks')
          return
        }
        throw new Error(checkData.error || 'Analysis failed')
      }

      router.push(`/results/${checkData.scan.id}`)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong'
      setError(message)
      setStep('upload')
    }
  }

  if (step === 'analyzing') {
    return <AnalyzingLoader category={category} />
  }

  if (step === 'category') {
    return <CategorySelect onSelect={handleCategorySelect} />
  }

  return (
    <ImageUpload
      category={category}
      images={images}
      onImagesChange={setImages}
      onAnalyze={handleAnalyze}
      onBack={() => setStep('category')}
      error={error}
    />
  )
}
