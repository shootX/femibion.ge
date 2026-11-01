'use client'

import { Minus, Plus } from 'lucide-react'
import { MAX_QTY, useCart, type CartProduct } from '@/components/femibion/cart'

/** −/+ control bound to the cart for one product. */
export function QtyStepper({ product }: { product: CartProduct }) {
  const { qty, setQty, add } = useCart()
  const value = qty[product.id] ?? 0

  if (!product.inStock) {
    return <span className="text-[14px] font-semibold text-muted-foreground">ამოიწურა</span>
  }

  return (
    <div
      role="group"
      aria-label={`${product.name}, რაოდენობა`}
      className="inline-flex items-center rounded-[12px] border-[1.5px] border-input bg-white"
    >
      <button
        type="button"
        onClick={() => setQty(product.id, value - 1)}
        disabled={value === 0}
        aria-label={`${product.name}: შემცირება`}
        className="press grid h-[42px] w-[42px] cursor-pointer place-items-center rounded-[11px] text-foreground disabled:cursor-default disabled:text-[#c9c1d3]"
      >
        <Minus className="h-4 w-4" aria-hidden />
      </button>
      <output aria-live="polite" className="min-w-7 text-center font-bold tabular-nums">
        {value}
      </output>
      <button
        type="button"
        onClick={() => add(product.id)}
        disabled={value >= MAX_QTY}
        aria-label={`${product.name}: გაზრდა`}
        className="press grid h-[42px] w-[42px] cursor-pointer place-items-center rounded-[11px] text-foreground disabled:cursor-default disabled:text-[#c9c1d3]"
      >
        <Plus className="h-4 w-4" aria-hidden />
      </button>
    </div>
  )
}
