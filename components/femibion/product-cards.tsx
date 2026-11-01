'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCart } from '@/components/femibion/cart'
import { QtyStepper } from '@/components/femibion/qty-stepper'

type ProductsTexts = {
  sectionTitle: string
  sectionSubtitle: string
}

export function ProductCards({ texts }: { texts: ProductsTexts }) {
  const { products } = useCart()

  return (
    <section id="products" className="py-12 md:py-16" aria-labelledby="products-title">
      <div className="wrap">
        <div className="mb-6 grid max-w-[44rem] gap-2">
          <h2 id="products-title" className="section-heading">
            {texts.sectionTitle}
          </h2>
          <p className="text-[17px] text-muted-foreground">{texts.sectionSubtitle}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {products.map((product) => {
            const second = product.slug === 'femibion-2'
            const href = product.slug ? `/${product.slug}` : null
            return (
              <article
                key={product.id}
                className="panel-flat grid grid-cols-[96px_minmax(0,1fr)] items-start gap-4 p-4 sm:grid-cols-[150px_minmax(0,1fr)] sm:gap-5"
              >
                <div
                  className={cn(
                    'relative grid aspect-square place-items-center rounded-2xl',
                    second ? 'bg-f2-wash' : 'bg-f1-wash'
                  )}
                >
                  <Image
                    src={product.image}
                    alt={`${product.name} — ${product.subtitle}`}
                    fill
                    sizes="(max-width: 640px) 96px, 150px"
                    className="object-contain p-2 mix-blend-multiply"
                  />
                </div>
                <div className="flex h-full min-w-0 flex-col items-start gap-2">
                  <h3 className="text-[1.5rem] font-bold leading-tight tracking-[-0.02em]">
                    {href ? (
                      <Link href={href} className="hover:text-primary">
                        {product.name}
                      </Link>
                    ) : (
                      product.name
                    )}
                  </h3>
                  <p
                    className={cn(
                      'text-[13px] font-bold uppercase tracking-[0.06em]',
                      second ? 'text-f2-ink' : 'text-f1-ink'
                    )}
                  >
                    {product.subtitle}
                  </p>
                  <p className="text-[14.5px] leading-relaxed text-muted-foreground">{product.description}</p>
                  {product.features.length > 0 && (
                    <ul className="flex flex-wrap gap-1.5" aria-label="მთავარი კომპონენტები">
                      {product.features.map((feature) => (
                        <li key={feature} className="chip bg-background text-foreground">
                          {feature}
                        </li>
                      ))}
                    </ul>
                  )}
                  <div className="mt-auto flex w-full flex-wrap items-center justify-between gap-3 pt-1.5">
                    <span className="text-[1.45rem] font-extrabold tabular-nums">{product.price} ₾</span>
                    <QtyStepper product={product} />
                  </div>
                  {href && (
                    <Link
                      href={href}
                      className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-primary underline-offset-4 hover:underline"
                    >
                      დეტალურად
                      <ArrowRight className="h-4 w-4" aria-hidden />
                    </Link>
                  )}
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
