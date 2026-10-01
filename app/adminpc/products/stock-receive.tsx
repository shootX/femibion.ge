'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Warehouse } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { addStockToWarehouse } from './actions'

export function StockReceiveButton({
  productId,
  productName,
  currentStock,
}: {
  productId: string
  productName: string
  currentStock: number
}) {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    formData.set('id', productId)
    const result = await addStockToWarehouse(formData)
    setLoading(false)
    if (result.error) {
      setError(result.error)
      return
    }
    setOpen(false)
    router.refresh()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5">
          <Warehouse className="h-4 w-4" />
          საწყობში მიღება
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>საწყობში მიღება — {productName}</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          მიმდინარე სტოკი: <span className="font-semibold text-foreground">{currentStock} ცალი</span>
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor={`qty-${productId}`}>დასამატებელი რაოდენობა</Label>
            <Input
              id={`qty-${productId}`}
              name="quantity"
              type="number"
              min={1}
              step={1}
              required
              placeholder="მაგ: 50"
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              გაუქმება
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'ინახება...' : 'დამატება'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
