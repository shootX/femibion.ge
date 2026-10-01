import { cn } from '@/lib/utils'

type SectionHeaderProps = {
  title: string
  subtitle?: string
  align?: 'center' | 'left'
  className?: string
}

export function SectionHeader({
  title,
  subtitle,
  align = 'center',
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        'mb-10 md:mb-14',
        align === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl',
        className
      )}
    >
      <div
        className={cn(
          'mb-4 flex items-center gap-3',
          align === 'center' && 'justify-center'
        )}
      >
        <span className="h-px w-8 bg-primary/40" aria-hidden />
        <span className="text-xs font-semibold uppercase tracking-widest text-primary">
          Femibion
        </span>
        <span className="h-px w-8 bg-primary/40" aria-hidden />
      </div>
      <h2 className="text-balance text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 text-base leading-relaxed text-muted-foreground sm:text-lg">
          {subtitle}
        </p>
      )}
    </div>
  )
}
