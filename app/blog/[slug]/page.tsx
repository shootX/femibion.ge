import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getSiteTexts } from '@/lib/texts'
import { getImagePaths } from '@/lib/images-server'
import { getBlogPost } from '@/lib/blog'
import { Header } from '@/components/femibion/header'
import { Footer } from '@/components/femibion/footer'
import { ShareButtons } from '@/components/femibion/share-buttons'

export const dynamic = 'force-dynamic'
export const revalidate = 0

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const post = await getBlogPost(slug)
  if (!post) return { title: 'პოსტი ვერ მოიძებნა' }
  return {
    title: post.title,
    description: post.excerpt,
  }
}

export default async function BlogPostPage({ params }: Props) {
  await cookies()
  const { slug } = await params
  const [texts, images, post] = await Promise.all([
    getSiteTexts(),
    getImagePaths(),
    getBlogPost(slug),
  ])

  if (!post) notFound()

  return (
    <div className="min-h-screen">
      <Header texts={texts.header} images={images} />
      <main className="py-12 md:py-16">
        <article className="container mx-auto px-4 md:px-6 max-w-3xl">
          <Link href="/blog" className="text-sm text-muted-foreground hover:text-foreground mb-6 inline-block">
            ← ბლოგი
          </Link>
          <div className="relative aspect-video rounded-2xl overflow-hidden bg-muted mb-8">
            <Image
              src={post.image}
              alt={post.title}
              fill
              unoptimized
              className="object-cover"
              priority
            />
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{post.title}</h1>
          <div className="mt-6 prose prose-neutral dark:prose-invert max-w-none">
            {post.content.split('\n\n').map((p, i) => (
              <p key={i} className="mb-4 text-muted-foreground leading-relaxed">
                {p}
              </p>
            ))}
          </div>
          <div className="mt-12 pt-8 border-t border-border">
            <ShareButtons url={`/blog/${post.slug}`} title={post.title} />
          </div>
        </article>
      </main>
      <Footer texts={texts.footer} images={images} />
    </div>
  )
}
