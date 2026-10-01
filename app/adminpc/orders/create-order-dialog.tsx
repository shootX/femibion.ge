'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Minus, UserPlus } from 'lucide-react'
import { createAdminOrder } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import type { Product } from '@/lib/products'

type Props = {
  products: Product[]
}

export function CreateOrderDialog({ products }: Props) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [quantities, setQuantities] = useState<Record<string, number>>({})

  const activeProducts = products.filter((p) => p.active)

  const setQty = (id: string, qty: number) => {
    setQuantities((prev) => ({ ...prev, [id]: Math.max(0, Math.floor(qty) || 0) }))
  }

  const resetForm = () => {
    setName('')
    setPhone('')
    setAddress('')
    setQuantities({})
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setPending(true)

    const items = activeProducts
      .map((p) => ({
        productId: p.id,
        label: p.orderLabel || p.name,
        qty: quantities[p.id] ?? 0,
      }))
      .filter((i) => i.qty > 0)

    const result = await createAdminOrder({ name, phone, address, items })
    setPending(false)

    if (!result.success) {
      setError(result.error ?? 'შეცდომა მოხდა')
      return
    }

    resetForm()
    setOpen(false)
    if (result.orderId) {
      router.push(`/adminpc/orders/${result.orderId}`)
    } else {
      router.refresh()
    }
  }

  const hasItems = activeProducts.some((p) => (quantities[p.id] ?? 0) > 0)

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v)
        if (!v) resetForm()
      }}
    >
      <DialogTrigger asChild>
        <Button className="gap-2 bg-violet-600 text-white hover:bg-violet-700">
          <UserPlus className="h-4 w-4" />
          ახალი შეკვეთა
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>შეკვეთის დამატება</DialogTitle>
          <DialogDescription>
            შექმენი შეკვეთა ხელით — ისინი „ადმინის შეკვეთა“ ნიშნით გამოჩნდება
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="admin-order-name">სახელი და გვარი</Label>
            <Input
              id="admin-order-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="მაგ: ნინო ბერიძე"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="admin-order-phone">ტელეფონი</Label>
            <Input
              id="admin-order-phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="5XX XX XX XX"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="admin-order-address">მიწოდების მისამართი</Label>
            <Textarea
              id="admin-order-address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="ქალაქი, ქუჩა, სახლი, ბინა..."
              rows={3}
              required
            />
          </div>

          <div className="space-y-3">
            <Label>პროდუქცია</Label>
            {activeProducts.length === 0 ? (
              <p className="text-sm text-muted-foreground">აქტიური პროდუქტები არ არის</p>
            ) : (
              activeProducts.map((product) => {
                const qty = quantities[product.id] ?? 0
                return (
                  <div
                    key={product.id}
                    className="flex items-center justify-between gap-3 rounded-xl border p-3"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">{product.orderLabel || product.name}</p>
                      {product.stock >= 0 && (
                        <p className="text-xs text-muted-foreground">სტოკში: {product.stock} ცალი</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setQty(product.id, qty - 1)}
                        disabled={qty <= 0}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Input
                        type="number"
                        min={0}
                        value={qty}
                        onChange={(e) => setQty(product.id, Number(e.target.value))}
                        className="h-8 w-14 text-center"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setQty(product.id, qty + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )
              })
            )}
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)} disabled={pending}>
              გაუქმება
            </Button>
            <Button
              type="submit"
              disabled={pending || !hasItems}
              className="bg-violet-600 hover:bg-violet-700"
            >
              {pending ? 'იქმნება...' : 'შეკვეთის შექმნა'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
