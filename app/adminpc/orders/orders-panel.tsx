'use client'

import { useMemo, useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Search,
  Package,
  Trash2,
  SlidersHorizontal,
  X,
  Eye,
  CheckSquare,
} from 'lucide-react'
import { bulkDeleteOrders, bulkSetOrderStatus } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { formatGeorgiaDateTime } from '@/lib/georgia-time'
import { formatPhoneDisplay } from '@/lib/phone'
import { getOrderProductLines, getOrderShortId, getOrderTotalQty, isAdminCreatedOrder } from '@/lib/order-display'
import {
  ORDER_STATUSES,
  ORDER_STATUS_META,
  getOrderStatusMeta,
  isActiveOrderStatus,
  type OrderStatus,
} from '@/lib/order-status'
import type { Order } from '@/lib/orders'
import { cn } from '@/lib/utils'
import { setOrderStatus } from './actions'
import { AdminOrderBadge } from './admin-order-badge'

type StatusFilter = 'all' | OrderStatus
type DateFilter = 'all' | 'today' | 'week' | 'month'
type SortBy = 'newest' | 'oldest' | 'name'

const DATE_FILTER_LABELS: Record<DateFilter, string> = {
  all: 'ყველა დრო',
  today: 'დღეს',
  week: 'ბოლო 7 დღე',
  month: 'ბოლო 30 დღე',
}

const SORT_LABELS: Record<SortBy, string> = {
  newest: 'უახლესი პირველი',
  oldest: 'უძველესი პირველი',
  name: 'სახელი (ა-ჰ)',
}

function matchesSearch(order: Order, query: string): boolean {
  const q = query.trim().toLowerCase()
  if (!q) return true
  const haystack = [
    order.name,
    order.phone,
    order.address,
    order.id,
    getOrderShortId(order),
    ...getOrderProductLines(order),
  ]
    .join(' ')
    .toLowerCase()
  return haystack.includes(q)
}

function matchesDate(order: Order, filter: DateFilter): boolean {
  if (filter === 'all') return true
  const created = new Date(order.createdAt).getTime()
  const now = Date.now()
  const day = 24 * 60 * 60 * 1000
  if (filter === 'today') return now - created < day
  if (filter === 'week') return now - created < 7 * day
  return now - created < 30 * day
}

function sortOrders(orders: Order[], sortBy: SortBy): Order[] {
  const sorted = [...orders]
  if (sortBy === 'newest') {
    return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }
  if (sortBy === 'oldest') {
    return sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
  }
  return sorted.sort((a, b) => a.name.localeCompare(b.name, 'ka'))
}

function isValidStatus(value: string): value is OrderStatus {
  return ORDER_STATUSES.includes(value as OrderStatus)
}

function StatusBadge({ status }: { status: string }) {
  const meta = getOrderStatusMeta(status)
  return (
    <Badge variant="outline" className={cn('font-medium', meta.badgeClass)}>
      <span className={cn('h-1.5 w-1.5 rounded-full', meta.dotClass)} />
      {meta.label}
    </Badge>
  )
}

