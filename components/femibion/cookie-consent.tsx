'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Cookie } from 'lucide-react'
import { cn } from '@/lib/utils'

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
    // Here you would typically enable GA or other trackers
    if (typeof window !== 'undefined' && (window as any).gtag) {
      ;(window as any).gtag('consent', 'update', {
        analytics_storage: 'granted',
      })
    }
  }

  const handleDecline = () => {
    localStorage.setItem('cookie-consent', 'declined')
    setIsVisible(false)
    if (typeof window !== 'undefined' && (window as any).gtag) {
      ;(window as any).gtag('consent', 'update', {
        analytics_storage: 'denied',
      })
    }
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 z-[100] md:left-auto md:right-8 md:bottom-8 md:max-w-md animate-in slide-in-from-bottom-8 duration-500">
      <div className="bg-background border rounded-2xl p-6 shadow-2xl shadow-foreground/10">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-primary/10 rounded-lg text-primary shrink-0">
            <Cookie className="h-6 w-6" />
          </div>
          <div className="space-y-4">
            <div className="space-y-1">
              <h3 className="font-bold text-lg">{texts.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {texts.description}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button onClick={handleAccept} className="flex-1">
                {texts.accept}
              </Button>
              <Button onClick={handleDecline} variant="outline" className="flex-1">
                {texts.decline}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
