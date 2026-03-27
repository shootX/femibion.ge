import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const OLD_TO_NEW_SLUGS: Record<string, string> = {
  'ორსულობის-დაგეგმვა-და-ვიტამინების-მნიშვნელობა': 'orsulobis-dagegmva-da-vitaminebis-mnishvneloba',
}

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  if (path.startsWith('/blog/')) {
    const raw = path.slice('/blog/'.length).split('?')[0]
    const slug = decodeURIComponent(raw)
    const redirectTo = OLD_TO_NEW_SLUGS[slug]
    if (redirectTo) {
      return NextResponse.redirect(new URL(`/blog/${redirectTo}`, request.url), 301)
    }
  }

  const response = NextResponse.next()

  if (request.nextUrl.pathname === '/') {
    const ua = request.headers.get('user-agent') || ''
    const isBot = /googlebot|bingbot|yandex|baiduspider|facebookexternalhit|twitterbot/i.test(ua)

    if (isBot) {
      response.headers.set('Cache-Control', 'public, max-age=3600, s-maxage=3600')
    } else {
      response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
      response.headers.set('Pragma', 'no-cache')
      response.headers.set('Expires', '0')
    }
  }

  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'SAMEORIGIN')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

  return response
}