function OrderStatusSelect({
  orderId,
  status,
  onUpdated,
}: {
  orderId: string
  status: string
  onUpdated?: () => void
}) {
  const [pending, startTransition] = useTransition()
  const current = isValidStatus(status) ? status : 'pending'

  const handleChange = (next: string) => {
    if (!isValidStatus(next) || next === current) return
    const fd = new FormData()
    fd.set('id', orderId)
    fd.set('status', next)
    startTransition(async () => {
      await setOrderStatus(fd)
      onUpdated?.()
    })
  }

  return (
    <Select value={current} onValueChange={handleChange} disabled={pending}>
      <SelectTrigger size="sm" className="w-[150px]">
        <SelectValue placeholder="სტატუსი" />
      </SelectTrigger>
      <SelectContent>
        {ORDER_STATUSES.map((s) => (
          <SelectItem key={s} value={s}>
            {ORDER_STATUS_META[s].label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

function BulkActionBar({
  selectedIds,
  onClear,
  onDone,
}: {
  selectedIds: Set<string>
  onClear: () => void
  onDone: () => void
}) {
  const [bulkStatus, setBulkStatus] = useState<OrderStatus>('confirmed')
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [pending, startTransition] = useTransition()
  const selectedCount = selectedIds.size
  const ids = Array.from(selectedIds)

  const handleStatusChange = () => {
    startTransition(async () => {
      await bulkSetOrderStatus(ids, bulkStatus)
      onDone()
    })
  }

  const handleDelete = () => {
    startTransition(async () => {
      await bulkDeleteOrders(ids)
      setDeleteOpen(false)
      onDone()
    })
  }

  if (selectedCount === 0) return null

  return (
    <>
      <div className="sticky bottom-4 z-20 mx-auto flex max-w-3xl flex-col gap-3 rounded-xl border bg-background/95 p-4 shadow-lg backdrop-blur sm:flex-row sm:items-center">
        <div className="flex items-center gap-2 text-sm font-medium">
          <CheckSquare className="h-4 w-4 text-primary" />
          {selectedCount} შეკვეთა არჩეულია
        </div>
        <div className="flex flex-1 flex-wrap items-center gap-2 sm:justify-end">
          <Select value={bulkStatus} onValueChange={(v) => setBulkStatus(v as OrderStatus)}>
            <SelectTrigger size="sm" className="w-[160px]">
              <SelectValue placeholder="ახალი სტატუსი" />
            </SelectTrigger>
            <SelectContent>
              {ORDER_STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {ORDER_STATUS_META[s].label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button type="button" size="sm" onClick={handleStatusChange} disabled={pending}>
            სტატუსის შეცვლა
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="text-destructive hover:bg-destructive/10"
            onClick={() => setDeleteOpen(true)}
            disabled={pending}
          >
            <Trash2 className="mr-1 h-4 w-4" />
            წაშლა
          </Button>
          <Button type="button" size="sm" variant="ghost" onClick={onClear} disabled={pending}>
            გასუფთავება
          </Button>
        </div>
      </div>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>არჩეული შეკვეთების წაშლა</AlertDialogTitle>
            <AlertDialogDescription>
              {selectedCount} შეკვეთა სამუდამოდ წაიშლება. ეს მოქმედება ვერ გაუქმდება.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={pending}>გაუქმება</AlertDialogCancel>
            <Button variant="destructive" onClick={handleDelete} disabled={pending}>
              {pending ? 'იშლება...' : 'წაშლა'}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export function OrdersPanel({ orders }: { orders: Order[] }) {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [dateFilter, setDateFilter] = useState<DateFilter>('all')
  const [sortBy, setSortBy] = useState<SortBy>('newest')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { all: orders.length }
    for (const s of ORDER_STATUSES) counts[s] = 0
    for (const o of orders) {
      const key = isValidStatus(o.status) ? o.status : 'pending'
      counts[key] = (counts[key] || 0) + 1
    }
    return counts
  }, [orders])

  const activeCount = useMemo(
    () => orders.filter((o) => isActiveOrderStatus(o.status)).length,
    [orders],
  )

  const filteredOrders = useMemo(() => {
    const result = orders.filter(
      (o) =>
        matchesSearch(o, search) &&
        matchesDate(o, dateFilter) &&
        (statusFilter === 'all' || o.status === statusFilter),
    )
    return sortOrders(result, sortBy)
  }, [orders, search, statusFilter, dateFilter, sortBy])

  const filteredIds = useMemo(() => filteredOrders.map((o) => o.id), [filteredOrders])
  const allFilteredSelected =
    filteredIds.length > 0 && filteredIds.every((id) => selectedIds.has(id))
  const someFilteredSelected = filteredIds.some((id) => selectedIds.has(id))

  const hasFilters = search || statusFilter !== 'all' || dateFilter !== 'all'

  const toggleOne = (id: string, checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (checked) next.add(id)
      else next.delete(id)
      return next
    })
  }

  const toggleAllFiltered = (checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (checked) filteredIds.forEach((id) => next.add(id))
      else filteredIds.forEach((id) => next.delete(id))
      return next
    })
  }

  const clearFilters = () => {
    setSearch('')
    setStatusFilter('all')
    setDateFilter('all')
    setSortBy('newest')
  }

  const clearSelection = () => setSelectedIds(new Set())

  const onBulkDone = () => {
    clearSelection()
    router.refresh()
  }

  return (
    <div className="space-y-6 pb-20">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>სულ შეკვეთები</CardDescription>
            <CardTitle className="text-2xl">{orders.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>აქტიური შეკვეთები</CardDescription>
            <CardTitle className="text-2xl text-amber-600">{activeCount}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>მოლოდინში</CardDescription>
            <CardTitle className="text-2xl">{statusCounts.pending || 0}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>შესრულებული</CardDescription>
            <CardTitle className="text-2xl text-green-600">{statusCounts.completed || 0}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader className="space-y-4">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>შეკვეთების სია</CardTitle>
              <CardDescription>
                ნაჩვენებია {filteredOrders.length} შეკვეთა {hasFilters ? '(ფილტრირებული)' : '(სულ)'}
              </CardDescription>
            </div>
            {hasFilters && (
              <Button type="button" variant="ghost" size="sm" onClick={clearFilters}>
                <X className="mr-1 h-4 w-4" />
                ფილტრების გასუფთავება
              </Button>
            )}
          </div>

          <div className="flex flex-col gap-3 lg:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ძებნა სახელით, ტელეფონით, მისამართით ან შეკვეთის ნომრით..."
                className="pl-9"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Select value={dateFilter} onValueChange={(v) => setDateFilter(v as DateFilter)}>
                <SelectTrigger className="w-[160px]">
                  <SlidersHorizontal className="h-4 w-4" />
                  <SelectValue>{DATE_FILTER_LABELS[dateFilter]}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(DATE_FILTER_LABELS) as DateFilter[]).map((key) => (
                    <SelectItem key={key} value={key}>
                      {DATE_FILTER_LABELS[key]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortBy)}>
                <SelectTrigger className="w-[170px]">
                  <SelectValue>{SORT_LABELS[sortBy]}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(SORT_LABELS) as SortBy[]).map((key) => (
                    <SelectItem key={key} value={key}>
                      {SORT_LABELS[key]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1">
            <FilterChip
              active={statusFilter === 'all'}
              label="ყველა"
              count={statusCounts.all}
              onClick={() => setStatusFilter('all')}
            />
            {ORDER_STATUSES.map((status) => (
              <FilterChip
                key={status}
                active={statusFilter === status}
                label={ORDER_STATUS_META[status].label}
                count={statusCounts[status] || 0}
                dotClass={ORDER_STATUS_META[status].dotClass}
                onClick={() => setStatusFilter(status)}
              />
            ))}
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {filteredOrders.length === 0 ? (
            <div className="flex flex-col items-center gap-2 p-12 text-center text-muted-foreground">
              <Package className="h-8 w-8 opacity-20" />
              <p className="font-medium text-foreground">
                {orders.length === 0 ? 'შეკვეთები ჯერ არ არის' : 'შედეგი ვერ მოიძებნა'}
              </p>
              <p className="text-sm">
                {orders.length === 0
                  ? 'ახალი შეკვეთები აქ გამოჩნდება საიტიდან შეკვეთის შემდეგ.'
                  : 'სცადეთ სხვა ფილტრი ან გაასუფთავეთ ძებნა.'}
              </p>
            </div>
          ) : (
            <>
              <div className="hidden lg:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-10">
                        <Checkbox
                          checked={allFilteredSelected ? true : someFilteredSelected ? 'indeterminate' : false}
                          onCheckedChange={(v) => toggleAllFiltered(v === true)}
                          aria-label="ყველა შეკვეთის მონიშვნა"
                        />
                      </TableHead>
                      <TableHead>შეკვეთის ნომერი</TableHead>
                      <TableHead>მომხმარებელი</TableHead>
                      <TableHead>მისამართი / პროდუქტი</TableHead>
                      <TableHead className="text-center">რაოდენობა</TableHead>
                      <TableHead>სტატუსი</TableHead>
                      <TableHead className="text-right">მოქმედებები</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.map((order) => (
                      <TableRow
                        key={order.id}
                        className={cn(selectedIds.has(order.id) && 'bg-primary/5')}
                      >
                        <TableCell>
                          <Checkbox
                            checked={selectedIds.has(order.id)}
                            onCheckedChange={(v) => toggleOne(order.id, v === true)}
                            aria-label={`შეკვეთა ${getOrderShortId(order)}`}
                          />
                        </TableCell>
                        <TableCell>
                          <Link
                            href={`/adminpc/orders/${order.id}`}
                            className="font-medium hover:text-primary hover:underline"
                          >
                            #{getOrderShortId(order)}
                          </Link>
                          {isAdminCreatedOrder(order) && <AdminOrderBadge className="mt-1" />}
                          {order.adminEdited && !isAdminCreatedOrder(order) && (
                            <Badge variant="outline" className="mt-1 border-amber-200 bg-amber-50 text-[10px] text-amber-800">
                              რედაქტირებული
                            </Badge>
                          )}
                          <div className="text-xs text-muted-foreground">
                            {formatGeorgiaDateTime(order.createdAt, { withSeconds: false, padDayMonth: true })}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{order.name}</div>
                          <div className="text-xs text-muted-foreground">{formatPhoneDisplay(order.phone)}</div>
                        </TableCell>
                        <TableCell className="max-w-[240px]">
                          <div className="truncate text-xs text-muted-foreground" title={order.address}>
                            {order.address}
                          </div>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {getOrderProductLines(order).slice(0, 2).map((p, i) => (
                              <span key={i} className="rounded bg-muted px-1.5 py-0.5 text-[10px]">
                                {p}
                              </span>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="text-center font-semibold">
                          {getOrderTotalQty(order)} ცალი
                        </TableCell>
                        <TableCell>
                          <OrderStatusSelect
                            orderId={order.id}
                            status={order.status}
                            onUpdated={() => router.refresh()}
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          <Button asChild variant="ghost" size="sm">
                            <Link href={`/adminpc/orders/${order.id}`}>
                              <Eye className="mr-1 h-4 w-4" />
                              დეტალები
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="divide-y lg:hidden">
                <div className="flex items-center gap-3 border-b bg-muted/30 px-4 py-3">
                  <Checkbox
                    checked={allFilteredSelected ? true : someFilteredSelected ? 'indeterminate' : false}
                    onCheckedChange={(v) => toggleAllFiltered(v === true)}
                    aria-label="ყველა შეკვეთის მონიშვნა"
                  />
                  <span className="text-sm text-muted-foreground">ყველას მონიშვნა</span>
                </div>
                {filteredOrders.map((order) => (
                  <div
                    key={order.id}
                    className={cn('space-y-3 p-4', selectedIds.has(order.id) && 'bg-primary/5')}
                  >
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={selectedIds.has(order.id)}
                        onCheckedChange={(v) => toggleOne(order.id, v === true)}
                        className="mt-1"
                        aria-label={`შეკვეთა ${getOrderShortId(order)}`}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <Link
                              href={`/adminpc/orders/${order.id}`}
                              className="font-semibold hover:text-primary hover:underline"
                            >
                              {order.name}
                            </Link>
                            <div className="text-xs text-muted-foreground">
                              #{getOrderShortId(order)} ·{' '}
                              {formatGeorgiaDateTime(order.createdAt, { withSeconds: false, padDayMonth: true })}
                              {order.adminEdited && ' · რედაქტირებული'}
                            </div>
                          </div>
                          <StatusBadge status={order.status} />
                          {isAdminCreatedOrder(order) && <AdminOrderBadge />}
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{order.address}</p>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {getOrderProductLines(order).map((p, i) => (
                            <span key={i} className="rounded bg-muted px-2 py-0.5 text-xs">
                              {p}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 pl-7">
                      <OrderStatusSelect
                        orderId={order.id}
                        status={order.status}
                        onUpdated={() => router.refresh()}
                      />
                      <Button asChild variant="outline" size="sm" className="ml-auto">
                        <Link href={`/adminpc/orders/${order.id}`}>დეტალები</Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <BulkActionBar
        selectedIds={selectedIds}
        onClear={clearSelection}
        onDone={onBulkDone}
      />
    </div>
  )
}

function FilterChip({
  active,
  label,
  count,
  dotClass,
  onClick,
}: {
  active: boolean
  label: string
  count: number
  dotClass?: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
        active
          ? 'border-primary bg-primary text-primary-foreground'
          : 'border-border bg-background text-foreground hover:bg-muted',
      )}
    >
      {dotClass && <span className={cn('h-1.5 w-1.5 rounded-full', dotClass)} />}
      {label}
      <span className={cn('rounded-full px-1.5 py-0.5 text-[10px]', active ? 'bg-primary-foreground/20' : 'bg-muted')}>
        {count}
      </span>
    </button>
  )
}
