import { notFound, redirect } from 'next/navigation'
import { isAdmin } from '@/lib/auth'
import { getInvoiceById, getBuyerSuggestions } from '@/lib/invoices'
import { getAllProducts } from '@/lib/products'
import { InvoiceForm } from '@/components/femibion/invoices/invoice-form'

export const dynamic = 'force-dynamic'

export default async function InvoiceEditPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const authenticated = await isAdmin()
  if (!authenticated) {
    redirect('/adminpc')
  }

  const { id } = await params
  const [invoice, products, buyerSuggestions] = await Promise.all([
    getInvoiceById(id),
    getAllProducts(),
    getBuyerSuggestions(),
  ])

  if (!invoice) {
    notFound()
  }

  return (
    <div className="mx-auto max-w-5xl py-2">
      <InvoiceForm
        initialInvoice={invoice}
        products={products}
        buyerSuggestions={buyerSuggestions}
      />
    </div>
  )
}
