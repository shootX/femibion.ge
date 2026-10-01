import type { Order, OrderLineItem } from '@/lib/orders'
import type { StockLineItem } from '@/lib/products'
import { adjustStockByLineItems } from '@/lib/products'
import { normalizeOrderLineItems } from '@/lib/order-display'

export { normalizeOrderLineItems } from '@/lib/order-display'

export function getOrderLineItemsForStock(order: Order): StockLineItem[] {
  return normalizeOrderLineItems(order)
    .filter((i) => i.qty > 0)
    .map((i) => ({ productId: i.productId, label: i.label, qty: i.qty }))
}

export async function applyStockQtyDelta(
  oldItems: OrderLineItem[],
  newItems: OrderLineItem[],
): Promise<void> {
  const productIds = new Set([
    ...oldItems.map((i) => i.productId),
    ...newItems.map((i) => i.productId),
  ])

  for (const productId of productIds) {
    const oldQty = oldItems.find((i) => i.productId === productId)?.qty ?? 0
    const newQty = newItems.find((i) => i.productId === productId)?.qty ?? 0
    const delta = newQty - oldQty
    if (delta === 0) continue

    const label =
      newItems.find((i) => i.productId === productId)?.label ??
      oldItems.find((i) => i.productId === productId)?.label ??
      ''

    if (delta > 0) {
      await adjustStockByLineItems([{ productId, label, qty: delta }], 'deduct')
    } else {
      await adjustStockByLineItems([{ productId, label, qty: -delta }], 'restore')
    }
  }
}

export function toOrderLineItems(items: StockLineItem[]): OrderLineItem[] {
  return items.map((i) => ({
    productId: i.productId ?? '',
    label: i.label,
    qty: i.qty,
  }))
}
