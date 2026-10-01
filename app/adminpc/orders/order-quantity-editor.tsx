'use client'

import { useEffect, useMemo, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Minus, Pencil, Plus, Save } from 'lucide-react'
import { saveOrderQuantities } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { formatGeorgiaDateTime } from '@/lib/georgia-time'
import { getOrderEditSummary, normalizeOrderLineItems } from '@/lib/order-display'
import type { Order, OrderLineItem } from '@/lib/orders'

type Props = {
  order: Order
}

export function OrderQuantityEditor({ order }: Props) {
  const router = useRouter()
  const [editing, setEditing] = useState(false)
  const [error, setError] = useState('')
  const [pending, startTransition] = useTransition()

  const baseItems = useMemo(() => normalizeOrderLineItems(order), [order])
  const [draft, setDraft] = useState<OrderLineItem[]>(baseItems)

  useEffect(() => {
    if (!editing) setDraft(normalizeOrderLineItems(order))
  }, [order, editing])

  const resetDraft = () => {
    setDraft(normalizeOrderLineItems(order))
    setError('')
  }

  const setQty = (productId: string, qty: number) => {
    setDraft((prev) =>
      prev.map((item) =>
        item.productId === productId
          ? { ...item, qty: Math.max(0, Math.floor(qty) || 0) }
          : item,
      ),
    )
  }

  const hasChanges = useMemo(() => {
    return draft.some((item) => {
      const original = baseItems.find((b) => b.productId === item.productId)
      return (original?.qty ?? 0) !== item.qty
    })
  }, [draft, baseItems])

  const handleSave = () => {
    setError('')
    startTransition(async () => {
      const result = await saveOrderQuantities(
        order.id,
        draft.map((item) => ({ productId: item.productId, qty: item.qty })),
      )
      if (!result.success) {
        setError(result.error ?? 'შეცდომა მოხდა')
        return
      }
      setEditing(false)
      router.refresh()
    })
  }

  const totalDraft = draft.reduce((sum, item) => sum + item.qty, 0)

  return (
    <div className="space-y-4">
      {order.adminEdited && (
        <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
          <Pencil className="h-4 w-4 shrink-0" />
          <span>ეს შეკვეთა ადმინმა დაარედაქტირა</span>
        </div>
      )}

      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
          <div>
            <CardTitle className="text-base">რაოდენობის რედაქტირება</CardTitle>
            <CardDescription>
              შეცვალე პროდუქტის რაოდენობა, თუ მომხმარებელმა არასწორად მიუთითა
            </CardDescription>
          </div>
          {!editing ? (
            <Button type="button" variant="outline" size="sm" onClick={() => { resetDraft(); setEditing(true) }}>
              <Pencil className="mr-1 h-4 w-4" />
              რედაქტირება
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => { setEditing(false); resetDraft() }}
                disabled={pending}
              >
                გაუქმება
              </Button>
              <Button type="button" size="sm" onClick={handleSave} disabled={pending || !hasChanges || totalDraft === 0}>
                <Save className="mr-1 h-4 w-4" />
                {pending ? 'ინახება...' : 'შენახვა'}
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-3">
          {draft.map((item) => {
            const original = baseItems.find((b) => b.productId === item.productId)
            const changed = editing && (original?.qty ?? 0) !== item.qty

            return (
              <div
                key={item.productId}
                className="flex flex-col gap-2 rounded-xl border p-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{item.label}</p>
                  {changed && original && (
                    <p className="text-xs text-amber-700">
                      იყო: {original.qty} ცალი → ახლა: {item.qty} ცალი
                    </p>
                  )}
                </div>
                {editing ? (
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setQty(item.productId, item.qty - 1)}
                      disabled={item.qty <= 0}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Input
                      type="number"
                      min={0}
                      value={item.qty}
                      onChange={(e) => setQty(item.productId, Number(e.target.value))}
                      className="h-8 w-16 text-center"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setQty(item.productId, item.qty + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <Badge variant="secondary">{item.qty} ცალი</Badge>
                )}
              </div>
            )
          })}

          <div className="border-t pt-3 text-sm font-semibold">
            სულ: {editing ? totalDraft : draft.reduce((s, i) => s + i.qty, 0)} ცალი
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          {editing && order.stockApplied && (
            <p className="text-xs text-muted-foreground">
              შენიშვნა: შეკვეთა უკვე შესრულებულია — სტოკი ავტომატურად გადაიწერება ცვლილების მიხედვით.
            </p>
          )}
        </CardContent>
      </Card>

      {(order.editHistory?.length ?? 0) > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">რედაქტირების ისტორია</CardTitle>
            <CardDescription>ადმინის მიერ შეტანილი ცვლილებები ამ შეკვეთაში</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[...(order.editHistory ?? [])].reverse().map((log) => (
              <div key={log.id} className="rounded-xl border bg-muted/20 p-4 space-y-2">
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-200">
                    ადმინმა დაარედაქტირა
                  </Badge>
                  <span className="text-muted-foreground">
                    {formatGeorgiaDateTime(log.editedAt, { withSeconds: true, padDayMonth: true })}
                  </span>
                </div>
                <ul className="space-y-1 text-sm">
                  {getOrderEditSummary(log).map((line, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-muted-foreground">•</span>
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
