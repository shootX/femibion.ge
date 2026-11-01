import type { Metadata } from 'next'
import { getSiteTexts } from '@/lib/texts'
import { getImagePaths } from '@/lib/images-server'
import { Header } from '@/components/femibion/header'
import { StageFinder } from '@/components/femibion/stage-finder'
import { HowItWorks } from '@/components/femibion/how-it-works'
import { ProductCards } from '@/components/femibion/product-cards'
import { OrderForm } from '@/components/femibion/order-form'
import { Footer } from '@/components/femibion/footer'
import { FaqSection } from '@/components/femibion/faq-section'
import { StructuredData } from '@/components/femibion/structured-data'
import { SeoContent } from '@/components/femibion/seo-content'

export const revalidate = 3600

export const metadata: Metadata = {
  alternates: {
    canonical: 'https://femibion.ge',
    languages: {
      ka: 'https://femibion.ge',
      'x-default': 'https://femibion.ge',
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
}

export default async function FemibionLandingPage({
  searchParams,
}: {
  searchParams: Promise<{ product?: string }>
}) {
  const [{ product }, texts, images] = await Promise.all([
    searchParams,
    getSiteTexts(),
    getImagePaths(),
  ])
  return (
    <div className="min-h-screen">
      <StructuredData />
      <Header texts={texts.header} images={images} />
      <main>
        <StageFinder hero={texts.hero} pregnancy={texts.pregnancy} />
        <HowItWorks />
        <ProductCards texts={texts.products} />
        <OrderForm texts={texts.order} preselectId={product} />
        <SeoContent texts={texts.seoContent} />
        <FaqSection />
      </main>
      <Footer texts={texts.footer} images={images} />
    </div>
  )
}
