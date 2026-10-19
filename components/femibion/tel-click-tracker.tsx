'use client'

import { useEffect } from 'react'
import { trackEvent, trackMeta } from '@/lib/analytics'

export function TelClickTracker() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target
      if (!(target instanceof Element)) return
      const link = target.closest('a[href]')
      if (!(link instanceof HTMLAnchorElement)) return
      const href = link.href
      if (href.startsWith('tel:')) {
        trackEvent('call_click', {
          phone: href.replace(/^tel:/, ''),
          location: window.location.pathname,
        })
        trackMeta('Contact', { method: 'phone' })
      }
      if (/wa\.me|api\.whatsapp\.com|whatsapp\.com/i.test(href)) {
        trackEvent('whatsapp_click', {
          location: window.location.pathname,
          link_url: href.slice(0, 100),
        })
      }
    }
    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [])

  return null
}
