import type { Metadata } from 'next'
import Link from 'next/link'
import { getSiteTexts } from '@/lib/texts'
import { getImagePaths } from '@/lib/images-server'
import { getBlogPosts } from '@/lib/blog'
import { Header } from '@/components/femibion/header'
import { Footer } from '@/components/femibion/footer'
import { BlogPostCard } from '@/components/femibion/blog-post-card'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'ბლოგი',
  description: 'Femibion - სასარგებლო სტატიები ორსულობის, ვიტამინებისა და დედის ჯანმრთელობის შესახებ.',
  alternates: {
    canonical: 'https://femibion.ge/blog',
    languages: { ka: 'https://femibion.ge/blog', 'x-default': 'https://femibion.ge/blog' },
  },
  openGraph: {
    title: 'ბლოგი | Femibion Georgia',
    description: 'Femibion - სასარგებლო სტატიები ორსულობის, ვიტამინებისა და დედის ჯანმრთელობის შესახებ.',
    url: 'https://femibion.ge/blog',
    type: 'website',
    locale: 'ka_GE',
    siteName: 'Femibion Georgia',
    images: [{ url: '/images/og-image.jpg', width: 1200, height: 630, type: 'image/jpeg', alt: 'Femibion Georgia ბლოგი' }],
  },
}

const BLOG_BREADCRUMB_LD = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'მთავარი', item: 'https://femibion.ge' },
    { '@type': 'ListItem', position: 2, name: 'ბლოგი', item: 'https://femibion.ge/blog' },
  ],
}

export default async function BlogPage() {
  const [texts, images, posts] = await Promise.all([
    getSiteTexts(),
    getImagePaths(),
    getBlogPosts(),
  ])

  const blogTexts = texts.blog ?? { title: 'ბლოგი', readMore: 'წაიკითხე მეტი' }

  const blogListLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Femibion Georgia ბლოგი',
    url: 'https://femibion.ge/blog',
    inLanguage: 'ka-GE',
    publisher: { '@type': 'Organization', name: 'Femibion Georgia', url: 'https://femibion.ge' },
    blogPost: posts.map((post) => ({
      '@type': 'BlogPosting',
      headline: post.title,
      url: `https://femibion.ge/blog/${post.slug}`,
      datePublished: post.date,
      dateModified: post.updatedAt || post.date,
      image: post.image.startsWith('http') ? post.image : `https://femibion.ge${post.image}`,
    })),
  }

  return (
    <div className="min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BLOG_BREADCRUMB_LD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogListLd) }} />
      <Header texts={texts.header} images={images} />
      <main className="section-pad">
        <div className="wrap">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{blogTexts.title}</h1>
          {blogTexts.subtitle && (
            <p className="mt-2 text-muted-foreground">{blogTexts.subtitle}</p>
          )}

          {posts.length === 0 ? (
            <p className="mt-10 text-muted-foreground">ბლოგ პოსტები ჯერ არ არის.</p>
          ) : (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {posts.map((post) => (
                <BlogPostCard key={post.slug} post={post} readMoreText={blogTexts.readMore} />
              ))}
            </div>
          )}

          <div className="mt-12 text-center">
            <Link href="/" className="text-sm font-medium text-primary hover:underline">
              ← მთავარი გვერდი
            </Link>
          </div>
        </div>
      </main>
      <Footer texts={texts.footer} images={images} />
    </div>
  )
}
