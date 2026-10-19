import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Leaf, Heart, Baby, Droplets } from 'lucide-react'
import { getSiteTexts } from '@/lib/texts'
import { getImagePaths } from '@/lib/images-server'
import { Header } from '@/components/femibion/header'
import { Footer } from '@/components/femibion/footer'
import { getProductByPageSlug, productJsonLd, type ProductPageSlug } from '@/lib/product-pages'
import { pageTitle } from '@/lib/seo'
import { MetaViewContent } from '@/components/femibion/meta-view-content'

const ICONS = [Leaf, Heart, Baby, Droplets] as const
const BASE_URL = 'https://femibion.ge'

export async function productPageMetadata(slug: ProductPageSlug): Promise<Metadata> {
  const product = await getProductByPageSlug(slug)
  if (!product) {
    return { title: 'პროდუქტი ვერ მოიძებნა', robots: { index: false, follow: false } }
  }

  const canonical = `${BASE_URL}/${slug}`
  const titled = pageTitle(`${product.name} — ${product.subtitle}`)
  const title = titled.absolute
  const image = product.image.startsWith('http') ? product.image : `${BASE_URL}${product.image}`

  return {
    title: titled,
    description: product.description,
    alternates: {
      canonical,
      languages: { ka: canonical, 'x-default': canonical },
    },
    robots: { index: true, follow: true },
    openGraph: {
      title,
      description: product.description,
      url: canonical,
      type: 'website',
      locale: 'ka_GE',
      siteName: 'Femibion Georgia',
      images: [{ url: image, alt: `${product.name} — ${product.subtitle}` }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: product.description,
      images: [image],
    },
  }
}

export async function ProductLanding({ slug }: { slug: ProductPageSlug }) {
  const [texts, images, product] = await Promise.all([
    getSiteTexts(),
    getImagePaths(),
    getProductByPageSlug(slug),
  ])

  if (!product) notFound()

  const canonical = `${BASE_URL}/${slug}`
  const inStock = product.stock > 0
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'მთავარი', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: product.name, item: canonical },
    ],
  }

  return (
    <div className="min-h-screen bg-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd(product, slug)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <MetaViewContent id={slug} value={product.price ?? (slug === 'femibion-1' ? 100 : 140)} />
      <Header texts={texts.header} images={images} />
      <main className="section-pad !pt-10">
        <div className="wrap">
          <nav aria-label="ნავიგაცია" className="mb-8 text-sm text-muted-foreground">
            <Link href="/" className="cursor-pointer hover:text-primary">მთავარი</Link>
            <span className="px-2" aria-hidden>/</span>
            <span className="text-foreground">{product.name}</span>
          </nav>

          <article className="grid items-start gap-8 md:grid-cols-2 md:gap-12">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] bg-secondary/75">
              <Image
                src={product.image}
                alt={`${product.name} — ${product.subtitle}`}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>

            <div>
              <h1 className="text-3xl font-semibold tracking-[-0.02em] text-foreground sm:text-4xl">{product.name}</h1>
              <h2 className="eyebrow mt-3">{product.subtitle}</h2>
              {product.price != null && (
                <p className="mt-4 text-2xl font-semibold text-primary">{product.price} ₾</p>
              )}
              <p className="mt-2 text-sm text-muted-foreground">{inStock ? 'მარაგშია' : 'ამოიწურა'}</p>
              <p className="mt-5 text-lg leading-8 text-muted-foreground">{product.description}</p>
              {product.features.length > 0 && (
                <ul className="mt-6 flex flex-wrap gap-2">
                  {product.features.map((label, index) => {
                    const Icon = ICONS[index % ICONS.length]
                    return (
                      <li key={label} className="inline-flex items-center gap-2 rounded-xl bg-secondary/70 px-3.5 py-2 text-sm font-medium text-foreground">
                        <Icon className="h-4 w-4 text-primary" aria-hidden />
                        {label}
                      </li>
                    )
                  })}
                </ul>
              )}
              {inStock ? (
                <Link href={`/?product=${product.id}#order`} className="btn-primary mt-8">
                  {texts.products.ctaOrder || 'შეკვეთა'}
                </Link>
              ) : (
                <p className="mt-8 text-sm font-medium text-muted-foreground">ამჟამად შეკვეთა შეუძლებელია</p>
              )}
            </div>
          </article>
        </div>
      </main>
      <Footer texts={texts.footer} images={images} />
    </div>
  )
}
