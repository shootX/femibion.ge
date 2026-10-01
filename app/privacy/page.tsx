import type { Metadata } from 'next'
import { getSiteTexts } from '@/lib/texts'
import { getImagePaths } from '@/lib/images-server'
import { getPrivacyPolicy } from '@/lib/privacy-policy'
import { Header } from '@/components/femibion/header'
import { Footer } from '@/components/femibion/footer'

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
    title: policy.title,
    description: 'Femibion Georgia — პერსონალური მონაცემების დამუშავების პოლიტიკა.',
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
      title: `${policy.title} | Femibion Georgia`,
      description: 'Femibion Georgia — პერსონალური მონაცემების დამუშავების პოლიტიკა.',
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
      title: `${policy.title} | Femibion Georgia`,
      description: 'Femibion Georgia — პერსონალური მონაცემების დამუშავების პოლიტიკა.',
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
      <Header texts={texts.header} images={images} />
      <main className="py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl text-balance">{policy.title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">ბოლო განახლება: {dateStr}</p>
          <div
            className="privacy-content mt-8 space-y-4 text-foreground leading-relaxed [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mt-8 [&_h2]:mb-3 [&_p]:text-muted-foreground [&_ul]:list-disc [&_ul]:pl-6 [&_li]:text-muted-foreground"
            dangerouslySetInnerHTML={{ __html: normalizePolicyContent(policy.contentHtml) }}
          />
        </div>
      </main>
      <Footer texts={texts.footer} images={images} />
    </div>
  )
}
