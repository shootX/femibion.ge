import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export function SiteBreadcrumbs({ items }: { items: { href?: string; label: string }[] }) {
  return (
    <nav aria-label="breadcrumb" className="mb-5 text-[14px] text-muted-foreground">
      <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
        {items.map((item, index) => {
          const last = index === items.length - 1
          return (
            <li key={`${item.label}-${index}`} className="inline-flex min-w-0 items-center gap-1.5">
              {index > 0 && <ChevronRight className="h-3.5 w-3.5 shrink-0" aria-hidden />}
              {item.href && !last ? (
                <Link href={item.href} className="hover:text-primary">
                  {item.label}
                </Link>
              ) : (
                <span aria-current={last ? 'page' : undefined} className="line-clamp-1 text-foreground">
                  {item.label}
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
