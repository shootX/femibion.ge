import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getSiteTexts } from '@/lib/texts'
import { getImagePaths } from '@/lib/images-server'
import { getBlogPost, getBlogPosts, countWords, articleTitle, articleDescription, articleImageAlt, relatedPosts } from '@/lib/blog'
import { extractArticleFaq } from '@/lib/blog-content'
import { Header } from '@/components/femibion/header'
import { Footer } from '@/components/femibion/footer'
import { ShareButtons } from '@/components/femibion/share-buttons'
import { BlogMarkdown, BlogToc } from '@/components/femibion/blog-markdown'

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
  const title = articleTitle(post)
  const description = articleDescription(post)
  const imageAlt = articleImageAlt(post)

  return {
    title,
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
      images: [{ url: imageUrl, alt: imageAlt, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  }
}

function formatDate(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('ka-GE', { year: 'numeric', month: 'long', day: 'numeric' })
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

  return (
    <div className="min-h-screen bg-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      {faqLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />}
      <Header texts={texts.header} images={images} />
      <main>
        <article className="wrap section-pad !pt-8">
          <Link
            href="/blog"
            className="mb-6 inline-block cursor-pointer text-sm text-muted-foreground hover:text-primary"
          >
            ← ბლოგი
          </Link>
          <div className="relative mb-8 aspect-video overflow-hidden rounded-2xl bg-muted shadow-[var(--shadow-card)]">
            <Image
              src={post.image}
              alt={imageAlt}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 768px"
            />
          </div>
          <h1 className="mb-4 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {post.title}
          </h1>
          <div className="mb-8 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <time dateTime={published}>{formatDate(published)}</time>
            {modified !== published && (
              <time dateTime={modified}>განახლდა {formatDate(modified)}</time>
            )}
          </div>

          <BlogToc content={post.content} />
          <div className="prose prose-neutral max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-p:leading-relaxed prose-strong:text-foreground prose-a:text-cta hover:prose-a:underline">
            <BlogMarkdown content={post.content} />
          </div>

          {related.length > 0 && (
            <section className="mt-12 border-t border-border/60 pt-8" aria-label="მსგავსი სტატიები">
              <h2 className="mb-4 text-xl font-semibold text-foreground">მსგავსი სტატიები</h2>
              <ul className="space-y-3">
                {related.map((item) => (
                  <li key={item.slug}>
                    <Link href={`/blog/${item.slug}`} className="cursor-pointer font-medium text-primary hover:underline">
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <aside className="mt-10 rounded-2xl border border-border/70 bg-secondary/50 p-6">
            <h2 className="text-xl font-semibold text-foreground">შეუკვეთე ოფიციალურად</h2>
            <p className="mt-2 leading-7 text-muted-foreground">
              {`${texts.products.items
                .map((item) => (item.price != null ? `${item.name} — ${item.price} ₾` : item.name))
                .join(', ')}. მიწოდება საქართველოში.`}
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/femibion-1" className="btn-ghost">Femibion 1</Link>
              <Link href="/femibion-2" className="btn-ghost">Femibion 2</Link>
              <Link href="/#order" className="btn-primary">შეკვეთა</Link>
            </div>
          </aside>

          <div className="mt-12 border-t border-border/60 pt-8">
            <ShareButtons url={`/blog/${post.slug}`} title={post.title} />
          </div>
        </article>
      </main>
      <Footer texts={texts.footer} images={images} />
    </div>
  )
}
