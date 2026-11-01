import type { Metadata } from 'next'
import { getSiteTexts } from '@/lib/texts'
import { getImagePaths } from '@/lib/images-server'
import { getBlogPosts } from '@/lib/blog'
import { Header } from '@/components/femibion/header'
import { Footer } from '@/components/femibion/footer'
import { BlogPostCard } from '@/components/femibion/blog-post-card'
import { SiteBreadcrumbs } from '@/components/femibion/site-breadcrumbs'
import { pageTitle } from '@/lib/seo'
import { PageIntro } from '@/components/femibion/page-intro'

export const revalidate = 3600

const BLOG_TITLE = pageTitle('ბლოგი')
const BLOG_DESCRIPTION = 'Femibion — სტატიები ორსულობის, ვიტამინებისა და დედის ჯანმრთელობის შესახებ.'

export const metadata: Metadata = {
  title: BLOG_TITLE,
  description: BLOG_DESCRIPTION,
  alternates: {
    canonical: 'https://femibion.ge/blog',
    languages: { ka: 'https://femibion.ge/blog', 'x-default': 'https://femibion.ge/blog' },
  },
  openGraph: {
    title: BLOG_TITLE.absolute,
    description: BLOG_DESCRIPTION,
    url: 'https://femibion.ge/blog',
    type: 'website',
    locale: 'ka_GE',
    siteName: 'Femibion Georgia',
    images: [{ url: '/images/og-image.jpg', width: 1200, height: 630, type: 'image/jpeg', alt: 'Femibion Georgia ბლოგი' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: BLOG_TITLE.absolute,
    description: BLOG_DESCRIPTION,
    images: ['/images/og-image.jpg'],
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
      <main className="pb-14 pt-6 md:pb-20 md:pt-8">
        <div className="wrap">
          <SiteBreadcrumbs
            items={[
              { href: '/', label: 'მთავარი' },
              { label: 'ბლოგი' },
            ]}
          />
          <PageIntro title={blogTexts.title} lead={blogTexts.subtitle} />

          {posts.length === 0 ? (
            <p className="panel-flat p-6 text-muted-foreground">სტატიები მალე დაემატება.</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post, i) => (
                <div key={post.slug} className={i === 0 ? 'sm:col-span-2 lg:col-span-3' : undefined}>
                  <BlogPostCard post={post} readMoreText={blogTexts.readMore} featured={i === 0} />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer texts={texts.footer} images={images} />
    </div>
  )
}
