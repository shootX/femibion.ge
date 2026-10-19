import { readFile, writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { unstable_noStore } from 'next/cache'
import { adjustStockByLineItems, type StockLineItem } from '@/lib/products'
import { getOrders } from '@/lib/orders'
import {
  type Invoice,
  type InvoiceStatus,
  type InvoiceItem,
  type InvoiceSeller,
  type InvoiceBuyer,
  type BuyerSuggestion,
  type CreateInvoiceInput,
  type UpdateInvoiceInput,
  DEFAULT_SELLER_DETAILS,
} from './invoice-types'

export * from './invoice-types'

const INVOICES_FILE = 'data/invoices.json'

function getDataDir(): string {
  return join(process.env.PWD || process.cwd(), 'data')
}

function getInvoicesPath(): string {
  return join(getDataDir(), 'invoices.json')
}

export async function getInvoices(): Promise<Invoice[]> {
  unstable_noStore()
  try {
    const filePath = getInvoicesPath()
    const content = await readFile(filePath, 'utf-8')
    const invoices = JSON.parse(content) as Invoice[]
    return Array.isArray(invoices)
      ? invoices.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      : []
  } catch {
    return []
  }
}

export async function getInvoiceById(id: string): Promise<Invoice | null> {
  const invoices = await getInvoices()
  return invoices.find((inv) => inv.id === id) || null
}

export async function getNextInvoiceNumber(): Promise<string> {
  const invoices = await getInvoices()
  const year = new Date().getFullYear()
  let maxSeq = 0

  for (const inv of invoices) {
    const match = inv.number.match(/INV-(\d{4})-(\d+)/)
    if (match) {
      const invYear = Number(match[1])
      const seq = Number(match[2])
      if (invYear === year && seq > maxSeq) {
        maxSeq = seq
      }
    } else {
      const simpleMatch = inv.number.match(/INV-(\d+)/)
      if (simpleMatch) {
        const seq = Number(simpleMatch[1])
        if (seq > maxSeq) maxSeq = seq
      }
    }
  }

  const nextSeq = String(maxSeq + 1).padStart(4, '0')
  return `INV-${year}-${nextSeq}`
}

function mapToStockLineItems(items: InvoiceItem[]): StockLineItem[] {
  return items
    .filter((item) => item.quantity > 0)
    .map((item) => ({
      productId: item.productId,
      label: item.description,
      qty: Math.floor(item.quantity),
    }))
}

async function writeInvoicesFile(invoices: Invoice[]): Promise<void> {
  await mkdir(getDataDir(), { recursive: true })
  await writeFile(getInvoicesPath(), JSON.stringify(invoices, null, 2), 'utf-8')
}

export async function createInvoice(input: CreateInvoiceInput): Promise<Invoice> {
  const invoices = await getInvoices()
  const now = new Date().toISOString()
  const id = `inv_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
  const number = input.number?.trim() || (await getNextInvoiceNumber())

  const items: InvoiceItem[] = input.items.map((item, idx) => {
    const qty = Math.max(1, Math.floor(Number(item.quantity) || 1))
    const unitPrice = Math.max(0, Number(item.unitPrice) || 0)
    return {
      id: `item_${idx + 1}`,
      productId: item.productId?.trim() || undefined,
      description: item.description?.trim() || `საქონელი #${idx + 1}`,
      quantity: qty,
      unitPrice,
      total: Math.round(qty * unitPrice * 100) / 100,
    }
  })

  const total = items.reduce((sum, item) => sum + item.total, 0)
  const status = input.status || 'pending'
  const isPaid = status === 'paid'

  if (isPaid) {
    const stockItems = mapToStockLineItems(items)
    await adjustStockByLineItems(stockItems, 'deduct')
  }

  const invoice: Invoice = {
    id,
    number,
    orderId: input.orderId?.trim() || undefined,
    date: input.date?.trim() || new Date().toISOString().slice(0, 10),
    dueDate: input.dueDate?.trim() || undefined,
    seller: {
      ...DEFAULT_SELLER_DETAILS,
      ...input.seller,
    },
    buyer: {
      name: input.buyer.name.trim(),
      taxId: input.buyer.taxId?.trim() || undefined,
      phone: input.buyer.phone.trim(),
      address: input.buyer.address.trim(),
      email: input.buyer.email?.trim() || undefined,
    },
    items,
    subtotal: total,
    total,
    status,
    stockApplied: isPaid,
    notes: input.notes?.trim() || undefined,
    createdAt: now,
    updatedAt: now,
  }

  invoices.unshift(invoice)
  await writeInvoicesFile(invoices)
  return invoice
}

