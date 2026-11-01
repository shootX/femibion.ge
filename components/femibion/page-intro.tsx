import { cn } from '@/lib/utils'

/** Title block for inner pages: optional eyebrow, the page's h1, and a short lead. */
export function PageIntro({
  eyebrow,
  title,
  lead,
  className,
  children,
}: {
  eyebrow?: string
  title: string
  lead?: string
  className?: string
  children?: React.ReactNode
}) {
  return (
    <div className={cn('mb-8 grid max-w-[46rem] justify-items-start gap-3', className)}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h1 className="break-words text-[1.8rem] font-bold leading-[1.12] tracking-[-0.02em] sm:text-[2.5rem] lg:text-[2.9rem]">{title}</h1>
      {lead && <p className="text-[17px] leading-relaxed text-muted-foreground">{lead}</p>}
      {children}
    </div>
  )
}
