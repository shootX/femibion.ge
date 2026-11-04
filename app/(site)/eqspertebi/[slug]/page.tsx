import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getSiteTexts } from '@/lib/texts'
import { getImagePaths } from '@/lib/images-server'
import { expertsFromPosts, formatPostDate, getBlogPosts } from '@/lib/blog'
import { Footer } from '@/components/femibion/footer'
import { SiteBreadcrumbs } from '@/components/femibion/site-breadcrumbs'
import { pageTitle } from '@/lib/seo'

export const revalidate = 3600
export const dynamicParams = false

const BASE_URL = 'https://femibion.ge'

type Props = { params: Promise<{ slug: string }> }

async function loadExpert(slug: string) {
  const posts = await getBlogPosts()
  return expertsFromPosts(posts).find((expert) => expert.slug === slug) ?? null
}

export async function generateStaticParams() {
  const posts = await getBlogPosts()
  return expertsFromPosts(posts).map((expert) => ({ slug: expert.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const expert = await loadExpert(slug)
  if (!expert) return { title: 'ექსპერტი ვერ მოიძებნა', robots: { index: false, follow: false } }
  const canonical = `${BASE_URL}/eqspertebi/${expert.slug}`
  const description = [expert.specialty, expert.workplace].filter(Boolean).join(' · ') || expert.name
  return {
    title: pageTitle(`დრ. ${expert.name}`),
    description,
    alternates: { canonical, languages: { ka: canonical, 'x-default': canonical } },
    robots: { index: true, follow: true },
  }
}

export default async function ExpertPage({ params }: Props) {
  const { slug } = await params
  const [texts, images, expert] = await Promise.all([getSiteTexts(), getImagePaths(), loadExpert(slug)])
  if (!expert) notFound()

  const canonical = `${BASE_URL}/eqspertebi/${expert.slug}`
  const personLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: expert.name,
    url: canonical,
  }
  if (expert.specialty) personLd.jobTitle = expert.specialty
  if (expert.workplace) personLd.affiliation = { '@type': 'Organization', name: expert.workplace }
  if (expert.photo) personLd.image = expert.photo.startsWith('http') ? expert.photo : `${BASE_URL}${expert.photo}`
  if (expert.bio) personLd.description = expert.bio

  return (
    <div className="min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }} />
      <main className="pb-14 pt-6 md:pb-20 md:pt-8">
        <div className="wrap">
          <SiteBreadcrumbs items={[{ href: '/', label: 'მთავარი' }, { label: `დრ. ${expert.name}` }]} />
          <article className="mx-auto grid max-w-[760px] gap-6">
            <header className="grid gap-4 sm:grid-cols-[96px_minmax(0,1fr)] sm:items-center">
              {expert.photo && (
                <span className="relative h-24 w-24 overflow-hidden rounded-full bg-muted">
                  <Image src={expert.photo} alt="" fill className="object-cover" sizes="96px" />
                </span>
              )}
              <div className="grid gap-1">
                <h1 className="text-[2rem] font-bold leading-tight">დრ. {expert.name}</h1>
                {expert.specialty && <p className="text-[16px] font-semibold text-primary">{expert.specialty}</p>}
                {expert.workplace && <p className="text-[15px] text-muted-foreground">{expert.workplace}</p>}
              </div>
            </header>
            {expert.bio && <p className="text-[17px] leading-relaxed text-ink-soft">{expert.bio}</p>}
            {expert.articles.length > 0 && (
              <section className="grid gap-3" aria-labelledby="reviewed-title">
                <h2 id="reviewed-title" className="text-[1.3rem] font-bold">
                  გადახედილი სტატიები
                </h2>
                <ul className="grid gap-2">
                  {expert.articles.map((article) => (
                    <li key={article.slug}>
                      <Link href={`/blog/${article.slug}`} className="font-semibold text-primary underline underline-offset-2">
                        {article.title}
                      </Link>
                      {article.reviewedAt && (
                        <span className="ml-2 text-[14px] text-muted-foreground">
                          <time dateTime={article.reviewedAt}>{formatPostDate(article.reviewedAt)}</time>
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </article>
        </div>
      </main>
      <Footer texts={texts.footer} images={images} />
    </div>
  )
}
