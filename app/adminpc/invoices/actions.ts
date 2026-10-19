'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { isAdmin } from '@/lib/auth'
import {
  createInvoice,
  updateInvoice,
  updateInvoiceStatus,
  deleteInvoice,
  getInvoiceById,
  type CreateInvoiceInput,
  type UpdateInvoiceInput,
  type InvoiceStatus,
} from '@/lib/invoices'
import { sendInvoiceEmail } from '@/lib/invoice-email'

function revalidateInvoicePaths() {
  revalidatePath('/adminpc/invoices')
  revalidatePath('/adminpc/products')
  revalidatePath('/adminpc/dashboard')
  revalidatePath('/adminpc/orders')
}

export async function createInvoiceAction(input: CreateInvoiceInput) {
  const auth = await isAdmin()
  if (!auth) redirect('/adminpc')

  if (!input.buyer?.name?.trim() || !input.buyer?.phone?.trim() || !input.buyer?.address?.trim()) {
    return { success: false, error: 'შეავსეთ შემსყიდველის სახელი, ტელეფონი და მისამართი' }
  }

  const validItems = (input.items || []).filter(
    (item) => item.description?.trim() && item.quantity > 0 && item.unitPrice >= 0
  )
  if (validItems.length === 0) {
    return { success: false, error: 'დაამატეთ მინიმუმ ერთი საქონელი/პროდუქტი' }
  }

  try {
    const invoice = await createInvoice({
      ...input,
      items: validItems,
    })
    revalidateInvoicePaths()
    return { success: true, invoiceId: invoice.id }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'შეცდომა ინვოისის შექმნისას' }
  }
}

export async function updateInvoiceAction(id: string, input: UpdateInvoiceInput) {
  const auth = await isAdmin()
  if (!auth) redirect('/adminpc')

  try {
    const updated = await updateInvoice(id, input)
    if (!updated) {
      return { success: false, error: 'ინვოისი ვერ მოიძებნა' }
    }
    revalidateInvoicePaths()
    revalidatePath(`/adminpc/invoices/${id}`)
    return { success: true }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'შეცდომა რედაქტირებისას' }
  }
}

export async function setInvoiceStatusAction(id: string, status: InvoiceStatus) {
  const auth = await isAdmin()
  if (!auth) redirect('/adminpc')

  try {
    const success = await updateInvoiceStatus(id, status)
    if (!success) {
      return { success: false, error: 'ინვოისი ვერ მოიძებნა' }
    }
    revalidateInvoicePaths()
    revalidatePath(`/adminpc/invoices/${id}`)
    return { success: true }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'შეცდომა სტატუსის ცვლილებისას' }
  }
}

export async function deleteInvoiceAction(id: string) {
  const auth = await isAdmin()
  if (!auth) redirect('/adminpc')

  try {
    const success = await deleteInvoice(id)
    if (!success) {
      return { success: false, error: 'ინვოისი ვერ მოიძებნა' }
    }
    revalidateInvoicePaths()
    return { success: true }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'შეცდომა წაშლისას' }
  }
}

export async function sendInvoiceEmailAction(params: {
  invoiceId: string
  recipientEmail: string
  subject?: string
  message?: string
}) {
  const auth = await isAdmin()
  if (!auth) redirect('/adminpc')

  const recipient = params.recipientEmail?.trim()
  if (!recipient || !recipient.includes('@')) {
    return { success: false, error: 'მიუთითეთ სწორი ელ-ფოსტის მისამართი' }
  }

  const invoice = await getInvoiceById(params.invoiceId)
  if (!invoice) {
    return { success: false, error: 'ინვოისი ვერ მოიძებნა' }
  }

  const res = await sendInvoiceEmail({
    invoice,
    recipientEmail: recipient,
    subject: params.subject,
    message: params.message,
  })

  if (res.success) {
    // If buyer email was empty, update it
    if (!invoice.buyer.email) {
      await updateInvoice(invoice.id, {
        buyer: { email: recipient },
      })
      revalidatePath(`/adminpc/invoices/${invoice.id}`)
    }
  }

  return res
}

