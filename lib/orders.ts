import { readFile, writeFile } from 'fs/promises'
import { join } from 'path'
import { unstable_noStore } from 'next/cache'
import { adjustStockByLineItems } from '@/lib/products'
import { applyStockQtyDelta, getOrderLineItemsForStock } from '@/lib/order-stock'
import { normalizeOrderLineItems } from '@/lib/order-display'
import type { OrderStatus } from '@/lib/order-status'
import { isValidOrderStatus } from '@/lib/order-status'

export type { OrderStatus } from '@/lib/order-status'

export type OrderLineItem = {
  productId: string
  label: string
  qty: number
}

export type OrderQtyChange = {
  productId: string
  label: string
  fromQty: number
  toQty: number
}

export type OrderEditLog = {
  id: string
  editedAt: string
  editedBy: 'admin'
  changes: OrderQtyChange[]
}

export type Order = {
  id: string
  name: string
  phone: string
  city?: string
  address: string
  shippingFee?: number
  productsTotal?: number
  total?: number
  product1Qty: number
  product2Qty: number
  product1Label: string
  product2Label: string
  lineItems?: OrderLineItem[]
  status: OrderStatus
  stockApplied?: boolean
  createdBy?: 'customer' | 'admin'
  adminEdited?: boolean
  editHistory?: OrderEditLog[]
  createdAt: string
}

const ORDERS_FILE = 'data/orders.json'

function getOrdersPath(): string {
  const base = process.env.PWD || process.cwd()
  return join(base, ORDERS_FILE)
}

export async function getOrders(): Promise<Order[]> {
  unstable_noStore()
  try {
    const path = getOrdersPath()
    const data = await readFile(path, 'utf-8')
    const orders = JSON.parse(data) as Order[]
    return orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  } catch {
    return []
  }
}

export async function getOrderById(id: string): Promise<Order | null> {
  const orders = await getOrders()
  return orders.find((o) => o.id === id) ?? null
}

export async function addOrder(order: Omit<Order, 'id' | 'createdAt' | 'status'>): Promise<Order> {
  const orders = await getOrders()
  const newOrder: Order = {
    ...order,
    id: `ord_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    status: 'pending',
    createdAt: new Date().toISOString(),
  }
  orders.unshift(newOrder)
  await writeFile(getOrdersPath(), JSON.stringify(orders, null, 2))
  return newOrder
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<boolean> {
  if (!isValidOrderStatus(status)) return false

  const orders = await getOrders()
  const idx = orders.findIndex((o) => o.id === id)
  if (idx === -1) return false

  orders[idx] = await applyStatusChange(orders[idx], status)
  await writeFile(getOrdersPath(), JSON.stringify(orders, null, 2))
  return true
}

async function applyStatusChange(order: Order, status: OrderStatus): Promise<Order> {
  const wasCompleted = order.status === 'completed'
  const willBeCompleted = status === 'completed'
  const lineItems = getOrderLineItemsForStock(order)

  if (!wasCompleted && willBeCompleted && !order.stockApplied) {
    await adjustStockByLineItems(lineItems, 'deduct')
    order.stockApplied = true
  } else if (wasCompleted && !willBeCompleted && order.stockApplied) {
    await adjustStockByLineItems(lineItems, 'restore')
    order.stockApplied = false
  }

  order.status = status
  return order
}

export async function bulkUpdateOrderStatus(ids: string[], status: OrderStatus): Promise<number> {
  if (!isValidOrderStatus(status) || ids.length === 0) return 0

  const orders = await getOrders()
  const idSet = new Set(ids)
  let updated = 0

  for (let i = 0; i < orders.length; i++) {
    if (!idSet.has(orders[i].id)) continue
    orders[i] = await applyStatusChange(orders[i], status)
    updated++
  }

  if (updated > 0) {
    await writeFile(getOrdersPath(), JSON.stringify(orders, null, 2))
  }
  return updated
}

export async function bulkRemoveOrders(ids: string[]): Promise<number> {
  if (ids.length === 0) return 0

  const orders = await getOrders()
  const idSet = new Set(ids)
  let removed = 0
  const remaining: Order[] = []

  for (const order of orders) {
    if (!idSet.has(order.id)) {
      remaining.push(order)
      continue
    }
    if (order.status === 'completed' && order.stockApplied) {
      await adjustStockByLineItems(getOrderLineItemsForStock(order), 'restore')
    }
    removed++
  }

  if (removed > 0) {
    await writeFile(getOrdersPath(), JSON.stringify(remaining, null, 2))
  }
  return removed
}

export async function removeOrder(id: string): Promise<boolean> {
  const orders = await getOrders()
  const order = orders.find((o) => o.id === id)
  if (!order) return false

  if (order.status === 'completed' && order.stockApplied) {
    await adjustStockByLineItems(getOrderLineItemsForStock(order), 'restore')
  }

  const next = orders.filter((o) => o.id !== id)
  await writeFile(getOrdersPath(), JSON.stringify(next, null, 2))
  return true
}

function syncLegacyFields(order: Order, lineItems: OrderLineItem[]): void {
  order.lineItems = lineItems
  order.product1Qty = lineItems[0]?.qty ?? 0
  order.product2Qty = lineItems[1]?.qty ?? 0
  order.product1Label = lineItems[0]?.label ?? order.product1Label
  order.product2Label = lineItems[1]?.label ?? order.product2Label
}

export async function updateOrderQuantities(
  id: string,
  quantities: { productId: string; qty: number }[],
): Promise<{ success: boolean; error?: string }> {
  const orders = await getOrders()
  const idx = orders.findIndex((o) => o.id === id)
  if (idx === -1) return { success: false, error: 'შეკვეთა ვერ მოიძებნა' }

  const order = orders[idx]
  const oldItems = normalizeOrderLineItems(order)
  if (oldItems.length === 0) {
    return { success: false, error: 'შეკვეთაში პროდუქტი ვერ მოიძებნა' }
  }

  const newItems = oldItems.map((item) => {
    const update = quantities.find((q) => q.productId === item.productId)
    const qty = Math.max(0, Math.floor(Number(update?.qty ?? item.qty) || 0))
    return { ...item, qty }
  })

  const changes: OrderQtyChange[] = []
  for (const old of oldItems) {
    const next = newItems.find((i) => i.productId === old.productId)
    if (!next || old.qty === next.qty) continue
    changes.push({
      productId: old.productId,
      label: old.label,
      fromQty: old.qty,
      toQty: next.qty,
    })
  }

  if (changes.length === 0) {
    return { success: false, error: 'რაოდენობაში ცვლილება არ არის' }
  }

  const activeItems = newItems.filter((i) => i.qty > 0)
  if (activeItems.length === 0) {
    return { success: false, error: 'მინიმუმ ერთი პროდუქტი უნდა დარჩეს შეკვეთაში' }
  }

  if (order.stockApplied) {
    await applyStockQtyDelta(oldItems, newItems)
  }

  const logEntry: OrderEditLog = {
    id: `edit_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    editedAt: new Date().toISOString(),
    editedBy: 'admin',
    changes,
  }

  syncLegacyFields(order, activeItems)
  order.adminEdited = true
  order.editHistory = [...(order.editHistory ?? []), logEntry]

  orders[idx] = order
  await writeFile(getOrdersPath(), JSON.stringify(orders, null, 2))
  return { success: true }
}
