import { cookies } from 'next/headers'
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

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function FemibionLandingPage() {
  await cookies()
  const [texts, images] = await Promise.all([getSiteTexts(), getImagePaths()])
  return (
    <div className="min-h-screen">
      <StructuredData />
      <Header texts={texts.header} images={images} />
      <main>
        <Hero texts={texts.hero} imageSrc={images.hero} />
        <ProductCards texts={texts.products} images={[images.product1, images.product2]} />
        <SeoContent texts={texts.seoContent} />
        <PregnancySlider texts={texts.pregnancy} />
        <OrderForm texts={texts.order} />
        <FaqSection />
      </main>
      <Footer texts={texts.footer} images={images} />
    </div>
  )
}
