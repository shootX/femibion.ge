'use server'

import { addOrder } from '@/lib/orders'
import { sendOrderEmail } from '@/lib/email'
import { sendOrderSms } from '@/lib/sms'
import { getDeliveryFee } from '@/lib/georgia-cities'
import { toUbillNumber } from '@/lib/phone'

export type OrderLineItem = {
  productId: string
  label: string
  qty: number
  unitPrice?: number
}

export type SubmitOrderInput = {
  name: string
  phone: string
  city: string
  address: string
  shippingFee?: number
  productsTotal?: number
  total?: number
  items: OrderLineItem[]
  acceptedTerms?: boolean
}

export async function submitOrder(input: SubmitOrderInput): Promise<{ success: boolean; error?: string; orderId?: string }> {
  if (input.acceptedTerms !== true) {
    return { success: false, error: 'საჭიროა წესებსა და კონფიდენციალურობის პოლიტიკაზე თანხმობა' }
  }

  if (!input.name?.trim() || !input.phone?.trim() || !input.city?.trim() || !input.address?.trim()) {
    return { success: false, error: 'შეავსეთ ყველა ველი' }
  }

  const phone = toUbillNumber(input.phone)
  if (!phone) {
    return { success: false, error: 'ტელეფონის ნომერი არასწორია (5XX XXX XXX)' }
  }

  const items = input.items.filter((i) => i.qty > 0)
  if (items.length === 0) {
    return { success: false, error: 'აირჩიეთ მინიმუმ ერთი პროდუქტი' }
  }

  const city = input.city.trim()
  const street = input.address.trim()
  const shippingFee = getDeliveryFee(city)
  const productsTotal = items.reduce((sum, i) => sum + i.qty * (i.unitPrice ?? 0), 0)
  const total = productsTotal + shippingFee
  const fullAddress = `${city}, ${street}`

  try {
    const order = await addOrder({
      name: input.name.trim(),
      phone,
      city,
      address: fullAddress,
      shippingFee,
      productsTotal,
      total,
      lineItems: items.map(({ productId, label, qty }) => ({ productId, label, qty })),
      product1Qty: items[0]?.qty ?? 0,
      product2Qty: items[1]?.qty ?? 0,
      product1Label: items[0]?.label ?? '',
      product2Label: items[1]?.label ?? '',
    })
    await Promise.all([sendOrderEmail(order), sendOrderSms(order)])
    return { success: true, orderId: order.id }
  } catch (e) {
    console.error('Order submit error:', e)
    return { success: false, error: 'შეკვეთა ვერ შენახეს' }
  }
}
