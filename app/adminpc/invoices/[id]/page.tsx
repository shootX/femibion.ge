import { notFound, redirect } from 'next/navigation'
import { isAdmin } from '@/lib/auth'
import { getInvoiceById } from '@/lib/invoices'
import { InvoicePrintableView } from '@/components/femibion/invoices/invoice-printable-view'

export const dynamic = 'force-dynamic'

export default async function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const authenticated = await isAdmin()
  if (!authenticated) {
    redirect('/adminpc')
  }

  const { id } = await params
  const invoice = await getInvoiceById(id)

  if (!invoice) {
    notFound()
  }

  return (
    <div className="mx-auto max-w-5xl py-2">
      <InvoicePrintableView invoice={invoice} />
    </div>
  )
}
