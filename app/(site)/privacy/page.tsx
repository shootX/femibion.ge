import type { Metadata } from 'next'
import { getSiteTexts } from '@/lib/texts'
import { getImagePaths } from '@/lib/images-server'
import { getPrivacyPolicy } from '@/lib/privacy-policy'
import { Footer } from '@/components/femibion/footer'
import { LegalEntityNotice } from '@/components/femibion/legal-entity-notice'
import { SiteBreadcrumbs } from '@/components/femibion/site-breadcrumbs'
import { PageIntro } from '@/components/femibion/page-intro'
import { pageTitle } from '@/lib/seo'

const PRIVACY_DESCRIPTION =
  'Femibion Georgia-ს კონფიდენციალურობის პოლიტიკა ვებსაიტზე: Google Analytics, ქუქი-ფაილები, მონაცემთა დამუშავების საფუძველი და შენახვის ვადა.'

export const revalidate = 86400

function normalizePolicyContent(html: string): string {
  return html
    .replace(/<!doctype[^>]*>/gi, '')
    .replace(/<html[^>]*>/gi, '')
    .replace(/<\/html>/gi, '')
    .replace(/<head[\s\S]*?<\/head>/gi, '')
    .replace(/<body[^>]*>/gi, '')
    .replace(/<\/body>/gi, '')
    .replace(/<h1[^>]*>[\s\S]*?<\/h1>/i, '')
    .replace(/<p>\s*<b>\s*უკანასკნელი\s+განახლება:[\s\S]*?<\/b>\s*<\/p>/i, '')
    .trim()
}

export async function generateMetadata(): Promise<Metadata> {
  const policy = await getPrivacyPolicy()
  return {
    title: pageTitle(policy.title),
    description: PRIVACY_DESCRIPTION,
    alternates: {
      canonical: 'https://femibion.ge/privacy',
      languages: {
        ka: 'https://femibion.ge/privacy',
        'x-default': 'https://femibion.ge/privacy',
      },
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: pageTitle(policy.title).absolute,
      description: PRIVACY_DESCRIPTION,
      url: 'https://femibion.ge/privacy',
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
      title: pageTitle(policy.title).absolute,
      description: PRIVACY_DESCRIPTION,
      images: ['/images/og-image.jpg'],
    },
  }
}

export default async function PrivacyPage() {
  const [texts, images, policy] = await Promise.all([
    getSiteTexts(),
    getImagePaths(),
    getPrivacyPolicy(),
  ])

  const updated = new Date(policy.updatedAt)
  const dateStr = updated.toLocaleDateString('ka-GE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="min-h-screen">
      <main className="pb-14 pt-6 md:pb-20 md:pt-8">
        <div className="wrap">
          <SiteBreadcrumbs items={[{ href: '/', label: 'მთავარი' }, { label: policy.title }]} />
          <div className="mx-auto max-w-[760px]">
            <PageIntro title={policy.title} lead={`ბოლო განახლება: ${dateStr}`} className="mb-6" />
            <LegalEntityNotice />
            <div
              className="privacy-content panel-flat mt-4 p-6 sm:p-8 grid gap-4 leading-[1.75] text-ink-soft [&_a]:text-primary [&_a]:underline [&_h2]:mt-6 [&_h2]:text-[1.3rem] [&_h2]:font-bold [&_h2]:leading-snug [&_h2]:text-foreground [&_h3]:mt-4 [&_h3]:font-bold [&_h3]:text-foreground [&_li]:pl-1 [&_ul]:grid [&_ul]:list-disc [&_ul]:gap-1.5 [&_ul]:pl-6 [&_ol]:grid [&_ol]:list-decimal [&_ol]:gap-1.5 [&_ol]:pl-6"
              dangerouslySetInnerHTML={{ __html: normalizePolicyContent(policy.contentHtml) }}
            />
          </div>
        </div>
      </main>
      <Footer texts={texts.footer} images={images} />
    </div>
  )
}
