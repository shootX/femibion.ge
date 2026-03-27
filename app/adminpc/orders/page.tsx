import { redirect } from 'next/navigation'
import Link from 'next/link'
import { isAdmin } from '@/lib/auth'
import { getOrders } from '@/lib/orders'
import { OrderCard } from './order-card'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ShoppingBag } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AdminOrdersPage() {
  const authenticated = await isAdmin()
  if (!authenticated) {
    redirect('/adminpc')
  }

  const orders = await getOrders()

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <Link
            href="/adminpc/dashboard"
            className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-2"
          >
            <ChevronLeft className="mr-1 h-4 w-4" /> დაფა
          </Link>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <ShoppingBag className="h-6 w-6" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">შეკვეთები</h1>
          </div>
        </div>
      </div>

      {orders.length === 0 ? (
        <Card className="p-12 flex flex-col items-center justify-center text-center space-y-4">
          <div className="p-4 bg-muted rounded-full">
            <ShoppingBag className="h-8 w-8 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-semibold">შეკვეთები არ არის</h3>
            <p className="text-sm text-muted-foreground">ამჟამად სისტემაში არცერთი შეკვეთა არ იძებნება.</p>
          </div>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  )
}

import { Card } from '@/components/ui/card'
