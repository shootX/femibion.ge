'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { isAdmin } from '@/lib/auth'
import { bulkRemoveOrders, bulkUpdateOrderStatus, addOrder, removeOrder, updateOrderQuantities, updateOrderStatus } from '@/lib/orders'
import type { OrderLineItem, OrderStatus } from '@/lib/orders'
import { isValidOrderStatus } from '@/lib/order-status'
import { toUbillNumber } from '@/lib/phone'

function revalidateOrderPaths() {
  revalidatePath('/adminpc/orders')
  revalidatePath('/adminpc/products')
  revalidatePath('/adminpc/dashboard')
}

export async function setOrderStatus(formData: FormData) {
  const auth = await isAdmin()
  if (!auth) redirect('/adminpc')

  const id = (formData.get('id') as string)?.trim()
  const status = formData.get('status') as OrderStatus
  if (id && isValidOrderStatus(status)) {
    await updateOrderStatus(id, status)
    revalidateOrderPaths()
    revalidatePath(`/adminpc/orders/${id}`)
  }
}

export async function deleteOrder(formData: FormData) {
  const auth = await isAdmin()
  if (!auth) redirect('/adminpc')

  const id = (formData.get('id') as string)?.trim()
  if (!id) return

  await removeOrder(id)
  revalidateOrderPaths()
}

export async function bulkSetOrderStatus(ids: string[], status: OrderStatus) {
  const auth = await isAdmin()
  if (!auth) redirect('/adminpc')
  if (!isValidOrderStatus(status) || ids.length === 0) return { updated: 0 }

  const updated = await bulkUpdateOrderStatus(ids, status)
  revalidateOrderPaths()
  return { updated }
}

export async function bulkDeleteOrders(ids: string[]) {
  const auth = await isAdmin()
  if (!auth) redirect('/adminpc')
  if (ids.length === 0) return { removed: 0 }

  const removed = await bulkRemoveOrders(ids)
  revalidateOrderPaths()
  return { removed }
}

export async function saveOrderQuantities(
  orderId: string,
  quantities: { productId: string; qty: number }[],
) {
  const auth = await isAdmin()
  if (!auth) redirect('/adminpc')

  const result = await updateOrderQuantities(orderId, quantities)
  if (result.success) {
    revalidateOrderPaths()
    revalidatePath(`/adminpc/orders/${orderId}`)
  }
  return result
}

export async function createAdminOrder(input: {
  name: string
  phone: string
  address: string
  items: OrderLineItem[]
}) {
  const auth = await isAdmin()
  if (!auth) redirect('/adminpc')

  const name = input.name?.trim()
  const phone = toUbillNumber(input.phone || '')
  const address = input.address?.trim()
  const items = input.items.filter((i) => i.qty > 0)

  if (!name || !address) {
    return { success: false, error: 'შეავსეთ სახელი, ტელეფონი და მისამართი' }
  }
  if (!phone) {
    return { success: false, error: 'ტელეფონის ნომერი არასწორია (9955XXXXXXXX)' }
  }
  if (items.length === 0) {
    return { success: false, error: 'აირჩიეთ მინიმუმ ერთი პროდუქტი' }
  }

  const order = await addOrder({
    name,
    phone,
    address,
    lineItems: items,
    product1Qty: items[0]?.qty ?? 0,
    product2Qty: items[1]?.qty ?? 0,
    product1Label: items[0]?.label ?? '',
    product2Label: items[1]?.label ?? '',
    createdBy: 'admin',
  })

  revalidateOrderPaths()
  return { success: true, orderId: order.id }
}
