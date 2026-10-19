export type InvoiceStatus = 'pending' | 'paid' | 'cancelled'

export const INVOICE_STATUSES: InvoiceStatus[] = ['pending', 'paid', 'cancelled']

export const INVOICE_STATUS_META: Record<
  InvoiceStatus,
  { label: string; badgeClass: string; dotClass: string }
> = {
  pending: {
    label: 'გადასახდელი',
    badgeClass: 'border-amber-200 bg-amber-50 text-amber-700',
    dotClass: 'bg-amber-500',
  },
  paid: {
    label: 'გადახდილი',
    badgeClass: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    dotClass: 'bg-emerald-600',
  },
  cancelled: {
    label: 'გაუქმებული',
    badgeClass: 'border-muted bg-muted/60 text-muted-foreground',
    dotClass: 'bg-muted-foreground',
  },
}

export type InvoiceSeller = {
  name: string
  taxId: string
  address: string
  phone: string
  email?: string
}

export const DEFAULT_SELLER_DETAILS: InvoiceSeller = {
  name: 'ი/მ შოთა ჩხვრიკია',
  taxId: '62004025572',
  address: 'ზურაბ და მამუკა ბეროძეების ქუჩა',
  phone: '+995 595 94 74 50',
  email: 'info@femibion.ge',
}

export type InvoiceBuyer = {
  name: string
  taxId?: string
  phone: string
  address: string
  email?: string
}

export type InvoiceItem = {
  id: string
  productId?: string
  description: string
  quantity: number
  unitPrice: number
  total: number
}

export type Invoice = {
  id: string
  number: string
  orderId?: string
  date: string
  dueDate?: string
  seller: InvoiceSeller
  buyer: InvoiceBuyer
  items: InvoiceItem[]
  subtotal: number
  total: number
  status: InvoiceStatus
  stockApplied: boolean
  notes?: string
  createdAt: string
  updatedAt: string
}

export type BuyerSuggestion = {
  name: string
  phone: string
  address: string
  taxId?: string
  sourceOrderId?: string
}

export type CreateInvoiceInput = {
  number?: string
  orderId?: string
  date: string
  dueDate?: string
  seller?: Partial<InvoiceSeller>
  buyer: InvoiceBuyer
  items: Array<{
    productId?: string
    description: string
    quantity: number
    unitPrice: number
  }>
  status?: InvoiceStatus
  notes?: string
}

export type UpdateInvoiceInput = {
  number?: string
  date?: string
  dueDate?: string
  buyer?: Partial<InvoiceBuyer>
  items?: Array<{
    id?: string
    productId?: string
    description: string
    quantity: number
    unitPrice: number
  }>
  status?: InvoiceStatus
  notes?: string
}
