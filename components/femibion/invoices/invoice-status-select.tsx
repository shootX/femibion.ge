'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { INVOICE_STATUS_META, type InvoiceStatus } from '@/lib/invoice-types'
import { setInvoiceStatusAction } from '@/app/adminpc/invoices/actions'

export function InvoiceStatusSelect({
  invoiceId,
  status,
  onUpdated,
  disabled,
}: {
  invoiceId: string
  status: InvoiceStatus
  onUpdated?: () => void
  disabled?: boolean
}) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  const handleChange = (next: string) => {
    const nextStatus = next as InvoiceStatus
    if (nextStatus === status) return

    startTransition(async () => {
      await setInvoiceStatusAction(invoiceId, nextStatus)
      if (onUpdated) onUpdated()
      router.refresh()
    })
  }

  return (
    <Select
      value={status}
      onValueChange={handleChange}
      disabled={disabled || pending}
    >
      <SelectTrigger className="h-8 w-[140px] text-xs font-medium">
        <SelectValue placeholder="სტატუსი" />
      </SelectTrigger>
      <SelectContent>
        {(Object.keys(INVOICE_STATUS_META) as InvoiceStatus[]).map((st) => {
          const meta = INVOICE_STATUS_META[st]
          return (
            <SelectItem key={st} value={st} className="text-xs">
              <span className="flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${meta.dotClass}`} />
                {meta.label}
              </span>
            </SelectItem>
          )
        })}
      </SelectContent>
    </Select>
  )
}
