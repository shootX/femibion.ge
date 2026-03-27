import { cookies } from 'next/headers'
import type { Metadata } from 'next'
import { getSiteTexts } from '@/lib/texts'
import { getImagePaths } from '@/lib/images-server'
import { getPrivacyPolicy } from '@/lib/privacy-policy'
import { Header } from '@/components/femibion/header'
import { Footer } from '@/components/femibion/footer'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function generateMetadata(): Promise<Metadata> {
  const policy = await getPrivacyPolicy()
  return {
    title: policy.title,
    description: 'Femibion Georgia — პერსონალური მონაცემების დამუშავების პოლიტიკა.',
    alternates: { canonical: 'https://femibion.ge/privacy' },
  }
}

export default async function PrivacyPage() {
  await cookies()
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
            dangerouslySetInnerHTML={{ __html: policy.contentHtml }}
          />
        </div>
      </main>
      <Footer texts={texts.footer} images={images} />
    </div>
  )
}
