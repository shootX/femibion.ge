'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Printer,
  Edit,
  Trash2,
  ArrowLeft,
  Building2,
  User,
  CheckCircle2,
  Clock,
  Ban,
  Calendar,
  Phone,
  MapPin,
  CreditCard,
  Download,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
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
import type { Invoice } from '@/lib/invoice-types'

export function InvoicePrintableView({ invoice }: { invoice: Invoice }) {
  const router = useRouter()
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleting, startDelete] = useTransition()
  const [downloading, setDownloading] = useState(false)

  const handlePrint = () => {
    window.print()
  }

  const handleDownloadPdf = async () => {
    const el = document.getElementById('invoice-printable-sheet')
    if (!el) return
    setDownloading(true)
    try {
      const { toPng } = await import('html-to-image')
      const { jsPDF } = await import('jspdf')

      const nodeWidth = el.offsetWidth || el.clientWidth
      const nodeHeight = el.offsetHeight || el.clientHeight

      const captureOptions = {
        quality: 0.98,
        pixelRatio: 2,
        backgroundColor: '#ffffff',
        cacheBust: true,
        width: nodeWidth,
        height: nodeHeight,
        style: {
          margin: '0',
          marginLeft: '0',
          marginRight: '0',
          marginTop: '0',
          marginBottom: '0',
          transform: 'none',
          boxShadow: 'none',
        },
      }

      let dataUrl: string
      try {
        dataUrl = await toPng(el, captureOptions)
      } catch (err1) {
        console.warn('Initial toPng failed, retrying with skipFonts', err1)
        dataUrl = await toPng(el, {
          ...captureOptions,
          skipFonts: true,
        })
      }

      const img = new Image()
      img.src = dataUrl
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve()
        img.onerror = (e) => reject(e)
      })

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      })

      const pageWidth = pdf.internal.pageSize.getWidth() // 210 mm
      const pageHeight = pdf.internal.pageSize.getHeight() // 297 mm

      const marginMm = 8
      const printableWidth = pageWidth - marginMm * 2
      const imgHeight = (img.naturalHeight * printableWidth) / img.naturalWidth

      if (imgHeight <= pageHeight - marginMm * 2) {
        pdf.addImage(img, 'PNG', marginMm, marginMm, printableWidth, imgHeight, undefined, 'FAST')
      } else {
        let heightLeft = imgHeight
        let position = marginMm

        pdf.addImage(img, 'PNG', marginMm, position, printableWidth, imgHeight, undefined, 'FAST')
        heightLeft -= (pageHeight - marginMm * 2)

        while (heightLeft > 0) {
          position = heightLeft - imgHeight + marginMm
          pdf.addPage()
          pdf.addImage(img, 'PNG', marginMm, position, printableWidth, imgHeight, undefined, 'FAST')
          heightLeft -= (pageHeight - marginMm * 2)
        }
      }

      pdf.save(`Invoice-${invoice.number}.pdf`)
    } catch (err) {
      console.error('PDF download error, falling back to print dialog:', err)
      window.print()
    } finally {
      setDownloading(false)
    }
  }

  const handleDelete = () => {
    startDelete(async () => {
      const res = await deleteInvoiceAction(invoice.id)
      if (res.success) {
        setDeleteOpen(false)
        router.push('/adminpc/invoices')
        router.refresh()
      }
    })
  }

  return (
    <div className="space-y-6">
      {/* Top action bar - hidden during print */}
      <div className="no-print flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="sm">
            <Link href="/adminpc/invoices">
              <ArrowLeft className="mr-1 h-4 w-4" />
              ინვოისების სია
            </Link>
          </Button>
          <div className="h-4 w-px bg-border" />
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">სტატუსი:</span>
            <InvoiceStatusSelect invoiceId={invoice.id} status={invoice.status} />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <SendInvoiceDialog invoice={invoice} />

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleDownloadPdf}
            disabled={downloading}
            className="gap-1.5 shadow-sm"
          >
            {downloading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                მზადდება...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 text-primary" />
                გადმოწერა (PDF)
              </>
            )}
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handlePrint}
            className="gap-1.5 shadow-sm"
          >
            <Printer className="h-4 w-4" />
            ბეჭდვა
          </Button>

          <Button asChild variant="outline" size="sm" className="gap-1.5">
            <Link href={`/adminpc/invoices/${invoice.id}/edit`}>
              <Edit className="h-4 w-4" />
              რედაქტირება
            </Link>
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setDeleteOpen(true)}
            className="gap-1.5 text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" />
            წაშლა
          </Button>
        </div>
      </div>

      {/* Printable Sheet */}
      <div className="flex justify-center w-full">
        <div
          id="invoice-printable-sheet"
          className="invoice-sheet w-full max-w-4xl rounded-xl border bg-white p-8 text-zinc-900 shadow-sm sm:p-12 print:border-none print:shadow-none print:p-0 print:m-0 print:max-w-none print:text-black"
          style={{ margin: 0 }}
        >
        {/* Invoice Header */}
        <div className="flex flex-col gap-6 border-b border-zinc-200 pb-8 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <img
                src="/images/logo.png"
                alt="Femibion Logo"
                className="h-12 w-12 rounded-xl object-contain border border-zinc-200 bg-white p-0.5 shadow-xs"
              />
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900">FEMIBION GEORGIA</h2>
                <p className="text-xs text-zinc-500">ოფიციალური დისტრიბუცია საქართველოში</p>
              </div>
            </div>
            <div className="mt-4 text-xs text-zinc-600 space-y-0.5">
              <p className="font-semibold text-zinc-900">{invoice.seller.name}</p>
              <p>საიდენტიფიკაციო კოდი: <span className="font-mono">{invoice.seller.taxId}</span></p>
              <p>{invoice.seller.address}</p>
              <p>ტელეფონი: {invoice.seller.phone}</p>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl">
              ინვოისი
            </h1>
            <p className="mt-1 font-mono text-base font-semibold text-pink-600">
              #{invoice.number}
            </p>
            <div className="mt-4 space-y-1 text-xs text-zinc-600">
              <p>
                <span className="text-zinc-400">თარიღი:</span>{' '}
                <span className="font-medium text-zinc-900">{invoice.date}</span>
              </p>
              {invoice.dueDate && (
                <p>
                  <span className="text-zinc-400">ვადა:</span>{' '}
                  <span className="font-medium text-zinc-900">{invoice.dueDate}</span>
                </p>
              )}
              <div className="pt-1 flex sm:justify-end">
                <InvoiceStatusBadge status={invoice.status} />
              </div>
            </div>
          </div>
        </div>

        {/* Seller & Buyer Grid */}
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Seller */}
          <div className="rounded-lg border border-zinc-100 bg-zinc-50/70 p-4 text-xs">
            <h3 className="mb-2 flex items-center gap-1.5 font-bold uppercase tracking-wider text-zinc-500 text-[11px]">
              <Building2 className="h-3.5 w-3.5 text-zinc-700" />
              გამყიდველი
            </h3>
            <div className="space-y-1 text-zinc-700">
              <p className="text-sm font-semibold text-zinc-900">{invoice.seller.name}</p>
              <p>ს/კ: <span className="font-mono font-medium">{invoice.seller.taxId}</span></p>
              <p>მისამართი: {invoice.seller.address}</p>
              <p>ტელეფონი: {invoice.seller.phone}</p>
              {invoice.seller.email && <p>ელ-ფოსტა: {invoice.seller.email}</p>}
            </div>
          </div>

          {/* Buyer */}
          <div className="rounded-lg border border-zinc-100 bg-zinc-50/70 p-4 text-xs">
            <h3 className="mb-2 flex items-center gap-1.5 font-bold uppercase tracking-wider text-zinc-500 text-[11px]">
              <User className="h-3.5 w-3.5 text-zinc-700" />
              შემსყიდველი
            </h3>
            <div className="space-y-1 text-zinc-700">
              <p className="text-sm font-semibold text-zinc-900">{invoice.buyer.name}</p>
              {invoice.buyer.taxId && (
                <p>ს/კ ან პ/ნ: <span className="font-mono font-medium">{invoice.buyer.taxId}</span></p>
              )}
              <p>ტელეფონი: {invoice.buyer.phone}</p>
              <p>მისამართი: {invoice.buyer.address}</p>
              {invoice.buyer.email && <p>ელ-ფოსტა: {invoice.buyer.email}</p>}
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="mt-8 overflow-hidden rounded-lg border border-zinc-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-100/80 font-semibold text-zinc-700 border-b border-zinc-200">
              <tr>
                <th className="py-3 px-4 w-12 text-center">№</th>
                <th className="py-3 px-4">საქონლის / მომსახურების დასახელება</th>
                <th className="py-3 px-4 w-24 text-center">რაოდენობა</th>
                <th className="py-3 px-4 w-32 text-right">ერთ. ფასი (₾)</th>
                <th className="py-3 px-4 w-32 text-right">თანხა (₾)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 text-zinc-800">
              {invoice.items.map((item, index) => (
                <tr key={item.id} className="hover:bg-zinc-50/50">
                  <td className="py-3 px-4 text-center font-mono text-zinc-400">{index + 1}</td>
                  <td className="py-3 px-4 font-medium text-zinc-900">{item.description}</td>
                  <td className="py-3 px-4 text-center font-semibold">{item.quantity} ცალი</td>
                  <td className="py-3 px-4 text-right font-mono">{item.unitPrice.toFixed(2)}</td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-zinc-900">
                    {item.total.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Subtotal & Total */}
        <div className="mt-6 flex flex-col items-end">
          <div className="w-full sm:w-72 space-y-2 rounded-lg border border-zinc-200 bg-zinc-50/70 p-4 text-xs">
            <div className="flex justify-between text-zinc-600">
              <span>ქვეჯამი:</span>
              <span className="font-mono">{invoice.subtotal.toFixed(2)} ₾</span>
            </div>
            <div className="border-t border-zinc-200 pt-2 flex justify-between text-sm font-extrabold text-zinc-900">
              <span>სულ გადასახდელი:</span>
              <span className="font-mono text-pink-600 text-base">{invoice.total.toFixed(2)} ₾</span>
            </div>
          </div>
        </div>

        {/* Notes / Comments */}
        {invoice.notes && (
          <div className="mt-6 rounded-lg border border-zinc-100 bg-zinc-50/50 p-4 text-xs text-zinc-600">
            <span className="font-semibold text-zinc-800">შენიშვნა: </span>
            {invoice.notes}
          </div>
        )}

        {/* Signatures & Stamp block */}
        <div className="mt-14 grid grid-cols-2 gap-10 border-t border-dashed border-zinc-300 pt-8 text-xs text-zinc-700">
          <div>
            <p className="font-semibold text-zinc-900">ჩააბარა (გამყიდველი):</p>
            <div className="mt-10 border-b border-zinc-400 w-48" />
            <p className="mt-1 text-[11px] text-zinc-500">{invoice.seller.name}</p>
          </div>
          <div className="text-right">
            <p className="font-semibold text-zinc-900">ჩაიბარა (შემსყიდველი):</p>
            <div className="mt-10 border-b border-zinc-400 w-48 ml-auto" />
            <p className="mt-1 text-[11px] text-zinc-500">{invoice.buyer.name}</p>
          </div>
        </div>
      </div>
      </div>

      {/* Delete confirmation modal */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>ინვოისის წაშლა</AlertDialogTitle>
            <AlertDialogDescription>
              ნამდვილად გსურთ ინვოისის #{invoice.number} წაშლა?
              {invoice.status === 'paid' && (
                <span className="mt-2 block font-medium text-amber-600">
                  ყურადღება: რადგან ინვოისი გადახდილი იყო, მასში მითითებული პროდუქციის რაოდენობა უკან დაუბრუნდება საწყობის მარაგს.
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

      {/* Print CSS styles */}
      <style jsx global>{`
        @media print {
          body {
            background: #fff !important;
            color: #000 !important;
          }
          header,
          aside,
          nav,
          .no-print,
          [data-sidebar="sidebar"],
          [data-sidebar="provider"] > header {
            display: none !important;
          }
          main {
            padding: 0 !important;
            margin: 0 !important;
            max-width: 100% !important;
          }
          .invoice-sheet {
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            margin: 0 !important;
            max-width: 100% !important;
          }
          @page {
            size: A4;
            margin: 15mm;
          }
        }
      `}</style>
    </div>
  )
}
