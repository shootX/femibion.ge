import type { Metadata } from 'next'
import { getSiteTexts } from '@/lib/texts'
import { getImagePaths } from '@/lib/images-server'
import { Header } from '@/components/femibion/header'
import { Hero } from '@/components/femibion/hero'
import { ProductCards } from '@/components/femibion/product-cards'
import { PregnancySlider } from '@/components/femibion/pregnancy-slider'
import { OrderForm } from '@/components/femibion/order-form'
import { Footer } from '@/components/femibion/footer'
import { FaqSection } from '@/components/femibion/faq-section'
import { StructuredData } from '@/components/femibion/structured-data'
import { SeoContent } from '@/components/femibion/seo-content'
import { TrustBar } from '@/components/femibion/trust-bar'

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
        <Hero texts={texts.hero} imageSrc={images.hero} />
        <TrustBar />
        <ProductCards texts={texts.products} images={[images.product1, images.product2]} />
        <SeoContent texts={texts.seoContent} />
        <PregnancySlider texts={texts.pregnancy} />
        <OrderForm texts={texts.order} products={texts.products.items} preselectId={product} />
        <FaqSection />
      </main>
      <Footer texts={texts.footer} images={images} />
    </div>
  )
}
