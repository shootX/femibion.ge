import { readFile, writeFile } from 'fs/promises'
import { join } from 'path'
import { unstable_noStore } from 'next/cache'

export type OrderStatus = 'pending' | 'completed'

export type Order = {
  id: string
  name: string
  phone: string
  address: string
  product1Qty: number
  product2Qty: number
  product1Label: string
  product2Label: string
  status: OrderStatus
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
  const orders = await getOrders()
  const idx = orders.findIndex((o) => o.id === id)
  if (idx === -1) return false
  orders[idx].status = status
  await writeFile(getOrdersPath(), JSON.stringify(orders, null, 2))
  return true
}
