'use client'

import { User, Phone, MapPin, Package, CheckCircle, Circle } from 'lucide-react'
import { setOrderStatus } from './actions'
import { Button } from '@/components/ui/button'
import type { Order } from '@/lib/orders'

export function OrderCard({ order }: { order: Order }) {
  const products: string[] = []
  if (order.product1Qty > 0) products.push(`${order.product1Label}: ${order.product1Qty} ცალი`)
  if (order.product2Qty > 0) products.push(`${order.product2Label}: ${order.product2Qty} ცალი`)

  const date = new Date(order.createdAt).toLocaleString('ka-GE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  const isCompleted = order.status === 'completed'

  return (
    <div
      className={`rounded-lg border bg-card p-4 transition-colors ${
        isCompleted ? 'border-green-200 bg-green-50/30 dark:bg-green-950/20' : ''
      }`}
    >
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs text-muted-foreground">#{order.id.slice(-7)}</span>
        <span className="text-xs text-muted-foreground">{date}</span>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 shrink-0 text-muted-foreground" />
          <span className="font-medium">{order.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4 shrink-0 text-muted-foreground" />
          <span>+995 {order.phone}</span>
        </div>
        <div className="flex items-start gap-2">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
          <span className="break-words">{order.address}</span>
        </div>
        <div className="flex items-start gap-2">
          <Package className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
          <div className="flex flex-wrap gap-1">
            {products.map((p, i) => (
              <span key={i} className="rounded bg-muted px-2 py-0.5 text-xs">
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>

      <form action={setOrderStatus} className="mt-4">
        <input type="hidden" name="id" value={order.id} />
        <input type="hidden" name="status" value={isCompleted ? 'pending' : 'completed'} />
        <Button
          type="submit"
          variant={isCompleted ? 'outline' : 'default'}
          size="sm"
          className="w-full gap-2"
        >
          {isCompleted ? (
            <>
              <Circle className="h-4 w-4" />
              შეუსრულებელი
            </>
          ) : (
            <>
              <CheckCircle className="h-4 w-4" />
              შესრულებული
            </>
          )}
        </Button>
      </form>
    </div>
  )
}
