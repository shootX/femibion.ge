import { ProductLanding, productPageMetadata } from '@/components/femibion/product-landing'

export const revalidate = 3600

export function generateMetadata() {
  return productPageMetadata('femibion-1')
}

export default function Femibion1Page() {
  return <ProductLanding slug="femibion-1" />
}
