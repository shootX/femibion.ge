import Image from 'next/image'
import Link from 'next/link'
import { truncateExcerpt } from '@/lib/blog'
import type { BlogPost } from '@/lib/blog'

const EXCERPT_LENGTH = 200

export function BlogPostCard({ post, readMoreText }: { post: BlogPost; readMoreText: string }) {
  const excerpt = truncateExcerpt(post.excerpt, EXCERPT_LENGTH)

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:shadow-lg hover:-translate-y-1"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        <Image
          src={post.image}
          alt={post.title}
          fill
          unoptimized
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
      </div>
      <div className="p-4 md:p-5">
        <h2 className="text-lg font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
          {post.title}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{excerpt}</p>
        <span className="mt-3 inline-block text-sm font-medium text-primary group-hover:underline">
          {readMoreText} →
        </span>
      </div>
    </Link>
  )
}
