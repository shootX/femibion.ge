import { redirect } from 'next/navigation'
import Link from 'next/link'
import { isAdmin } from '@/lib/auth'
import { getOrders } from '@/lib/orders'
import { getAllProducts } from '@/lib/products'
import { OrdersPanel } from './orders-panel'
import { CreateOrderDialog } from './create-order-dialog'
import { ChevronLeft, ShoppingBag } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AdminOrdersPage() {
  const authenticated = await isAdmin()
  if (!authenticated) {
    redirect('/adminpc')
  }

  const [orders, products] = await Promise.all([getOrders(), getAllProducts()])

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <Link
            href="/adminpc/dashboard"
            className="mb-2 flex items-center text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            <ChevronLeft className="mr-1 h-4 w-4" /> დაფა
          </Link>
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-primary/10 p-2 text-primary">
              <ShoppingBag className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">შეკვეთების მართვა</h1>
              <p className="text-sm text-muted-foreground">ფილტრაცია, სტატუსები და დეტალური ნახვა</p>
            </div>
          </div>
        </div>
        <CreateOrderDialog products={products} />
      </div>

      <OrdersPanel orders={orders} />
    </div>
  )
}
