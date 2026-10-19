import Link from 'next/link'

export function SiteBreadcrumbs({ items }: { items: { href?: string; label: string }[] }) {
  return (
    <nav aria-label="breadcrumb" className="mb-6 text-sm text-muted-foreground">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {items.map((item, index) => {
          const last = index === items.length - 1
          return (
            <li key={`${item.label}-${index}`} className="inline-flex items-center gap-2">
              {index > 0 && <span aria-hidden>›</span>}
              {item.href && !last ? (
                <Link href={item.href} className="cursor-pointer hover:text-primary">
                  {item.label}
                </Link>
              ) : (
                <span className="text-foreground">{item.label}</span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
