'use client'

import { useMemo, useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Search,
  Receipt,
  Eye,
  Printer,
  Edit,
  Trash2,
  Plus,
  CheckCircle2,
  Clock,
  Ban,
  DollarSign,
  TrendingUp,
  Mail,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
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
import { InvoiceStatusBadge } from './invoice-status-badge'
import { InvoiceStatusSelect } from './invoice-status-select'
import { SendInvoiceDialog } from './send-invoice-dialog'
import { deleteInvoiceAction } from '@/app/adminpc/invoices/actions'
import type { Invoice, InvoiceStatus } from '@/lib/invoice-types'

type StatusFilter = 'all' | InvoiceStatus

export function InvoicesPanel({ invoices }: { invoices: Invoice[] }) {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [deleteTarget, setDeleteTarget] = useState<Invoice | null>(null)
  const [deleting, startDelete] = useTransition()

  // Statistics
  const stats = useMemo(() => {
    const totalCount = invoices.length
    const paidInvoices = invoices.filter((i) => i.status === 'paid')
    const pendingInvoices = invoices.filter((i) => i.status === 'pending')

    const paidSum = paidInvoices.reduce((sum, i) => sum + i.total, 0)
    const pendingSum = pendingInvoices.reduce((sum, i) => sum + i.total, 0)
    const totalSum = invoices.reduce((sum, i) => sum + i.total, 0)

    return {
      totalCount,
      paidCount: paidInvoices.length,
      paidSum,
      pendingCount: pendingInvoices.length,
      pendingSum,
      totalSum,
    }
  }, [invoices])

  // Filtered invoices
  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      if (statusFilter !== 'all' && inv.status !== statusFilter) return false
      if (!search.trim()) return true

      const q = search.toLowerCase()
      const haystack = [
        inv.number,
        inv.buyer.name,
        inv.buyer.phone,
        inv.buyer.address,
        inv.buyer.taxId || '',
        ...inv.items.map((it) => it.description),
      ]
        .join(' ')
        .toLowerCase()

      return haystack.includes(q)
    })
  }, [invoices, statusFilter, search])

  const handleDelete = () => {
    if (!deleteTarget) return
    startDelete(async () => {
      const res = await deleteInvoiceAction(deleteTarget.id)
      if (res.success) {
        setDeleteTarget(null)
        router.refresh()
      }
    })
  }

  return (
    <div className="space-y-6">
      {/* Stats row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              სულ ინვოისი
            </CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              ჯამური ბრუნვა: {stats.totalSum.toFixed(2)} ₾
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-emerald-500/20 bg-emerald-500/[0.02]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-emerald-800">
              გადახდილი
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-700">{stats.paidSum.toFixed(2)} ₾</div>
            <p className="text-xs text-emerald-700/80 mt-1">
              {stats.paidCount} ინვოისი (მარაგები ჩამოჭრილია)
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-amber-500/20 bg-amber-500/[0.02]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-amber-800">
              გადასახდელი (მოლოდინში)
            </CardTitle>
            <Clock className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-700">{stats.pendingSum.toFixed(2)} ₾</div>
            <p className="text-xs text-amber-700/80 mt-1">
              {stats.pendingCount} ინვოისი
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              ჩვენი კომპანია
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-bold truncate">ი/მ შოთა ჩხვრიკია</div>
            <p className="text-xs text-muted-foreground mt-1 font-mono">
              ს/კ: 62004025572
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <Card className="shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ძებნა: ინვოისის №, შემსყიდველი, ტელეფონი..."
                className="pl-9 h-9"
              />
            </div>

            <div className="flex items-center gap-3">
              <Select
                value={statusFilter}
                onValueChange={(v) => setStatusFilter(v as StatusFilter)}
              >
                <SelectTrigger className="w-[170px] h-9 text-xs">
                  <SelectValue placeholder="ყველა სტატუსი" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">ყველა სტატუსი</SelectItem>
                  <SelectItem value="pending">გადასახდელი</SelectItem>
                  <SelectItem value="paid">გადახდილი</SelectItem>
                  <SelectItem value="cancelled">გაუქმებული</SelectItem>
                </SelectContent>
              </Select>

              <Button asChild size="sm" className="gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 h-9">
                <Link href="/adminpc/invoices/new">
                  <Plus className="h-4 w-4" />
                  ახალი ინვოისი
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Invoices Table */}
      <Card className="shadow-sm overflow-hidden">
        {filteredInvoices.length === 0 ? (
          <div className="py-16 text-center">
            <Receipt className="mx-auto h-12 w-12 text-muted-foreground/40" />
            <h3 className="mt-4 text-base font-semibold">ინვოისები არ მოიძებნა</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {search || statusFilter !== 'all'
                ? 'სცადეთ შეცვალოთ ფილტრი ან ძებნის პარამეტრი'
                : 'ჯერ არ გაქვთ შექმნილი არცერთი ინვოისი'}
            </p>
            <div className="mt-6">
              <Button asChild size="sm">
                <Link href="/adminpc/invoices/new">
                  <Plus className="mr-1.5 h-4 w-4" />
                  პირველი ინვოისის გამოწერა
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[140px]">ინვოისის №</TableHead>
                  <TableHead>შემსყიდველი</TableHead>
                  <TableHead>თარიღი</TableHead>
                  <TableHead>საქონელი</TableHead>
                  <TableHead className="text-right">ჯამი</TableHead>
                  <TableHead className="text-center">სტატუსი</TableHead>
                  <TableHead className="text-right">მოქმედება</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.map((inv) => (
                  <TableRow key={inv.id} className="hover:bg-muted/40">
                    <TableCell className="font-mono font-medium">
                      <Link
                        href={`/adminpc/invoices/${inv.id}`}
                        className="text-primary hover:underline"
                      >
                        {inv.number}
                      </Link>
                    </TableCell>

                    <TableCell>
                      <div className="font-medium text-sm">{inv.buyer.name}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-2">
                        <span>{inv.buyer.phone}</span>
                        {inv.buyer.taxId && (
                          <span className="font-mono">({inv.buyer.taxId})</span>
                        )}
                      </div>
                    </TableCell>

                    <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                      {inv.date}
                    </TableCell>

                    <TableCell className="max-w-[200px]">
                      <div className="truncate text-xs font-medium" title={inv.items.map((i) => `${i.description} (x${i.quantity})`).join(', ')}>
                        {inv.items.map((i) => `${i.description} (x${i.quantity})`).join(', ')}
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        {inv.items.reduce((sum, i) => sum + i.quantity, 0)} ცალი
                      </div>
                    </TableCell>

                    <TableCell className="text-right font-mono font-bold whitespace-nowrap">
                      {inv.total.toFixed(2)} ₾
                    </TableCell>

                    <TableCell className="text-center">
                      <InvoiceStatusSelect
                        invoiceId={inv.id}
                        status={inv.status}
                        onUpdated={() => router.refresh()}
                      />
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button asChild variant="ghost" size="icon" className="h-8 w-8" title="ნახვა / გადმოწერა">
                          <Link href={`/adminpc/invoices/${inv.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <SendInvoiceDialog
                          invoice={inv}
                          trigger={
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-primary"
                              title="მეილზე გაგზავნა"
                            >
                              <Mail className="h-4 w-4" />
                            </Button>
                          }
                        />
                        <Button asChild variant="ghost" size="icon" className="h-8 w-8" title="რედაქტირება">
                          <Link href={`/adminpc/invoices/${inv.id}/edit`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:bg-destructive/10"
                          onClick={() => setDeleteTarget(inv)}
                          title="წაშლა"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>

      {/* Delete confirmation dialog */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>ინვოისის წაშლა</AlertDialogTitle>
            <AlertDialogDescription>
              ნამდვილად გსურთ ინვოისის #{deleteTarget?.number} წაშლა?
              {deleteTarget?.status === 'paid' && (
                <span className="mt-2 block font-medium text-amber-600">
                  ყურადღება: ინვოისი გადახდილი იყო — პროდუქციის რაოდენობა უკან დაუბრუნდება საწყობის მარაგს.
                </span>
              )}
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
