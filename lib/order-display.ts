import type { Order, OrderEditLog, OrderLineItem } from '@/lib/orders'

export function normalizeOrderLineItems(order: Order): OrderLineItem[] {
  if (order.lineItems?.length) {
    return order.lineItems.map((i) => ({ ...i }))
  }

  const items: OrderLineItem[] = []
  if (order.product1Label || order.product1Qty > 0) {
    items.push({
      productId: 'prod_default_1',
      label: order.product1Label,
      qty: order.product1Qty,
    })
  }
  if (order.product2Label || order.product2Qty > 0) {
    items.push({
      productId: 'prod_default_2',
      label: order.product2Label,
      qty: order.product2Qty,
    })
  }
  return items
}

export function getOrderProductLines(order: Order): string[] {
  if (order.lineItems?.length) {
    return order.lineItems.filter((i) => i.qty > 0).map((i) => `${i.label}: ${i.qty} ცალი`)
  }
  const lines: string[] = []
  if (order.product1Qty > 0) lines.push(`${order.product1Label}: ${order.product1Qty} ცალი`)
  if (order.product2Qty > 0) lines.push(`${order.product2Label}: ${order.product2Qty} ცალი`)
  return lines
}

export function getOrderTotalQty(order: Order): number {
  if (order.lineItems?.length) {
    return order.lineItems.reduce((sum, item) => sum + item.qty, 0)
  }
  return order.product1Qty + order.product2Qty
}

export function getOrderShortId(order: Order): string {
  return order.id.slice(-7).toUpperCase()
}

export function isAdminCreatedOrder(order: Order): boolean {
  return order.createdBy === 'admin'
}

export function formatQtyChange(change: { label: string; fromQty: number; toQty: number }): string {
  return `${change.label}: ${change.fromQty} ცალი → ${change.toQty} ცალი`
}

export function getOrderEditSummary(log: OrderEditLog): string[] {
  return log.changes.map(formatQtyChange)
}
