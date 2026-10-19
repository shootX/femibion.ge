import { redirect } from 'next/navigation'
import { isAdmin } from '@/lib/auth'
import { getAllProducts } from '@/lib/products'
import { getBuyerSuggestions, getNextInvoiceNumber } from '@/lib/invoices'
import { getOrderById } from '@/lib/orders'
import { normalizeOrderLineItems } from '@/lib/order-display'
import { InvoiceForm } from '@/components/femibion/invoices/invoice-form'

export const dynamic = 'force-dynamic'

export default async function NewInvoicePage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string }>
}) {
  const authenticated = await isAdmin()
  if (!authenticated) {
    redirect('/adminpc')
  }

  const { orderId } = await searchParams

  const [products, buyerSuggestions, nextInvoiceNumber, order] = await Promise.all([
    getAllProducts(),
    getBuyerSuggestions(),
    getNextInvoiceNumber(),
    orderId ? getOrderById(orderId) : Promise.resolve(null),
  ])

  let initialBuyer: { name?: string; phone?: string; address?: string } | undefined
  let initialItems:
    | Array<{ productId?: string; description: string; quantity: number; unitPrice: number }>
    | undefined

  if (order) {
    initialBuyer = {
      name: order.name,
      phone: order.phone,
      address: order.address,
    }

    const orderLines = normalizeOrderLineItems(order).filter((l) => l.qty > 0)
    if (orderLines.length > 0) {
      initialItems = orderLines.map((line) => {
        const prod = products.find((p) => p.id === line.productId || p.orderLabel === line.label || p.name === line.label)
        return {
          productId: prod?.id || line.productId,
          description: line.label || prod?.orderLabel || prod?.name || 'პროდუქტი',
          quantity: line.qty,
          unitPrice: prod?.price || 100,
        }
      })
    }
  }

  return (
    <div className="mx-auto max-w-5xl py-2">
      <InvoiceForm
        defaultInvoiceNumber={nextInvoiceNumber}
        products={products}
        buyerSuggestions={buyerSuggestions}
        initialOrderId={orderId}
        initialBuyer={initialBuyer}
        initialItems={initialItems}
      />
    </div>
  )
}
