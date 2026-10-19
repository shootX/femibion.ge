import type { Metadata } from 'next'
import Script from 'next/script'
import localFont from 'next/font/local'
import './globals.css'
import { getSiteTexts } from '@/lib/texts'
import { CookieConsent } from '@/components/femibion/cookie-consent'
import { TelClickTracker } from '@/components/femibion/tel-click-tracker'
import { MetaPageViews } from '@/components/femibion/meta-page-views'

const GA_ID = 'G-ZHB1WKDT66'
const META_PIXEL_ID = '1660192815715456'

const firaGo = localFont({
  src: '../FiraGO-Medium.woff2',
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://femibion.ge'),
  title: {
    default: 'Femibion საქართველო | ორსულობისა და ლაქტაციის ვიტამინები ონლაინ',
    template: '%s | Femibion Georgia',
  },
  description:
    'Femibion — #1 პრენატალური ვიტამინი ევროპაში. ორსულობის დაგეგმვის, ორსულობისა და ლაქტაციის ვიტამინები. შეუკვეთე ონლაინ საქართველოში.',
  keywords: [
    'femibion',
    'ფემიბიონი',
    'ორსულობის ვიტამინები',
    'პრენატალური ვიტამინები',
    'ფოლიუმის მჟავა',
    'Metafolin',
    'ვიტამინები ორსულებისთვის',
    'femibion 1',
    'femibion 2',
    'ლაქტაციის ვიტამინები',
    'DHA ომეგა 3 ორსულობა',
    'ორსულობის დაგეგმვა ვიტამინები',
  ],
  authors: [{ name: 'Femibion Georgia' }],
  icons: {
    icon: [
      { url: '/icon.png', type: 'image/png', sizes: '32x32' },
      { url: '/icon-192.png', type: 'image/png', sizes: '192x192' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: '/apple-icon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'ka_GE',
    url: 'https://femibion.ge',
    siteName: 'Femibion Georgia',
    title: 'Femibion საქართველო | #1 პრენატალური ვიტამინი ევროპაში',
    description:
      'Femibion — #1 პრენატალური ვიტამინი ევროპაში. ორსულობის დაგეგმვის, ორსულობისა და ლაქტაციის ვიტამინები. შეუკვეთე ონლაინ საქართველოში.',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        type: 'image/jpeg',
        alt: 'Femibion - ორსულობის ვიტამინები საქართველოში',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Femibion საქართველო | ორსულობის ვიტამინები',
    description:
      'Femibion — #1 პრენატალური ვიტამინი ევროპაში. ორსულობის დაგეგმვის, ორსულობისა და ლაქტაციის ვიტამინები. შეუკვეთე ონლაინ საქართველოში.',
    images: ['/images/og-image.jpg'],
  },
  formatDetection: {
    telephone: true,
    email: true,
    address: false,
  },
  category: 'health',
  verification: {},
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const texts = await getSiteTexts()

  return (
    <html lang="ka-GE" dir="ltr">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
            window.dataLayer = window.dataLayer || [];
            window.gtag = function(){dataLayer.push(arguments);};
            var granted = 'denied';
            try {
              if (localStorage.getItem('cookie-consent') === 'accepted') granted = 'granted';
            } catch (e) {}
            window.gtag('consent', 'default', {
              analytics_storage: granted,
              ad_storage: granted,
              ad_user_data: granted,
              ad_personalization: granted,
              wait_for_update: 500
            });
          `,
          }}
        />
        <link rel="icon" href="/favicon.ico?v=4" sizes="any" />
        <link rel="icon" href="/icon.png?v=4" type="image/png" sizes="32x32" />
        <link rel="icon" href="/icon-192.png?v=4" type="image/png" sizes="192x192" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="anonymous" />
        <meta name="theme-color" content="#a84f55" />
        <meta name="facebook-domain-verification" content="ovm2g3g0i6qfaae5nvvsyobxphvlxd" />
      </head>
      <body className={`${firaGo.variable} font-sans antialiased`}>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="gtag" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            window.gtag = window.gtag || function(){dataLayer.push(arguments);};
            window.gtag('js', new Date());
            window.gtag('config', '${GA_ID}');
          `}
        </Script>
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
            n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
            document,'script','https://connect.facebook.net/en_US/fbevents.js');
            fbq('consent', localStorage.getItem('cookie-consent')==='accepted' ? 'grant' : 'revoke');
            fbq('init', '${META_PIXEL_ID}');
            fbq('track', 'PageView');
          `}
        </Script>
        {children}
        <MetaPageViews />
        <TelClickTracker />
        <CookieConsent texts={texts.footer.cookies} />
      </body>
    </html>
  )
}
