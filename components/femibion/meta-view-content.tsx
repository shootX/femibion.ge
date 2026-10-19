'use client'

import { useEffect } from 'react'
import { trackMeta } from '@/lib/analytics'

export function MetaViewContent({ id, value }: { id: string; value: number }) {
  useEffect(() => {
    trackMeta('ViewContent', {
      content_ids: [id],
      content_type: 'product',
      value,
      currency: 'GEL',
    })
  }, [id, value])

  return null
}
