import type { Metadata } from 'next'
import { getSiteTexts } from '@/lib/texts'
import { getImagePaths } from '@/lib/images-server'
import { getFaqData } from '@/lib/faq'
import { Header } from '@/components/femibion/header'
import { Footer } from '@/components/femibion/footer'
import { FaqAccordion } from '@/components/femibion/faq-accordion'

export const revalidate = 86400

export async function generateMetadata(): Promise<Metadata> {
  const faq = await getFaqData()
  return {
    title: faq.title,
    description: faq.description,
    alternates: {
      canonical: 'https://femibion.ge/faq',
      languages: {
        ka: 'https://femibion.ge/faq',
        'x-default': 'https://femibion.ge/faq',
      },
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: `${faq.title} | Femibion Georgia`,
      description: faq.description,
      url: 'https://femibion.ge/faq',
      type: 'website',
      locale: 'ka_GE',
      siteName: 'Femibion Georgia',
      images: [
        {
          url: '/images/og-image.jpg',
          width: 1200,
          height: 630,
          type: 'image/jpeg',
          alt: 'Femibion Georgia',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${faq.title} | Femibion Georgia`,
      description: faq.description,
      images: ['/images/og-image.jpg'],
    },
  }
}

export default async function FaqPage() {
  const [texts, images, faq] = await Promise.all([
    getSiteTexts(),
    getImagePaths(),
    getFaqData(),
  ])

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer.join(' '),
      },
    })),
  }

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'მთავარი', item: 'https://femibion.ge' },
      { '@type': 'ListItem', position: 2, name: faq.title, item: 'https://femibion.ge/faq' },
    ],
  }

  return (
    <div className="min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Header texts={texts.header} images={images} />
      <main className="section-pad">
        <div className="wrap">
          <div className="mb-12 text-center">
            <span className="eyebrow mb-4 justify-center">სასარგებლო ინფორმაცია</span>
            <h1 className="section-heading">{faq.title}</h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
              {faq.description}
            </p>
          </div>

          <FaqAccordion items={faq.items} />

          <p className="mx-auto mt-10 max-w-3xl text-center text-sm text-muted-foreground">
            {faq.disclaimer}
          </p>
        </div>
      </main>
      <Footer texts={texts.footer} images={images} />
    </div>
  )
}