export async function updateInvoice(
  id: string,
  input: UpdateInvoiceInput
): Promise<Invoice | null> {
  const invoices = await getInvoices()
  const idx = invoices.findIndex((inv) => inv.id === id)
  if (idx === -1) return null

  const existing = invoices[idx]
  const targetStatus = input.status ?? existing.status

  let newItems = existing.items
  if (input.items) {
    newItems = input.items.map((item, i) => {
      const qty = Math.max(1, Math.floor(Number(item.quantity) || 1))
      const unitPrice = Math.max(0, Number(item.unitPrice) || 0)
      return {
        id: item.id || `item_${i + 1}`,
        productId: item.productId?.trim() || undefined,
        description: item.description?.trim() || `საქონელი #${i + 1}`,
        quantity: qty,
        unitPrice,
        total: Math.round(qty * unitPrice * 100) / 100,
      }
    })
  }

  const wasPaid = existing.status === 'paid'
  const willBePaid = targetStatus === 'paid'
  let stockApplied = existing.stockApplied

  if (!wasPaid && willBePaid && !stockApplied) {
    // სტატუსი გახდა გადახდილი - აკლდება რაოდენობას
    await adjustStockByLineItems(mapToStockLineItems(newItems), 'deduct')
    stockApplied = true
  } else if (wasPaid && !willBePaid && stockApplied) {
    // სტატუსი შეიცვალა გადახდილიდან - უბრუნდება რაოდენობას
    await adjustStockByLineItems(mapToStockLineItems(existing.items), 'restore')
    stockApplied = false
  } else if (wasPaid && willBePaid && stockApplied && input.items) {
    // თუ უკვე გადახდილი იყო და რაოდენობები შეიცვალა, ძველი ბრუნდება და ახალი აკლდება
    await adjustStockByLineItems(mapToStockLineItems(existing.items), 'restore')
    await adjustStockByLineItems(mapToStockLineItems(newItems), 'deduct')
  }

  const total = newItems.reduce((sum, item) => sum + item.total, 0)
  const updated: Invoice = {
    ...existing,
    number: input.number?.trim() || existing.number,
    date: input.date?.trim() || existing.date,
    dueDate: input.dueDate !== undefined ? input.dueDate?.trim() || undefined : existing.dueDate,
    buyer: {
      ...existing.buyer,
      ...(input.buyer || {}),
    },
    items: newItems,
    subtotal: total,
    total,
    status: targetStatus,
    stockApplied,
    notes: input.notes !== undefined ? input.notes?.trim() || undefined : existing.notes,
    updatedAt: new Date().toISOString(),
  }

  invoices[idx] = updated
  await writeInvoicesFile(invoices)
  return updated
}

export async function updateInvoiceStatus(
  id: string,
  status: InvoiceStatus
): Promise<boolean> {
  const result = await updateInvoice(id, { status })
  return !!result
}

export async function deleteInvoice(id: string): Promise<boolean> {
  const invoices = await getInvoices()
  const idx = invoices.findIndex((inv) => inv.id === id)
  if (idx === -1) return false

  const existing = invoices[idx]
  // თუ გადახდილი იყო და მარაგზე ასახული, წაშლისას ვაბრუნებთ მარაგში
  if (existing.stockApplied && existing.status === 'paid') {
    await adjustStockByLineItems(mapToStockLineItems(existing.items), 'restore')
  }

  const filtered = invoices.filter((inv) => inv.id !== id)
  await writeInvoicesFile(filtered)
  return true
}

/**
 * შემსყიდველების ავტომატური არჩევისთვის:
 * იღებს კლიენტებს არსებული შეკვეთებიდან და ადრე გამოწერილი ინვოისებიდან
 */
export async function getBuyerSuggestions(): Promise<BuyerSuggestion[]> {
  const [orders, invoices] = await Promise.all([getOrders(), getInvoices()])
  const suggestionsMap = new Map<string, BuyerSuggestion>()

  // 1. ინვოისებიდან
  for (const inv of invoices) {
    const key = (inv.buyer.phone || inv.buyer.name).trim().toLowerCase()
    if (key && !suggestionsMap.has(key)) {
      suggestionsMap.set(key, {
        name: inv.buyer.name,
        phone: inv.buyer.phone,
        address: inv.buyer.address,
        taxId: inv.buyer.taxId,
        sourceOrderId: inv.orderId,
      })
    }
  }

  // 2. შეკვეთებიდან
  for (const order of orders) {
    const key = (order.phone || order.name).trim().toLowerCase()
    if (key && !suggestionsMap.has(key)) {
      suggestionsMap.set(key, {
        name: order.name,
        phone: order.phone,
        address: order.address,
        sourceOrderId: order.id,
      })
    }
  }

  return Array.from(suggestionsMap.values())
}
