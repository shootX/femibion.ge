'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
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
    <div className="fixed bottom-4 left-4 right-4 z-[100] md:bottom-8 md:left-auto md:right-8 md:max-w-md">
      <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-[var(--shadow-card)]">
        <div className="flex items-start gap-4">
          <div className="shrink-0 rounded-lg bg-primary/10 p-2 text-primary">
            <Cookie className="h-5 w-5" />
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="font-bold">{texts.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {texts.description}{' '}
                <Link href="/privacy" className="cursor-pointer underline">
                  კონფიდენციალურობის პოლიტიკა
                </Link>
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button onClick={handleAccept} className="flex-1 cursor-pointer rounded-full">
                {texts.accept}
              </Button>
              <Button onClick={handleDecline} variant="outline" className="flex-1 cursor-pointer rounded-full">
                {texts.decline}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
