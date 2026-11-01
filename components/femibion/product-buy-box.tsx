'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useCart } from '@/components/femibion/cart'
import { QtyStepper } from '@/components/femibion/qty-stepper'
import { AddToCartButton } from '@/components/femibion/stage-finder'
import type { ProductPageSlug } from '@/lib/product-slug'

/** Buy controls on a product page: add first, then adjust quantity and go to checkout. */
export function ProductBuyBox({ slug }: { slug: ProductPageSlug }) {
  const { bySlug, qty, subtotal, ready } = useCart()
  const product = bySlug(slug)

  if (!product || !product.inStock) {
    return <p className="text-[15px] font-semibold text-muted-foreground">ამჟამად შეკვეთა შეუძლებელია</p>
  }

  const inCart = ready ? qty[product.id] ?? 0 : 0

  if (inCart === 0) return <AddToCartButton product={product} />

  return (
    <div className="flex flex-wrap items-center gap-3">
      <QtyStepper product={product} />
      <Link href="/#order" className="btn-primary">
        გაფორმება — {subtotal} ₾
        <ArrowRight className="h-[18px] w-[18px]" aria-hidden />
      </Link>
    </div>
  )
}
