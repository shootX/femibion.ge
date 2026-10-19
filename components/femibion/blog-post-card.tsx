import Image from 'next/image'
import Link from 'next/link'
import { articleImageAlt, truncateExcerpt } from '@/lib/blog'
import type { BlogPost } from '@/lib/blog'

const EXCERPT_LENGTH = 200

export function BlogPostCard({ post, readMoreText }: { post: BlogPost; readMoreText: string }) {
  const excerpt = truncateExcerpt(post.excerpt, EXCERPT_LENGTH)

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block cursor-pointer overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm transition-all duration-200 hover:shadow-[var(--shadow-card)]"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        <Image
          src={post.image}
          alt={articleImageAlt(post)}
          fill
          unoptimized
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
      </div>
      <div className="p-5">
        <h2 className="line-clamp-2 text-lg font-semibold text-foreground transition-colors group-hover:text-primary">
          {post.title}
        </h2>
        <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{excerpt}</p>
        <span className="mt-3 inline-block text-sm font-medium text-primary group-hover:underline">
          {readMoreText} →
        </span>
      </div>
    </Link>
  )
}
