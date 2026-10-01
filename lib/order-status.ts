export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'completed'
  | 'cancelled'

export const ORDER_STATUSES: OrderStatus[] = [
  'pending',
  'confirmed',
  'processing',
  'shipped',
  'completed',
  'cancelled',
]

type StatusMeta = {
  label: string
  dotClass: string
  badgeClass: string
  description: string
}

export const ORDER_STATUS_META: Record<OrderStatus, StatusMeta> = {
  pending: {
    label: 'მოლოდინში',
    dotClass: 'bg-amber-500',
    badgeClass: 'bg-amber-100 text-amber-800 border-amber-200',
    description: 'ახალი შეკვეთა, ჯერ არ არის დამუშავებული',
  },
  confirmed: {
    label: 'დადასტურებული',
    dotClass: 'bg-blue-500',
    badgeClass: 'bg-blue-100 text-blue-800 border-blue-200',
    description: 'შეკვეთა დადასტურებულია',
  },
  processing: {
    label: 'მუშავდება',
    dotClass: 'bg-violet-500',
    badgeClass: 'bg-violet-100 text-violet-800 border-violet-200',
    description: 'შეკვეთა მზადდება გაგზავნისთვის',
  },
  shipped: {
    label: 'გაგზავნილი',
    dotClass: 'bg-cyan-500',
    badgeClass: 'bg-cyan-100 text-cyan-800 border-cyan-200',
    description: 'კურიერი გზაშია',
  },
  completed: {
    label: 'შესრულებული',
    dotClass: 'bg-green-500',
    badgeClass: 'bg-green-100 text-green-800 border-green-200',
    description: 'მიწოდება დასრულებულია',
  },
  cancelled: {
    label: 'გაუქმებული',
    dotClass: 'bg-red-500',
    badgeClass: 'bg-red-100 text-red-800 border-red-200',
    description: 'შეკვეთა გაუქმებულია',
  },
}

export function isValidOrderStatus(value: string): value is OrderStatus {
  return ORDER_STATUSES.includes(value as OrderStatus)
}

export function getOrderStatusMeta(status: string): StatusMeta {
  if (isValidOrderStatus(status)) return ORDER_STATUS_META[status]
  return ORDER_STATUS_META.pending
}

export function getOrderStatusLabel(status: string): string {
  return getOrderStatusMeta(status).label
}

export function isActiveOrderStatus(status: string): boolean {
  return status !== 'completed' && status !== 'cancelled'
}
