import type { Metadata } from 'next'
import Script from 'next/script'
import { Noto_Sans_Georgian, Inter } from 'next/font/google'
import './globals.css'
import { getSiteTexts } from '@/lib/texts'
import { CookieConsent } from '@/components/femibion/cookie-consent'

const GA_ID = 'G-ZHB1WKDT66'

const notoGeorgian = Noto_Sans_Georgian({
  subsets: ['georgian'],
  variable: '--font-georgian',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
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
        url: '/images/hero-pregnant-woman.jpg',
        width: 1200,
        height: 630,
        alt: 'Femibion - ორსულობის ვიტამინები საქართველოში',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Femibion საქართველო | ორსულობის ვიტამინები',
    description:
      'Femibion - #1 პრენატალური ვიტამინი ევროპაში. ორსულობის და ლაქტაციის ვიტამინები. ოპტიმალური ფორმა მათთვის, ვისაც სურს ფოლატების მაქსიმალური ათვისება.',
    images: ['/images/hero-pregnant-woman.jpg'],
  },
  alternates: {
    canonical: 'https://femibion.ge',
    languages: {
      'ka-GE': 'https://femibion.ge',
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {},
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const texts = await getSiteTexts()

  return (
    <html lang="ka" dir="ltr">
      <head>
        <link rel="icon" href="/favicon.ico?v=3" sizes="any" />
        <link rel="icon" href="/icon.png?v=3" type="image/png" sizes="32x32" />
        <link rel="alternate" hrefLang="ka" href="https://femibion.ge" />
        <link rel="alternate" hrefLang="x-default" href="https://femibion.ge" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#c2185b" />
      </head>
      <body className={`${notoGeorgian.variable} ${inter.variable} font-sans antialiased`}>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="gtag" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            // Default consent state
            if (typeof localStorage !== 'undefined' && localStorage.getItem('cookie-consent') === 'accepted') {
              gtag('consent', 'default', {
                'analytics_storage': 'granted'
              });
            } else {
              gtag('consent', 'default', {
                'analytics_storage': 'denied'
              });
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
