import Image from 'next/image'
import Link from 'next/link'
import { Leaf, Heart, Baby, Droplets } from 'lucide-react'
import { pageSlugForProduct } from '@/lib/product-pages'

const ICONS = [Leaf, Heart, Baby, Droplets] as const

type ProductItem = {
  id?: string
  name: string
  price?: number
  subtitle: string
  description: string
  features: string[]
  image?: string
}

type ProductsTexts = {
  sectionTitle: string
  sectionSubtitle: string
  ctaOrder: string
  items: ProductItem[]
}

const FALLBACK_IMAGES = ['/images/femibion-1.webp', '/images/femibion-2.webp']
const STYLES = [
  { surface: 'bg-card/90', image: 'bg-secondary/75', detail: 'bg-secondary/70' },
  { surface: 'bg-[#f4f2e9]/90', image: 'bg-accent/55', detail: 'bg-accent/60' },
]

export function ProductCards({ texts, images }: { texts: ProductsTexts; images?: string[] }) {
  const fallback = images?.length ? images : FALLBACK_IMAGES

  return (
    <section id="products" className="section-pad bg-background/80" aria-label="Femibion პროდუქცია">
      <div className="wrap">
        <div className="mb-12 text-center md:mb-16">
          <span className="eyebrow mb-4 justify-center">შერჩეული ფორმულები</span>
          <h2 className="section-heading">
            {texts.sectionTitle}
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
            {texts.sectionSubtitle}
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl gap-7 md:grid-cols-2 md:gap-8">
          {texts.items.map((product, idx) => {
            const style = STYLES[idx % STYLES.length]
            const imageSrc = product.image || fallback[idx] || fallback[0]
            const slug = pageSlugForProduct(product, idx)
            const href = slug ? `/${slug}` : null
            return (
              <article
                key={product.id ?? idx}
                className={`group overflow-hidden rounded-[2rem] border border-border/70 ${style.surface} p-4 shadow-[var(--shadow-soft)] transition-shadow duration-200 hover:shadow-[var(--shadow-card)] md:p-5 ${idx % 2 === 1 ? 'md:mt-10' : ''}`}
              >
                {href ? (
                  <Link href={href} className="block cursor-pointer">
                    <div className={`relative mb-7 aspect-[4/3] overflow-hidden rounded-[1.5rem] ${style.image}`}>
                      <Image
                        src={imageSrc}
                        alt={`${product.name} - ${product.subtitle}`}
                        fill
                        className="object-cover saturate-[0.9]"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                  </Link>
                ) : (
                  <div className={`relative mb-7 aspect-[4/3] overflow-hidden rounded-[1.5rem] ${style.image}`}>
                    <Image
                      src={imageSrc}
                      alt={`${product.name} - ${product.subtitle}`}
                      fill
                      className="object-cover saturate-[0.9]"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                )}

                <div className="space-y-5 px-2 pb-2">
                  <div className="relative">
                    <span className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-primary">
                      <span className="h-px w-6 bg-primary/50" aria-hidden />
                      {product.subtitle}
                    </span>
                    <div className="flex items-baseline justify-between gap-4">
                      {href ? (
                        <h3 className="text-2xl font-semibold tracking-[-0.02em] text-foreground">
                          <Link href={href} className="cursor-pointer hover:text-primary">
                            {product.name}
                          </Link>
                        </h3>
                      ) : (
                        <h3 className="text-2xl font-semibold tracking-[-0.02em] text-foreground">{product.name}</h3>
                      )}
                    {product.price != null && (
                        <p className="shrink-0 text-xl font-semibold text-primary">{product.price} ₾</p>
                    )}
                    </div>
                    <p className="mt-4 leading-7 text-muted-foreground">{product.description}</p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {(product.features ?? []).map((label, index) => {
                      const Icon = ICONS[index % ICONS.length]
                      return (
                        <span
                          key={index}
                          className={`inline-flex items-center gap-2 rounded-xl ${style.detail} px-3.5 py-2 text-sm font-medium text-foreground`}
                        >
                          <Icon className="h-4 w-4 text-primary" aria-hidden />
                          {label}
                        </span>
                      )
                    })}
                  </div>

                  <a href="#order" className="btn-primary w-full">
                    {texts.ctaOrder}
                  </a>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
