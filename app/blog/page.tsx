import { cookies } from 'next/headers'
import Link from 'next/link'
import { getSiteTexts } from '@/lib/texts'
import { getImagePaths } from '@/lib/images-server'
import { getBlogPosts } from '@/lib/blog'
import { Header } from '@/components/femibion/header'
import { Footer } from '@/components/femibion/footer'
import { BlogPostCard } from '@/components/femibion/blog-post-card'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata = {
  title: 'ბლოგი',
  description: 'Femibion - სასარგებლო სტატიები ორსულობის, ვიტამინებისა და დედის ჯანმრთელობის შესახებ.',
}

export default async function BlogPage() {
  await cookies()
  const [texts, images, posts] = await Promise.all([
    getSiteTexts(),
    getImagePaths(),
    getBlogPosts(),
  ])

  const blogTexts = texts.blog ?? { title: 'ბლოგი', readMore: 'წაიკითხე მეტი' }

  return (
    <div className="min-h-screen">
      <Header texts={texts.header} images={images} />
      <main className="py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-10 md:mb-12">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{blogTexts.title}</h1>
            <p className="mt-2 text-muted-foreground">{blogTexts.subtitle}</p>
          </div>

          {posts.length === 0 ? (
            <p className="text-muted-foreground">ბლოგ პოსტები ჯერ არ არის.</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {posts.map((post) => (
                <BlogPostCard
                  key={post.slug}
                  post={post}
                  readMoreText={blogTexts.readMore}
                />
              ))}
            </div>
          )}

          <div className="mt-12 text-center">
            <Link
              href="/"
              className="text-sm font-medium text-primary hover:underline"
            >
              ← მთავარი გვერდი
            </Link>
          </div>
        </div>
      </main>
      <Footer texts={texts.footer} images={images} />
    </div>
  )
}
