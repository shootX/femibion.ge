'use server'

import { addOrder } from '@/lib/orders'
import { sendOrderEmail } from '@/lib/email'

export type SubmitOrderInput = {
  name: string
  phone: string
  address: string
  product1Qty: number
  product2Qty: number
  product1Label: string
  product2Label: string
}

export async function submitOrder(input: SubmitOrderInput): Promise<{ success: boolean; error?: string }> {
  if (!input.name?.trim() || !input.phone?.trim() || !input.address?.trim()) {
    return { success: false, error: 'შეავსეთ ყველა ველი' }
  }
  if (input.product1Qty <= 0 && input.product2Qty <= 0) {
    return { success: false, error: 'აირჩიეთ მინიმუმ ერთი პროდუქტი' }
  }

  try {
    const order = await addOrder({
      name: input.name.trim(),
      phone: input.phone.trim(),
      address: input.address.trim(),
      product1Qty: input.product1Qty || 0,
      product2Qty: input.product2Qty || 0,
      product1Label: input.product1Label || 'Femibion 1',
      product2Label: input.product2Label || 'Femibion 2',
    })
    await sendOrderEmail(order)
    return { success: true }
  } catch (e) {
    console.error('Order submit error:', e)
    return { success: false, error: 'შეკვეთა ვერ შენახეს' }
  }
}
