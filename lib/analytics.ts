declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
    fbq?: (...args: unknown[]) => void
  }
}

type EventParams = Record<string, string | number | boolean | null | undefined>
type MetaParams = Record<string, string | number | boolean | string[] | null | undefined>

export function trackEvent(eventName: string, params?: EventParams): void {
  if (typeof window === 'undefined') return
  const payload = { ...(params ?? {}), transport_type: 'beacon' }
  const send = () => {
    if (typeof window.gtag !== 'function') return false
    window.gtag('event', eventName, payload)
    return true
  }
  if (send()) return
  let tries = 0
  const timer = window.setInterval(() => {
    tries += 1
    if (send() || tries > 25) window.clearInterval(timer)
  }, 200)
}

function whenFbq(run: () => void) {
  if (typeof window === 'undefined') return
  if (typeof window.fbq === 'function') {
    run()
    return
  }
  let tries = 0
  const timer = window.setInterval(() => {
    tries += 1
    if (typeof window.fbq === 'function' || tries > 25) {
      window.clearInterval(timer)
      if (typeof window.fbq === 'function') run()
    }
  }, 200)
}

export function trackMeta(event: string, params?: MetaParams, eventID?: string): void {
  whenFbq(() => {
    if (eventID) {
      window.fbq!('track', event, params ?? {}, { eventID })
      return
    }
    window.fbq!('track', event, params ?? {})
  })
}

export function setMetaConsent(granted: boolean): void {
  whenFbq(() => {
    window.fbq!('consent', granted ? 'grant' : 'revoke')
  })
}
