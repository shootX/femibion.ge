'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Building2,
  User,
  Plus,
  Trash2,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  ArrowLeft,
  Info,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  type Invoice,
  type InvoiceStatus,
  type BuyerSuggestion,
  DEFAULT_SELLER_DETAILS,
  INVOICE_STATUS_META,
} from '@/lib/invoice-types'
import type { Product } from '@/lib/products'
import { createInvoiceAction, updateInvoiceAction } from '@/app/adminpc/invoices/actions'

type FormItem = {
  id: string
  productId: string
  description: string
  quantity: number
  unitPrice: number
}

type Props = {
  initialInvoice?: Invoice
  defaultInvoiceNumber?: string
  products: Product[]
  buyerSuggestions: BuyerSuggestion[]
  initialOrderId?: string
  initialBuyer?: {
    name?: string
    phone?: string
    address?: string
  }
  initialItems?: Array<{
    productId?: string
    description: string
    quantity: number
    unitPrice: number
  }>
}

export function InvoiceForm({
  initialInvoice,
  defaultInvoiceNumber,
  products,
  buyerSuggestions,
  initialOrderId,
  initialBuyer,
  initialItems,
}: Props) {
  const router = useRouter()
  const isEditing = !!initialInvoice

  const [pending, startTransition] = useTransition()
  const [error, setError] = useState('')

  // Invoice Meta
  const [invoiceNumber, setInvoiceNumber] = useState(
    initialInvoice?.number || defaultInvoiceNumber || `INV-${new Date().getFullYear()}-0001`
  )
  const [date, setDate] = useState(
    initialInvoice?.date || new Date().toISOString().slice(0, 10)
  )
  const [dueDate, setDueDate] = useState(initialInvoice?.dueDate || '')
  const [status, setStatus] = useState<InvoiceStatus>(initialInvoice?.status || 'pending')
  const [notes, setNotes] = useState(initialInvoice?.notes || '')

  // Buyer Info
  const [buyerName, setBuyerName] = useState(
    initialInvoice?.buyer.name || initialBuyer?.name || ''
  )
  const [buyerTaxId, setBuyerTaxId] = useState(
    initialInvoice?.buyer.taxId || ''
  )
  const [buyerPhone, setBuyerPhone] = useState(
    initialInvoice?.buyer.phone || initialBuyer?.phone || ''
  )
  const [buyerAddress, setBuyerAddress] = useState(
    initialInvoice?.buyer.address || initialBuyer?.address || ''
  )
  const [buyerEmail, setBuyerEmail] = useState(
    initialInvoice?.buyer.email || ''
  )

  // Items
  const defaultInitialItems: FormItem[] = initialInvoice
    ? initialInvoice.items.map((it) => ({
        id: it.id,
        productId: it.productId || '',
        description: it.description,
        quantity: it.quantity,
        unitPrice: it.unitPrice,
      }))
    : initialItems && initialItems.length > 0
      ? initialItems.map((it, idx) => ({
          id: `item_${idx + 1}`,
          productId: it.productId || '',
          description: it.description,
          quantity: it.quantity,
          unitPrice: it.unitPrice,
        }))
      : [
          {
            id: 'item_1',
            productId: products[0]?.id || '',
            description: products[0]?.orderLabel || products[0]?.name || 'Femibion 1',
            quantity: 1,
            unitPrice: products[0]?.price || 100,
          },
        ]

  const [items, setItems] = useState<FormItem[]>(defaultInitialItems)

  // Handle buyer suggestion auto-fill
  const handleSelectBuyerSuggestion = (key: string) => {
    if (!key) return
    const selected = buyerSuggestions.find(
      (b) => `${b.name}___${b.phone}` === key
    )
    if (!selected) return

    setBuyerName(selected.name)
    setBuyerPhone(selected.phone)
    setBuyerAddress(selected.address)
    if (selected.taxId) {
      setBuyerTaxId(selected.taxId)
    }
  }

  // Items handlers
  const handleProductSelect = (index: number, productId: string) => {
    const prod = products.find((p) => p.id === productId)
    if (!prod) return

    setItems((prev) => {
      const next = [...prev]
      next[index] = {
        ...next[index],
        productId: prod.id,
        description: prod.orderLabel || prod.name,
        unitPrice: prod.price || 0,
      }
      return next
    })
  }

  const handleItemChange = (
    index: number,
    field: keyof FormItem,
    value: string | number
  ) => {
    setItems((prev) => {
      const next = [...prev]
      next[index] = {
        ...next[index],
        [field]: value,
      }
      return next
    })
  }

  const handleAddItem = () => {
    const defaultProd = products[0]
    setItems((prev) => [
      ...prev,
      {
        id: `item_${Date.now()}`,
        productId: defaultProd?.id || '',
        description: defaultProd?.orderLabel || defaultProd?.name || '',
        quantity: 1,
        unitPrice: defaultProd?.price || 100,
      },
    ])
  }

  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) return
    setItems((prev) => prev.filter((_, i) => i !== index))
  }

  // Calculate total
  const totalAmount = items.reduce(
    (sum, item) => sum + (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0),
    0
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!buyerName.trim()) {
      setError('შეიყვანეთ შემსყიდველის სახელი/დასახელება')
      return
    }
    if (!buyerPhone.trim()) {
      setError('შეიყვანეთ შემსყიდველის ტელეფონი')
      return
    }
    if (!buyerAddress.trim()) {
      setError('შეიყვანეთ შემსყიდველის მისამართი')
      return
    }

    const validItems = items.filter(
      (it) => it.description.trim() && it.quantity > 0 && it.unitPrice >= 0
    )
    if (validItems.length === 0) {
      setError('დაამატეთ მინიმუმ ერთი ვალიდური საქონელი')
      return
    }

    startTransition(async () => {
      if (isEditing && initialInvoice) {
        const res = await updateInvoiceAction(initialInvoice.id, {
          number: invoiceNumber,
          date,
          dueDate: dueDate || undefined,
          buyer: {
            name: buyerName,
            taxId: buyerTaxId || undefined,
            phone: buyerPhone,
            address: buyerAddress,
            email: buyerEmail || undefined,
          },
          items: validItems.map((it) => ({
            id: it.id,
            productId: it.productId || undefined,
            description: it.description,
            quantity: Number(it.quantity),
            unitPrice: Number(it.unitPrice),
          })),
          status,
          notes: notes || undefined,
        })

        if (!res.success) {
          setError(res.error || 'შეცდომა რედაქტირებისას')
          return
        }

        router.push(`/adminpc/invoices/${initialInvoice.id}`)
        router.refresh()
      } else {
        const res = await createInvoiceAction({
          number: invoiceNumber,
          orderId: initialOrderId,
          date,
          dueDate: dueDate || undefined,
          buyer: {
            name: buyerName,
            taxId: buyerTaxId || undefined,
            phone: buyerPhone,
            address: buyerAddress,
            email: buyerEmail || undefined,
          },
          items: validItems.map((it) => ({
            productId: it.productId || undefined,
            description: it.description,
            quantity: Number(it.quantity),
            unitPrice: Number(it.unitPrice),
          })),
          status,
          notes: notes || undefined,
        })

        if (!res.success || !res.invoiceId) {
          setError(res.error || 'შეცდომა ინვოისის შექმნისას')
          return
        }

        router.push(`/adminpc/invoices/${res.invoiceId}`)
        router.refresh()
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <Button asChild variant="ghost" size="sm" className="-ml-2 w-fit">
            <Link href="/adminpc/invoices">
              <ArrowLeft className="mr-1 h-4 w-4" />
              უკან ინვოისებზე
            </Link>
          </Button>
          <div className="flex items-center gap-3">
            <img
              src="/images/logo.png"
              alt="Femibion Logo"
              className="h-10 w-10 rounded-xl object-contain border border-border bg-card p-0.5 shadow-xs"
            />
            <div>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                {isEditing ? `ინვოისის რედაქტირება #${invoiceNumber}` : 'ახალი ინვოისის გამოწერა'}
              </h1>
              <p className="text-sm text-muted-foreground">
                {isEditing
                  ? 'შეცვალეთ მონაცემები ან განაახლეთ სტატუსი'
                  : 'შეავსეთ შემსყიდველის და საქონლის მონაცემები'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={pending}
          >
            გაუქმება
          </Button>
          <Button
            type="submit"
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            disabled={pending}
          >
            {pending ? 'ინახება...' : isEditing ? 'შენახვა' : 'ინვოისის შექმნა'}
          </Button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Top 2 columns: Seller & Invoice Info */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Seller Info (Company) */}
        <Card className="border-primary/20 bg-primary/[0.02]">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2.5 text-base text-primary">
              <img
                src="/images/logo.png"
                alt="Femibion Logo"
                className="h-5 w-5 rounded object-contain"
              />
              გამყიდველი (ჩვენი კომპანია)
            </CardTitle>
            <CardDescription>
              ოფიციალური მონაცემები, რომლებიც აისახება ინვოისზე
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <span className="text-xs text-muted-foreground">დასახელება:</span>
              <p className="font-semibold">{DEFAULT_SELLER_DETAILS.name}</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-xs text-muted-foreground">ს/კ:</span>
                <p className="font-medium font-mono">{DEFAULT_SELLER_DETAILS.taxId}</p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">ტელეფონი:</span>
                <p className="font-medium">{DEFAULT_SELLER_DETAILS.phone}</p>
              </div>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">მისამართი:</span>
              <p className="font-medium">{DEFAULT_SELLER_DETAILS.address}</p>
            </div>
          </CardContent>
        </Card>

        {/* Invoice Metadata */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Calendar className="h-4 w-4" />
              ინვოისის პარამეტრები
            </CardTitle>
            <CardDescription>ნომერი, თარიღი და მიმდინარე სტატუსი</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="inv-num">ინვოისის №</Label>
                <Input
                  id="inv-num"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  placeholder="INV-2026-0001"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="inv-status">სტატუსი</Label>
                <Select
                  value={status}
                  onValueChange={(v) => setStatus(v as InvoiceStatus)}
                >
                  <SelectTrigger id="inv-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.keys(INVOICE_STATUS_META) as InvoiceStatus[]).map((st) => (
                      <SelectItem key={st} value={st}>
                        {INVOICE_STATUS_META[st].label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="inv-date">გამოწერის თარიღი</Label>
                <Input
                  id="inv-date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="inv-due-date">გადახდის ვადა (არასავალდებულო)</Label>
                <Input
                  id="inv-due-date"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
            </div>

            {status === 'paid' && (
              <div className="flex items-start gap-2 rounded-md bg-emerald-500/10 p-2.5 text-xs text-emerald-800">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
                <span>
                  <strong>სტატუსი: გადახდილი</strong> — ინვოისის დადასტურებისთანავე
                  მითითებული პროდუქციის რაოდენობა ჩამოიჭრება საწყობის ნაშთიდან.
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Buyer Section with Auto-suggest */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-base">
                <User className="h-4 w-4" />
                შემსყიდველის რეკვიზიტები
              </CardTitle>
              <CardDescription>
                შეგიძლიათ აირჩიოთ არსებული ბაზიდან ან ხელით შეიყვანოთ
              </CardDescription>
            </div>

            {buyerSuggestions.length > 0 && (
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <Select onValueChange={handleSelectBuyerSuggestion}>
                  <SelectTrigger className="w-[260px] text-xs">
                    <SelectValue placeholder="ავტომატური არჩევა ბაზიდან..." />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {buyerSuggestions.slice(0, 30).map((sugg) => (
                      <SelectItem
                        key={`${sugg.name}___${sugg.phone}`}
                        value={`${sugg.name}___${sugg.phone}`}
                        className="text-xs"
                      >
                        <span className="font-medium">{sugg.name}</span>
                        <span className="ml-1 text-muted-foreground">({sugg.phone})</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="buyer-name">
                დასახელება / სახელი და გვარი <span className="text-destructive">*</span>
              </Label>
              <Input
                id="buyer-name"
                value={buyerName}
                onChange={(e) => setBuyerName(e.target.value)}
                placeholder="მაგ: შპს ან ფიზიკური პირი"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="buyer-tax-id">ს/კ ან პირადი ნომერი</Label>
              <Input
                id="buyer-tax-id"
                value={buyerTaxId}
                onChange={(e) => setBuyerTaxId(e.target.value)}
                placeholder="მაგ: 205XXXXXX ან 010XXXXXXXX"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="buyer-phone">
                ტელეფონის ნომერი <span className="text-destructive">*</span>
              </Label>
              <Input
                id="buyer-phone"
                value={buyerPhone}
                onChange={(e) => setBuyerPhone(e.target.value)}
                placeholder="მაგ: 599XXXXXX"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="buyer-email">ელ-ფოსტა</Label>
              <Input
                id="buyer-email"
                type="email"
                value={buyerEmail}
                onChange={(e) => setBuyerEmail(e.target.value)}
                placeholder="client@example.com"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="buyer-address">
              მისამართი <span className="text-destructive">*</span>
            </Label>
            <Input
              id="buyer-address"
              value={buyerAddress}
              onChange={(e) => setBuyerAddress(e.target.value)}
              placeholder="მაგ: თბილისი, რუსთაველის გამზ. 1"
              required
            />
          </div>
        </CardContent>
      </Card>

      {/* Items Section */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">საქონელი / მომსახურება</CardTitle>
              <CardDescription>
                აირჩიეთ პროდუქტი კატალოგიდან ან შეიყვანეთ ხელით
              </CardDescription>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddItem}
              className="gap-1.5"
            >
              <Plus className="h-4 w-4" />
              საქონლის დამატება
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          <div className="space-y-3">
            {items.map((item, index) => (
              <div
                key={item.id}
                className="flex flex-col gap-3 rounded-lg border p-3 sm:flex-row sm:items-end"
              >
                {/* Catalog Select */}
                <div className="w-full sm:w-[220px]">
                  <Label className="text-xs text-muted-foreground mb-1 block">
                    პროდუქტის შაბლონი
                  </Label>
                  <Select
                    value={item.productId || 'custom'}
                    onValueChange={(val) => {
                      if (val === 'custom') {
                        handleItemChange(index, 'productId', '')
                      } else {
                        handleProductSelect(index, val)
                      }
                    }}
                  >
                    <SelectTrigger className="h-9 text-xs">
                      <SelectValue placeholder="არჩევა..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="custom" className="text-xs italic text-muted-foreground">
                        -- სხვა / ხელით შეყვანა --
                      </SelectItem>
                      {products.map((p) => (
                        <SelectItem key={p.id} value={p.id} className="text-xs">
                          {p.name} ({p.price} ₾) [ნაშთი: {p.stock}]
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Description */}
                <div className="flex-1 space-y-1">
                  <Label className="text-xs text-muted-foreground">დასახელება</Label>
                  <Input
                    value={item.description}
                    onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                    placeholder="პროდუქტის ან სერვისის აღწერა"
                    className="h-9 text-xs"
                    required
                  />
                </div>

                {/* Quantity */}
                <div className="w-full sm:w-[100px] space-y-1">
                  <Label className="text-xs text-muted-foreground">რაოდენობა</Label>
                  <Input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      handleItemChange(index, 'quantity', Math.max(1, parseInt(e.target.value, 10) || 1))
                    }
                    className="h-9 text-xs text-center"
                    required
                  />
                </div>

                {/* Unit Price */}
                <div className="w-full sm:w-[120px] space-y-1">
                  <Label className="text-xs text-muted-foreground">ფასი (₾)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={item.unitPrice}
                    onChange={(e) =>
                      handleItemChange(index, 'unitPrice', Math.max(0, parseFloat(e.target.value) || 0))
                    }
                    className="h-9 text-xs text-right"
                    required
                  />
                </div>

                {/* Row Total */}
                <div className="w-full sm:w-[110px] space-y-1 text-right">
                  <Label className="text-xs text-muted-foreground">ჯამი</Label>
                  <div className="flex h-9 items-center justify-end font-semibold text-sm">
                    {((Number(item.quantity) || 0) * (Number(item.unitPrice) || 0)).toFixed(2)} ₾
                  </div>
                </div>

                {/* Remove Button */}
                <div className="sm:pb-0.5">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-muted-foreground hover:text-destructive"
                    onClick={() => handleRemoveItem(index)}
                    disabled={items.length <= 1}
                    title="სტრიქონის წაშლა"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-4">
            <div className="rounded-lg border bg-muted/40 p-4 min-w-[260px] space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">ქვეჯამი:</span>
                <span>{totalAmount.toFixed(2)} ₾</span>
              </div>
              <div className="flex justify-between border-t pt-2 text-base font-bold">
                <span>სულ გადასახდელი:</span>
                <span className="text-primary">{totalAmount.toFixed(2)} ₾</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notes */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">დამატებითი შენიშვნა / კომენტარი</CardTitle>
          <CardDescription>გამოჩნდება ინვოისის ბოლოში</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="მაგ: გადახდა წარმოებს უნაღდო ანგარიშსწორებით 3 სამუშაო დღის განმავლობაში..."
            rows={2}
          />
        </CardContent>
      </Card>

      <div className="flex items-center justify-end gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={pending}
        >
          გაუქმება
        </Button>
        <Button
          type="submit"
          className="bg-primary text-primary-foreground hover:bg-primary/90"
          disabled={pending}
        >
          {pending ? 'ინახება...' : isEditing ? 'შენახვა' : 'ინვოისის შექმნა'}
        </Button>
      </div>
    </form>
  )
}
