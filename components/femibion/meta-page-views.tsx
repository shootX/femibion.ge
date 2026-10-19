'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { trackMeta } from '@/lib/analytics'

export function MetaPageViews() {
  const pathname = usePathname()
  const isFirst = useRef(true)

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false
      return
    }
    trackMeta('PageView')
  }, [pathname])

  return null
}
