import Image from 'next/image'
import { Leaf, Heart, Baby, Droplets } from 'lucide-react'

const ICONS = [Leaf, Heart, Baby, Droplets] as const

type ProductsTexts = {
  sectionTitle: string
  sectionSubtitle: string
  ctaOrder: string
  items: Array<{ name: string; price?: number; subtitle: string; description: string; features: string[] }>
}

const DEFAULT_IMAGES = ['/images/femibion-1.jpg', '/images/femibion-2.jpg']
const STYLES = [
  { color: 'from-pink-50 to-rose-50', borderColor: 'border-pink-200' },
  { color: 'from-rose-50 to-pink-100', borderColor: 'border-rose-200' },
]

export function ProductCards({ texts, images }: { texts: ProductsTexts; images?: string[] }) {
  const imgList = images?.length ? images : DEFAULT_IMAGES
  return (
    <section id="products" className="py-16 md:py-24 bg-background" aria-label="Femibion პროდუქცია - ორსულობის ვიტამინები">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4 text-balance">
            {texts.sectionTitle}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {texts.sectionSubtitle}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 max-w-5xl mx-auto">
          {texts.items.map((product, idx) => (
            <div
              key={idx}
              className={`group relative overflow-hidden rounded-3xl border-2 ${STYLES[idx]?.borderColor} bg-gradient-to-br ${STYLES[idx]?.color} p-6 md:p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}
            >
              <div className="flex flex-col h-full">
                <div className="relative aspect-[4/3] mb-6 rounded-2xl overflow-hidden bg-white shadow-lg">
                  <Image
                    src={imgList[idx] ?? DEFAULT_IMAGES[0]}
                    alt={`${product.name} - ${product.subtitle} - პრენატალური ვიტამინები საქართველოში`}
                    fill
                    unoptimized
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>

                <div className="flex-1">
                  <div className="mb-4">
                    <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-2">
                      {product.subtitle}
                    </span>
                    <h3 className="text-2xl font-bold text-foreground mb-2">
                      {product.name}
                    </h3>
                    {product.price != null && (
                      <p className="text-xl font-semibold text-primary mb-2">
                        {product.price} ₾
                      </p>
                    )}
                    <p className="text-muted-foreground leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3 mb-6">
                    {(product.features ?? []).map((label, index) => {
                      const Icon = ICONS[index % ICONS.length]
                      return (
                        <div
                          key={index}
                          className="flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 shadow-sm"
                        >
                          <Icon className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium text-foreground">
                            {label}
                          </span>
                        </div>
                      )
                    })}
                  </div>

                  <a
                    href="#order"
                    className="inline-flex w-full h-12 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 hover:shadow-xl"
                  >
                    {texts.ctaOrder}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
