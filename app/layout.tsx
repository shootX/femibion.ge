import type { Metadata } from 'next'
import Script from 'next/script'
import localFont from 'next/font/local'
import './globals.css'
import { getSiteTexts } from '@/lib/texts'
import { CookieConsent } from '@/components/femibion/cookie-consent'

const GA_ID = 'G-ZHB1WKDT66'

const firaGo = localFont({
  src: '../FiraGO-Medium.woff2',
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://femibion.ge'),
  title: {
    default: 'Femibion საქართველო | ორსულობის ვიტამინები - პრენატალური ვიტამინები',
    template: '%s | Femibion Georgia',
  },
  description:
    'Femibion - #1 პრენატალური ვიტამინი ევროპაში. ორსულობის დაგეგმვის, ორსულობის და ლაქტაციის ვიტამინები. ოპტიმალური ფორმა მათთვის, ვისაც სურს ფოლატების მაქსიმალური ათვისება. შეუკვეთე ონლაინ საქართველოში.',
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
      'Femibion - პრემიუმ ვიტამინები ორსულობის დაგეგმვის, ორსულობის და ლაქტაციის პერიოდისთვის. ოპტიმალური ფორმა მათთვის, ვისაც სურს ფოლატების მაქსიმალური ათვისება. შეუკვეთე ონლაინ.',
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
      'Femibion - #1 პრენატალური ვიტამინი ევროპაში. ორსულობის და ლაქტაციის ვიტამინები. ოპტიმალური ფორმა მათთვის, ვისაც სურს ფოლატების მაქსიმალური ათვისება.',
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
        <link rel="icon" href="/favicon.ico?v=4" sizes="any" />
        <link rel="icon" href="/icon.png?v=4" type="image/png" sizes="32x32" />
        <link rel="icon" href="/icon-192.png?v=4" type="image/png" sizes="192x192" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="preload" as="image" href="/images/hero-pregnant-woman.webp" type="image/webp" fetchPriority="high" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="anonymous" />
        <meta name="theme-color" content="#a84f55" />
      </head>
      <body className={`${firaGo.variable} font-sans antialiased`}>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="lazyOnload"
        />
        <Script id="gtag" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            if (typeof localStorage !== 'undefined' && localStorage.getItem('cookie-consent') === 'accepted') {
              gtag('consent', 'default', { 'analytics_storage': 'granted' });
            } else {
              gtag('consent', 'default', { 'analytics_storage': 'denied' });
            }
            gtag('config', '${GA_ID}');
          `}
        </Script>
        {children}
        <CookieConsent texts={texts.footer.cookies} />
      </body>
    </html>
  )
}
