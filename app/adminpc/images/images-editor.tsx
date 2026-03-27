'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { getSlotLabel } from '@/lib/images'
import { uploadImage } from './actions'
import type { ImageSlots } from '@/lib/images'

type Slot = keyof ImageSlots
type PathsWithLogo = ImageSlots & { hasLogo?: boolean }

export function ImagesEditor({
  slots,
  paths,
}: {
  slots: readonly Slot[]
  paths: PathsWithLogo
}) {
  const [loading, setLoading] = useState<Slot | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({})
  const router = useRouter()

  const handleUpload = async (slot: Slot, e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setMessage(null)
    const input = fileRefs.current[slot]
    const file = input?.files?.[0]
    if (!file) {
      setMessage({ type: 'error', text: 'აირჩიე ფაილი' })
      return
    }

    setLoading(slot)
    const formData = new FormData()
    formData.append('file', file)

    const result = await uploadImage(slot, formData)
    setLoading(null)
    input.value = ''

    if (result.error) {
      setMessage({ type: 'error', text: result.error })
    } else {
      setMessage({ type: 'success', text: 'შენახულია' })
      router.refresh()
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {slots.map((slot) => (
          <div
            key={slot}
            className="rounded-lg border bg-card p-4"
          >
            <Label className="mb-3 block text-sm font-medium">
              {getSlotLabel(slot)}
            </Label>
            <div className="aspect-video mb-4 overflow-hidden rounded-lg bg-muted">
              {paths[slot] && (slot !== 'logo' || paths.hasLogo) ? (
                <Image
                  src={paths[slot] + '?t=' + Date.now()}
                  alt={getSlotLabel(slot)}
                  width={400}
                  height={225}
                  className="h-full w-full object-contain"
                  unoptimized
                />
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
                  სურათი არ არის
                </div>
              )}
            </div>
            <form onSubmit={(e) => handleUpload(slot, e)} className="space-y-2">
              <input
                ref={(el) => { fileRefs.current[slot] = el }}
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml,.png,.jpg,.jpeg,.webp,.svg"
                className="block w-full text-sm file:mr-2 file:rounded-md file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-medium file:text-primary-foreground file:hover:bg-primary/90"
              />
              <Button
                type="submit"
                size="sm"
                disabled={loading === slot}
                className="w-full sm:w-auto"
              >
                {loading === slot ? 'ატვირთვა...' : 'ატვირთვა'}
              </Button>
            </form>
          </div>
        ))}
      </div>
      {message && (
        <p
          className={
            message.type === 'success'
              ? 'text-sm text-green-600'
              : 'text-sm text-destructive'
          }
        >
          {message.text}
        </p>
      )}
    </div>
  )
}
