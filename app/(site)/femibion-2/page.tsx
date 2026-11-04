import { ProductLanding, productPageMetadata } from '@/components/femibion/product-landing'

export const revalidate = 3600

export function generateMetadata() {
  return productPageMetadata('femibion-2')
}

export default function Femibion2Page() {
  return <ProductLanding slug="femibion-2" />
}
