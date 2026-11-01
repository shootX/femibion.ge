import Image from 'next/image'
import Link from 'next/link'
import { articleImageAlt, formatPostDate, truncateExcerpt } from '@/lib/blog'
import type { BlogPost } from '@/lib/blog'
import { cn } from '@/lib/utils'

const EXCERPT_LENGTH = 180

export function BlogPostCard({
  post,
  readMoreText,
  featured = false,
}: {
  post: BlogPost
  readMoreText: string
  featured?: boolean
}) {
  const excerpt = truncateExcerpt(post.excerpt, featured ? 280 : EXCERPT_LENGTH)

  return (
    <Link
      href={`/blog/${post.slug}`}
      className={cn(
        'panel-flat group grid h-full overflow-hidden transition-shadow duration-200 hover:shadow-[var(--shadow-panel)]',
        featured && 'md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]'
      )}
    >
      <div className={cn('relative overflow-hidden bg-muted', featured ? 'aspect-[16/10] md:aspect-auto md:min-h-[320px]' : 'aspect-[16/10]')}>
        <Image
          src={post.image}
          alt={articleImageAlt(post)}
          fill
          unoptimized
          className="object-cover transition-transform duration-500 [transition-timing-function:var(--ease-out)] group-hover:scale-[1.03]"
          sizes={featured ? '(max-width: 768px) 100vw, 640px' : '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 380px'}
        />
      </div>
      <div className={cn('grid content-start gap-2 p-5', featured && 'md:gap-3 md:p-8')}>
        <time dateTime={post.date} className="text-[13px] text-muted-foreground">
          {formatPostDate(post.date)}
        </time>
        {featured ? (
          <h2 className="text-[1.55rem] font-bold leading-snug tracking-[-0.01em] transition-colors group-hover:text-primary md:text-[1.9rem]">
            {post.title}
          </h2>
        ) : (
          <h2 className="text-[1.12rem] font-bold leading-snug transition-colors group-hover:text-primary">{post.title}</h2>
        )}
        <p className="text-[14.5px] leading-relaxed text-muted-foreground">{excerpt}</p>
        <span className="mt-1 text-[14px] font-semibold text-primary">{readMoreText} →</span>
      </div>
    </Link>
  )
}
