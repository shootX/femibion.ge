import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getSiteTexts } from '@/lib/texts'
import { getImagePaths } from '@/lib/images-server'
import { getBlogPost, getBlogPosts, countWords, articleTitle, articleDescription, articleImageAlt, relatedPosts, formatPostDate } from '@/lib/blog'
import { extractArticleFaq } from '@/lib/blog-content'
import { Header } from '@/components/femibion/header'
import { Footer } from '@/components/femibion/footer'
import { ShareButtons } from '@/components/femibion/share-buttons'
import { BlogMarkdown, BlogToc } from '@/components/femibion/blog-markdown'
import { SiteBreadcrumbs } from '@/components/femibion/site-breadcrumbs'
import { pageTitle } from '@/lib/seo'
import { BlogPostCard } from '@/components/femibion/blog-post-card'
import { pageSlugForProduct } from '@/lib/product-slug'
import { cn } from '@/lib/utils'
import { BLOG_COVER_HEIGHT, BLOG_COVER_WIDTH } from '@/lib/blog-image'

export const revalidate = 3600

type Props = { params: Promise<{ slug: string }> }
const BASE_URL = 'https://femibion.ge'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPost(slug)
  if (!post) {
    return {
      title: 'პოსტი ვერ მოიძებნა',
      robots: { index: false, follow: false },
    }
  }

  const canonicalUrl = `${BASE_URL}/blog/${post.slug}`
  const imageUrl = post.image.startsWith('http') ? post.image : `${BASE_URL}${post.image}`
  const titled = pageTitle(articleTitle(post))
  const title = titled.absolute
  const description = articleDescription(post)
  const imageAlt = articleImageAlt(post)

  return {
    title: titled,
    description,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      canonical: canonicalUrl,
      languages: {
        ka: canonicalUrl,
        'x-default': canonicalUrl,
      },
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: 'article',
      locale: 'ka_GE',
      siteName: 'Femibion Georgia',
      publishedTime: post.date,
      modifiedTime: post.updatedAt || post.date,
      authors: ['Femibion Georgia'],
      section: 'ორსულობა და ვიტამინები',
      tags: ['Femibion', 'ფემიბიონი', 'ორსულობის ვიტამინები', 'პრენატალური ვიტამინები'],
      images: [{ url: imageUrl, alt: imageAlt, width: BLOG_COVER_WIDTH, height: BLOG_COVER_HEIGHT }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const [texts, images, post, posts] = await Promise.all([
    getSiteTexts(),
    getImagePaths(),
    getBlogPost(slug),
    getBlogPosts(),
  ])

  if (!post) notFound()

  const canonicalUrl = `${BASE_URL}/blog/${post.slug}`
  const imageUrl = post.image.startsWith('http') ? post.image : `${BASE_URL}${post.image}`
  const published = post.date
  const modified = post.updatedAt || post.date
  const imageAlt = articleImageAlt(post)
  const faq = extractArticleFaq(post.content)
  const related = relatedPosts(posts, post.slug)
  const publisher = {
    '@type': 'Organization',
    name: 'Femibion Georgia',
    url: BASE_URL,
    logo: {
      '@type': 'ImageObject',
      url: `${BASE_URL}/images/logo.webp`,
    },
  }

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: articleDescription(post),
    image: [imageUrl],
    datePublished: published,
    dateModified: modified,
    author: publisher,
    publisher,
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalUrl },
    inLanguage: 'ka-GE',
    wordCount: countWords(post.content),
  }

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'მთავარი', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'ბლოგი', item: `${BASE_URL}/blog` },
      { '@type': 'ListItem', position: 3, name: post.title, item: canonicalUrl },
    ],
  }

  const faqLd = faq.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faq.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: { '@type': 'Answer', text: item.answer },
        })),
      }
    : null

  const shopItems = texts.products.items.map((item, idx) => ({ ...item, slug: pageSlugForProduct(item, idx) }))

  return (
    <div className="min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      {faqLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />}
      <Header texts={texts.header} images={images} />
      <main className="pb-14 pt-6 md:pb-20 md:pt-8">
        <div className="wrap">
          <SiteBreadcrumbs
            items={[
              { href: '/', label: 'მთავარი' },
              { href: '/blog', label: 'ბლოგი' },
              { label: post.title },
            ]}
          />

          <article className="mx-auto max-w-[760px]">
            <header className="mb-6 grid gap-3">
              <p className="flex flex-wrap gap-x-4 gap-y-1 text-[14px] text-muted-foreground">
                <time dateTime={published}>{formatPostDate(published)}</time>
                {modified !== published && <time dateTime={modified}>განახლდა {formatPostDate(modified)}</time>}
              </p>
              <h1 className="break-words text-[1.8rem] font-bold leading-[1.15] tracking-[-0.02em] sm:text-[2.6rem]">{post.title}</h1>
            </header>

            <div className="relative mb-8 aspect-video overflow-hidden rounded-[22px] bg-muted">
              <Image
                src={post.image}
                alt={imageAlt}
                fill
                unoptimized
                className="object-cover"
                priority
                fetchPriority="high"
                sizes="(max-width: 800px) 100vw, 760px"
              />
            </div>

            <BlogToc content={post.content} />
            <div className="article-body">
              <BlogMarkdown content={post.content} />
            </div>

            <aside className="mt-10 grid gap-4 rounded-[22px] bg-f1-wash p-5 sm:p-7" aria-label="შეკვეთა">
              <div className="grid gap-1">
                <h2 className="text-[1.4rem] font-bold">შეუკვეთე ოფიციალურად</h2>
                <p className="text-[15px] text-muted-foreground">მიწოდება მთელ საქართველოში, გადახდა მიწოდებისას.</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {shopItems.map((item) => (
                  <Link
                    key={item.id ?? item.name}
                    href={item.slug ? `/${item.slug}` : '/#products'}
                    className="press group grid grid-cols-[64px_minmax(0,1fr)] items-center gap-3 rounded-[16px] bg-white p-3"
                  >
                    <span className={cn('relative aspect-square rounded-xl', item.slug === 'femibion-2' ? 'bg-f2-wash' : 'bg-f1-wash')}>
                      {item.image && <Image src={item.image} alt="" fill sizes="64px" className="object-contain p-1 mix-blend-multiply" />}
                    </span>
                    <span className="grid min-w-0 leading-snug">
                      <b className="group-hover:text-primary">{item.name}</b>
                      <span className="text-[13px] text-muted-foreground">{item.subtitle}</span>
                      {item.price != null && <span className="mt-0.5 font-bold tabular-nums">{item.price} ₾</span>}
                    </span>
                  </Link>
                ))}
              </div>
              <Link href="/#finder" className="btn-primary justify-self-start">
                რომელი მჭირდება? გამოთვალე კვირით
              </Link>
            </aside>

            <div className="mt-8 border-t border-border pt-6">
              <ShareButtons url={`/blog/${post.slug}`} title={post.title} />
            </div>
          </article>

          {related.length > 0 && (
            <section className="mt-14 border-t border-border pt-10" aria-labelledby="related-title">
              <h2 id="related-title" className="mb-5 text-[1.6rem] font-bold tracking-[-0.01em]">
                მსგავსი სტატიები
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((item) => (
                  <BlogPostCard key={item.slug} post={item} readMoreText={texts.blog?.readMore ?? 'წაიკითხე მეტი'} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer texts={texts.footer} images={images} />
    </div>
  )
}
