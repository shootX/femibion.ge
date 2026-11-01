import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { ArrowRight, Calculator, Check } from 'lucide-react'
import { getSiteTexts } from '@/lib/texts'
import { getImagePaths } from '@/lib/images-server'
import { Header } from '@/components/femibion/header'
import { Footer } from '@/components/femibion/footer'
import { getProductByPageSlug, productJsonLd, type ProductPageSlug } from '@/lib/product-pages'
import { pageTitle } from '@/lib/seo'
import { MetaViewContent } from '@/components/femibion/meta-view-content'
import { SiteBreadcrumbs } from '@/components/femibion/site-breadcrumbs'
import { ProductBuyBox } from '@/components/femibion/product-buy-box'
import { cn } from '@/lib/utils'

const BASE_URL = 'https://femibion.ge'

/** Stage and dose per pack; the dose wording comes from the site's own FAQ (data/faq.json). */
const PACK_FACTS: Record<ProductPageSlug, { range: string; stage: string; dose: string; other: ProductPageSlug; otherNote: string }> = {
  'femibion-1': {
    range: 'დაგეგმვა – მე-12 კვირა',
    stage: 'დაგეგმვიდან მე-12 კვირამდე',
    dose: '1 ტაბლეტი დღეში',
    other: 'femibion-2',
    otherNote: 'მე-13 კვირიდან გადადი Femibion 2-ზე: დამატებით შეიცავს DHA ომეგა-3-ს.',
  },
  'femibion-2': {
    range: 'მე-13 კვირა – ლაქტაცია',
    stage: 'მე-13 კვირიდან ლაქტაციის ბოლომდე',
    dose: '1 ტაბლეტი და 1 კაფსულა დღეში',
    other: 'femibion-1',
    otherNote: 'ჯერ ორსულობას გეგმავ ან პირველ ტრიმესტრში ხარ? შენთვის Femibion 1-ია.',
  },
}

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
      images: [{ url: image, width: 600, height: 600, alt: `${product.name} — ${product.subtitle}` }],
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

  const facts = PACK_FACTS[slug]
  const second = slug === 'femibion-2'
  const other = await getProductByPageSlug(facts.other)

  return (
    <div className="min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd(product, slug)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <MetaViewContent id={slug} value={product.price ?? (slug === 'femibion-1' ? 100 : 140)} />
      <Header texts={texts.header} images={images} />
      <main className="pb-14 pt-6 md:pb-20 md:pt-8">
        <div className="wrap">
          <SiteBreadcrumbs items={[{ href: '/', label: 'მთავარი' }, { label: product.name }]} />

          <article className="grid items-start gap-6 md:grid-cols-2 md:gap-10">
            <div className={cn('relative aspect-square overflow-hidden rounded-[22px]', second ? 'bg-f2-wash' : 'bg-f1-wash')}>
              <Image
                src={product.image}
                alt={`${product.name} — ${product.subtitle}`}
                fill
                priority
                className="object-contain p-6 mix-blend-multiply sm:p-10"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>

            <div className="grid content-start justify-items-start gap-4">
              <span className={cn('chip text-[13.5px]', second ? 'bg-f2-wash text-f2-ink' : 'bg-f1-wash text-f1-ink')}>
                {facts.range}
              </span>
              <div className="grid gap-1.5">
                <h1 className="text-[2.4rem] font-bold leading-[1.05] tracking-[-0.025em] sm:text-[3rem]">{product.name}</h1>
                <h2 className="text-[17px] font-semibold text-muted-foreground">{product.subtitle}</h2>
              </div>
              <p className="max-w-[60ch] text-[17px] leading-relaxed text-muted-foreground">{product.description}</p>

              {product.features.length > 0 && (
                <ul className="grid gap-2" aria-label="მთავარი კომპონენტები">
                  {product.features.map((label) => (
                    <li key={label} className="flex items-start gap-2.5 text-[16px]">
                      <Check className="mt-[3px] h-[18px] w-[18px] shrink-0 text-primary" aria-hidden />
                      {label}
                    </li>
                  ))}
                </ul>
              )}

              <dl className="grid w-full max-w-[30rem] border-t border-border text-[15px]">
                <div className="grid grid-cols-[7.5rem_minmax(0,1fr)] gap-3 border-b border-border py-3">
                  <dt className="text-muted-foreground">ეტაპი</dt>
                  <dd className="font-semibold">{facts.stage}</dd>
                </div>
                <div className="grid grid-cols-[7.5rem_minmax(0,1fr)] gap-3 border-b border-border py-3">
                  <dt className="text-muted-foreground">მიღება</dt>
                  <dd className="font-semibold">{facts.dose}</dd>
                </div>
              </dl>

              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                {product.price != null && (
                  <p className="text-[2.2rem] font-extrabold tracking-[-0.02em] tabular-nums">{product.price} ₾</p>
                )}
                <p className={cn('inline-flex items-center gap-2 text-[14px] font-semibold', inStock ? 'text-[#1f6b45]' : 'text-muted-foreground')}>
                  <span className={cn('h-2 w-2 rounded-full', inStock ? 'bg-[#2e9d63]' : 'bg-muted-foreground')} aria-hidden />
                  {inStock ? 'მარაგშია' : 'ამოიწურა'}
                </p>
              </div>

              <ProductBuyBox slug={slug} />
              <p className="text-[14px] text-muted-foreground">
                თბილისში მიწოდება უფასოა, 1–3 სამუშაო დღე. გადახდა მიწოდებისას.
              </p>
            </div>
          </article>

          <section className="mt-10 grid gap-4 md:mt-14 md:grid-cols-2" aria-label="სხვა ეტაპი">
            {other && (
              <Link
                href={`/${facts.other}`}
                className="panel-flat press group grid grid-cols-[88px_minmax(0,1fr)] items-center gap-4 p-4"
              >
                <span className={cn('relative aspect-square rounded-2xl', second ? 'bg-f1-wash' : 'bg-f2-wash')}>
                  <Image src={other.image} alt="" fill sizes="88px" className="object-contain p-1.5 mix-blend-multiply" />
                </span>
                <span className="grid gap-1">
                  <b className="text-[17px] group-hover:text-primary">{other.name}</b>
                  <span className="text-[14.5px] leading-normal text-muted-foreground">{facts.otherNote}</span>
                </span>
              </Link>
            )}
            <Link href="/#finder" className="panel-flat press group grid grid-cols-[auto_minmax(0,1fr)] items-center gap-4 p-5">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-background text-primary">
                <Calculator className="h-6 w-6" aria-hidden />
              </span>
              <span className="grid gap-1">
                <b className="inline-flex items-center gap-1.5 text-[17px] group-hover:text-primary">
                  რომელი Femibion გჭირდება?
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </b>
                <span className="text-[14.5px] leading-normal text-muted-foreground">
                  მიუთითე კვირა კალკულატორში და გაჩვენებთ შენს ფორმულას.
                </span>
              </span>
            </Link>
          </section>
        </div>
      </main>
      <Footer texts={texts.footer} images={images} />
    </div>
  )
}
