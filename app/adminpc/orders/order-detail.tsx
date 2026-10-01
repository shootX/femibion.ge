'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Calendar,
  Copy,
  Check,
  Hash,
  MapPin,
  Phone,
  Trash2,
  User,
} from 'lucide-react'
import { deleteOrder, setOrderStatus } from './actions'
import { formatPhoneDisplay, toUbillNumber } from '@/lib/phone'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
import { getOrderShortId, getOrderTotalQty, isAdminCreatedOrder } from '@/lib/order-display'
import { ORDER_STATUSES, ORDER_STATUS_META, getOrderStatusMeta } from '@/lib/order-status'
import type { Order, OrderStatus } from '@/lib/orders'
import { cn } from '@/lib/utils'
import { OrderQuantityEditor } from './order-quantity-editor'
import { AdminOrderBadge } from './admin-order-badge'

function StatusBadge({ status }: { status: string }) {
  const meta = getOrderStatusMeta(status)
  return (
    <Badge variant="outline" className={cn('font-medium', meta.badgeClass)}>
      <span className={cn('h-1.5 w-1.5 rounded-full', meta.dotClass)} />
      {meta.label}
    </Badge>
  )
}

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <Button type="button" variant="outline" size="sm" onClick={handleCopy} className="shrink-0">
      {copied ? (
        <>
          <Check className="mr-1 h-4 w-4" />
          დაკოპირდა
        </>
      ) : (
        <>
          <Copy className="mr-1 h-4 w-4" />
          {label}
        </>
      )}
    </Button>
  )
}

function OrderStatusSelect({ orderId, status }: { orderId: string; status: string }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const current = ORDER_STATUSES.includes(status as OrderStatus) ? (status as OrderStatus) : 'pending'

  const handleChange = (next: string) => {
    if (!ORDER_STATUSES.includes(next as OrderStatus) || next === current) return
    const fd = new FormData()
    fd.set('id', orderId)
    fd.set('status', next)
    startTransition(async () => {
      await setOrderStatus(fd)
      router.refresh()
    })
  }

  return (
    <Select value={current} onValueChange={handleChange} disabled={pending}>
      <SelectTrigger className="w-full sm:w-[200px]">
        <SelectValue placeholder="აირჩიე სტატუსი" />
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

export function OrderDetailView({ order }: { order: Order }) {
  const router = useRouter()
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleting, startDelete] = useTransition()

  const date = formatGeorgiaDateTime(order.createdAt, { withSeconds: true, padDayMonth: true })
  const phone = formatPhoneDisplay(order.phone)
  const shortId = getOrderShortId(order)
  const statusMeta = getOrderStatusMeta(order.status)

  const handleDelete = () => {
    startDelete(async () => {
      const fd = new FormData()
      fd.set('id', order.id)
      await deleteOrder(fd)
      setDeleteOpen(false)
      router.push('/adminpc/orders')
      router.refresh()
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <Button asChild variant="ghost" size="sm" className="-ml-2 w-fit">
            <Link href="/adminpc/orders">
              <ArrowLeft className="mr-1 h-4 w-4" />
              უკან შეკვეთებზე
            </Link>
          </Button>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">შეკვეთა #{shortId}</h1>
            <StatusBadge status={order.status} />
            {isAdminCreatedOrder(order) && <AdminOrderBadge />}
            {order.adminEdited && (
              <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-800">
                ადმინმა დაარედაქტირა
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">{statusMeta.description}</p>
          {isAdminCreatedOrder(order) && (
            <p className="text-sm text-violet-700">
              ეს შეკვეთა ადმინისტრატორმა შექმნა ხელით საიტის ფორმის გარეშე.
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <User className="h-4 w-4" />
              მომხმარებლის ინფორმაცია
            </CardTitle>
            <CardDescription>საკონტაქტო და მიწოდების მონაცემები</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-xs font-medium text-muted-foreground">სახელი და გვარი</p>
              <p className="mt-1 text-lg font-semibold">{order.name}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">ტელეფონი</p>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <a href={`tel:+${toUbillNumber(order.phone) || order.phone}`} className="flex items-center gap-2 font-medium hover:text-primary">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  {phone}
                </a>
                <CopyButton text={phone} label="ტელეფონის კოპირება" />
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">მიწოდების მისამართი</p>
              <div className="mt-1 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <p className="flex items-start gap-2 break-words text-sm leading-relaxed">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  {order.address}
                </p>
                <CopyButton text={order.address} label="მისამართის კოპირება" />
              </div>
              {order.shippingFee != null && (
                <p className="mt-2 text-xs text-muted-foreground">
                  მიწოდება: {order.shippingFee === 0 ? 'უფასო' : `${order.shippingFee} ₾`}
                  {order.total != null ? ` · ჯამი: ${order.total} ₾` : ''}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Hash className="h-4 w-4" />
              შეკვეთის დეტალები
            </CardTitle>
            <CardDescription>სისტემური ინფორმაცია</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs font-medium text-muted-foreground">შეკვეთის ნომერი</p>
                <p className="mt-1 font-mono text-sm font-semibold">#{shortId}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{order.id}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">შექმნის თარიღი</p>
                <p className="mt-1 flex items-center gap-2 text-sm font-medium">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  {date}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">სულ რაოდენობა</p>
                <p className="mt-1 text-2xl font-bold">{getOrderTotalQty(order)} ცალი</p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">სტოკის ჩამოჭრა</p>
                <p className="mt-1 text-sm font-medium">
                  {order.stockApplied ? 'ჩამოჭრილია' : 'არ არის ჩამოჭრილი'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <OrderQuantityEditor order={order} />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">სტატუსის მართვა</CardTitle>
          <CardDescription>შეკვეთის სტატუსის შეცვლა. „შესრულებული“ სტატუსზე სტოკი ავტომატურად ჩამოიჭრება.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <OrderStatusSelect orderId={order.id} status={order.status} />
          <Button
            type="button"
            variant="outline"
            className="text-destructive hover:bg-destructive/10"
            onClick={() => setDeleteOpen(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            შეკვეთის წაშლა
          </Button>
        </CardContent>
      </Card>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>შეკვეთის წაშლა</AlertDialogTitle>
            <AlertDialogDescription>
              შეკვეთა #{shortId} ({order.name}) სამუდამოდ წაიშლება. დარწმუნებული ხართ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>გაუქმება</AlertDialogCancel>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting ? 'იშლება...' : 'წაშლა'}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
