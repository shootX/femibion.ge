'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Cookie } from 'lucide-react'
import { setMetaConsent } from '@/lib/analytics'

type CookieConsentProps = {
  texts: {
    title: string
    description: string
    accept: string
    decline: string
  }
}

export function CookieConsent({ texts }: CookieConsentProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent')
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 1500)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted')
    setIsVisible(false)
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: 'granted',
        ad_storage: 'granted',
        ad_user_data: 'granted',
        ad_personalization: 'granted',
      })
    }
    setMetaConsent(true)
  }

  const handleDecline = () => {
    localStorage.setItem('cookie-consent', 'declined')
    setIsVisible(false)
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: 'denied',
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
      })
    }
    setMetaConsent(false)
  }

  if (!isVisible) return null

  return (
    <div
      role="dialog"
      aria-labelledby="cookie-title"
      className="fixed inset-x-3 z-[100] [bottom:calc(12px+env(safe-area-inset-bottom,0px))] md:inset-x-auto md:right-6 md:max-w-[26rem] md:[bottom:calc(24px+env(safe-area-inset-bottom,0px))]"
    >
      <div className="panel animate-in fade-in slide-in-from-bottom-2 grid gap-4 p-5 duration-300">
        <div className="flex items-start gap-3.5">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-background text-primary">
            <Cookie className="h-5 w-5" aria-hidden />
          </span>
          <div className="grid gap-1">
            <h2 id="cookie-title" className="text-[15.5px] font-bold">
              {texts.title}
            </h2>
            <p className="text-[14px] leading-normal text-muted-foreground">
              {texts.description}{' '}
              <Link href="/privacy" className="text-primary underline underline-offset-2">
                კონფიდენციალურობის პოლიტიკა
              </Link>
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button type="button" onClick={handleDecline} className="btn-ghost min-h-11 px-4">
            {texts.decline}
          </button>
          <button type="button" onClick={handleAccept} className="btn-primary min-h-11 px-4">
            {texts.accept}
          </button>
        </div>
      </div>
    </div>
  )
}
