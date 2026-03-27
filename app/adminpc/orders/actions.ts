'use server'

import { revalidatePath } from 'next/cache'
import { updateOrderStatus } from '@/lib/orders'
import type { OrderStatus } from '@/lib/orders'

export async function setOrderStatus(formData: FormData) {
  const id = formData.get('id') as string
  const status = formData.get('status') as OrderStatus
  if (id && (status === 'pending' || status === 'completed')) {
    await updateOrderStatus(id, status)
    revalidatePath('/adminpc/orders')
  }
}
