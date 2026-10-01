import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const OLD_TO_NEW_SLUGS: Record<string, string> = {
  'ორსულობის-დაგეგმვა-და-ვიტამინების-მნიშვნელობა': 'orsulobis-dagegmva-da-vitaminebis-mnishvneloba',
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon\\.ico|icon\\.png|apple-icon\\.png|images/).*)'],
}

export function middleware(request: NextRequest) {
  const hostname = request.nextUrl.hostname.toLowerCase()
  const forwardedProto = request.headers.get('x-forwarded-proto')
  const protocol = (forwardedProto ?? request.nextUrl.protocol.replace(':', '')).toLowerCase()

  if (hostname === 'www.femibion.ge' || protocol === 'http') {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.protocol = 'https:'
    redirectUrl.host = 'femibion.ge'
    return NextResponse.redirect(redirectUrl, 301)
  }

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

  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'SAMEORIGIN')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=63072000; includeSubDomains; preload'
  )
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), interest-cohort=()'
  )
  response.headers.set('X-DNS-Prefetch-Control', 'on')

  return response
}
