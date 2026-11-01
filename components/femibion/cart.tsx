'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { trackEvent, trackMeta } from '@/lib/analytics'
import { pageSlugForProduct, type ProductPageSlug } from '@/lib/product-slug'

export type CartProduct = {
  id: string
  name: string
  subtitle: string
  description: string
  features: string[]
  price: number
  image: string
  orderLabel: string
  inStock: boolean
  /** Which pack this is (drives colour and stage); null for a product that is neither. */
  slug: ProductPageSlug | null
}

type RawProduct = {
  id?: string
  name: string
  subtitle: string
  description: string
  features: string[]
  price?: number
  image?: string
  orderLabel?: string
  stock?: number
}

type CartContextValue = {
  products: CartProduct[]
  qty: Record<string, number>
  count: number
  subtotal: number
  /** false until the saved cart has been read from the browser */
  ready: boolean
  add: (id: string, amount?: number) => void
  setQty: (id: string, value: number) => void
  clear: () => void
  bySlug: (slug: ProductPageSlug) => CartProduct | undefined
}

export const MAX_QTY = 99
const STORAGE_KEY = 'femibion-cart-v1'
const FALLBACK_IMAGES = ['/images/femibion-1.webp', '/images/femibion-2.webp']

const CartContext = createContext<CartContextValue | null>(null)

export function toCartProducts(items: RawProduct[]): CartProduct[] {
  return items.map((p, idx) => ({
    id: p.id ?? `product-${idx}`,
    name: p.name,
    subtitle: p.subtitle,
    description: p.description,
    features: p.features ?? [],
    price: typeof p.price === 'number' && p.price > 0 ? p.price : 0,
    image: p.image || FALLBACK_IMAGES[idx] || FALLBACK_IMAGES[0],
    orderLabel: p.orderLabel || `${p.name} - ${p.subtitle}`,
    inStock: p.stock == null || p.stock > 0,
    slug: pageSlugForProduct(p, idx),
  }))
}

export function CartProvider({ items, children }: { items: RawProduct[]; children: React.ReactNode }) {
  const products = useMemo(() => toCartProducts(items), [items])
  const [qty, setQtyState] = useState<Record<string, number>>({})
  const [ready, setReady] = useState(false)

  useEffect(() => {
    try {
      const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '{}') as Record<string, unknown>
      const restored: Record<string, number> = {}
      for (const p of products) {
        const n = Math.floor(Number(saved[p.id]))
        if (p.inStock && Number.isFinite(n) && n > 0) restored[p.id] = Math.min(n, MAX_QTY)
      }
      setQtyState(restored)
    } catch {
      /* storage blocked or corrupt: start with an empty cart */
    }
    setReady(true)
  }, [products])

  useEffect(() => {
    if (!ready) return
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(qty))
    } catch {
      /* ignore */
    }
  }, [qty, ready])

  const setQty = useCallback(
    (id: string, value: number) => {
      const product = products.find((p) => p.id === id)
      if (!product) return
      const next = Math.max(0, Math.min(MAX_QTY, Math.floor(value) || 0))
      if (next > 0 && !product.inStock) return
      setQtyState((prev) => {
        const copy = { ...prev }
        if (next === 0) delete copy[id]
        else copy[id] = next
        return copy
      })
    },
    [products]
  )

  const add = useCallback(
    (id: string, amount = 1) => {
      const product = products.find((p) => p.id === id)
      if (!product || !product.inStock) return
      setQtyState((prev) => ({ ...prev, [id]: Math.min(MAX_QTY, (prev[id] ?? 0) + amount) }))
      trackEvent('add_to_cart', {
        currency: 'GEL',
        value: product.price * amount,
        item_id: product.id,
        item_name: product.name,
        quantity: amount,
      })
      trackMeta('AddToCart', {
        content_ids: [product.id],
        content_name: product.name,
        content_type: 'product',
        currency: 'GEL',
        value: product.price * amount,
      })
    },
    [products]
  )

  const clear = useCallback(() => setQtyState({}), [])

  const value = useMemo<CartContextValue>(() => {
    const count = products.reduce((sum, p) => sum + (qty[p.id] ?? 0), 0)
    const subtotal = products.reduce((sum, p) => sum + (qty[p.id] ?? 0) * p.price, 0)
    return {
      products,
      qty,
      count,
      subtotal,
      ready,
      add,
      setQty,
      clear,
      bySlug: (slug) => products.find((p) => p.slug === slug),
    }
  }, [products, qty, ready, add, setQty, clear])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>')
  return ctx
}
