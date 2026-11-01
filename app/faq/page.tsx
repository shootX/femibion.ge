import type { Metadata } from 'next'
import { getSiteTexts } from '@/lib/texts'
import { getImagePaths } from '@/lib/images-server'
import { getFaqData } from '@/lib/faq'
import { Header } from '@/components/femibion/header'
import { Footer } from '@/components/femibion/footer'
import { FaqAccordion } from '@/components/femibion/faq-accordion'
import { SiteBreadcrumbs } from '@/components/femibion/site-breadcrumbs'
import { PageIntro } from '@/components/femibion/page-intro'
import { Phone } from 'lucide-react'
import { pageTitle } from '@/lib/seo'

export const revalidate = 86400

export async function generateMetadata(): Promise<Metadata> {
  const faq = await getFaqData()
  return {
    title: pageTitle(faq.title),
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
      <main className="pb-14 pt-6 md:pb-20 md:pt-8">
        <div className="wrap">
          <SiteBreadcrumbs
            items={[
              { href: '/', label: 'მთავარი' },
              { label: faq.title },
            ]}
          />
          <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-12">
            <div className="lg:sticky lg:top-[92px]">
              <PageIntro title={faq.title} lead={faq.description} className="mb-5" />
              <a
                href={`tel:${texts.footer.phone.replace(/[^\d+]/g, '')}`}
                className="panel-flat press inline-flex items-center gap-3 p-4 pr-5"
              >
                <span className="grid h-11 w-11 place-items-center rounded-full bg-background text-primary">
                  <Phone className="h-5 w-5" aria-hidden />
                </span>
                <span className="grid leading-snug">
                  <span className="text-[13.5px] text-muted-foreground">ვერ იპოვე პასუხი? დაგვირეკე</span>
                  <b className="tabular-nums">{texts.footer.phone}</b>
                </span>
              </a>
            </div>
            <div className="grid gap-5">
              <FaqAccordion items={faq.items} />
              {faq.disclaimer && <p className="text-[13.5px] leading-relaxed text-muted-foreground">{faq.disclaimer}</p>}
            </div>
          </div>
        </div>
      </main>
      <Footer texts={texts.footer} images={images} />
    </div>
  )
}