import type { Product } from '@/lib/products'
import { getActiveProducts } from '@/lib/products'

export type ProductPageSlug = 'femibion-1' | 'femibion-2'

const PRICE_VALID_UNTIL = `${new Date().getFullYear() + 1}-12-31`
const BASE_URL = 'https://femibion.ge'

export function pageSlugForProduct(product: { name: string }, index: number): ProductPageSlug | null {
  if (/(^|[^0-9])2([^0-9]|$)/.test(product.name)) return 'femibion-2'
  if (/(^|[^0-9])1([^0-9]|$)/.test(product.name)) return 'femibion-1'
  if (index === 0) return 'femibion-1'
  if (index === 1) return 'femibion-2'
  return null
}

export async function getProductByPageSlug(slug: ProductPageSlug): Promise<Product | null> {
  const products = await getActiveProducts()
  const match = products.find((product, index) => pageSlugForProduct(product, index) === slug)
  return match ?? null
}

export function productJsonLd(product: Product, slug: ProductPageSlug) {
  const url = `${BASE_URL}/${slug}`
  const image = product.image.startsWith('http') ? product.image : `${BASE_URL}${product.image}`
  const sku = slug === 'femibion-1' ? 'FEMIBION-1' : 'FEMIBION-2'

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${url}#product`,
    name: product.name,
    sku,
    mpn: `${sku}-GE`,
    description: product.description,
    image: [image],
    brand: { '@type': 'Brand', name: 'Femibion' },
    manufacturer: { '@type': 'Organization', name: 'Procter & Gamble' },
    category: 'პრენატალური ვიტამინები',
    offers: {
      '@type': 'Offer',
      url,
      availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
      price: product.price ?? 0,
      priceCurrency: 'GEL',
      priceValidUntil: PRICE_VALID_UNTIL,
      seller: { '@id': `${BASE_URL}/#organization` },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: { '@type': 'MonetaryAmount', value: 0, currency: 'GEL' },
        shippingDestination: { '@type': 'DefinedRegion', addressCountry: 'GE' },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: { '@type': 'QuantitativeValue', minValue: 0, maxValue: 1, unitCode: 'DAY' },
          transitTime: { '@type': 'QuantitativeValue', minValue: 1, maxValue: 3, unitCode: 'DAY' },
        },
      },
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        applicableCountry: 'GE',
        returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
        merchantReturnDays: 3,
        returnMethod: 'https://schema.org/ReturnByMail',
        refundType: 'https://schema.org/FullRefund',
      },
    },
  }
}
