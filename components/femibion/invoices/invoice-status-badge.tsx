import { Badge } from '@/components/ui/badge'
import { INVOICE_STATUS_META, type InvoiceStatus } from '@/lib/invoice-types'
import { cn } from '@/lib/utils'

export function InvoiceStatusBadge({
  status,
  className,
}: {
  status: InvoiceStatus
  className?: string
}) {
  const meta = INVOICE_STATUS_META[status] || INVOICE_STATUS_META.pending

  return (
    <Badge
      variant="outline"
      className={cn('inline-flex items-center gap-1.5 font-medium px-2.5 py-0.5', meta.badgeClass, className)}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', meta.dotClass)} />
      {meta.label}
    </Badge>
  )
}
