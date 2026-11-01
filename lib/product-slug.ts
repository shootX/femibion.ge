/** Client-safe helpers for mapping a product to its landing page (no server imports). */
export type ProductPageSlug = 'femibion-1' | 'femibion-2'

export function pageSlugForProduct(product: { name: string }, index: number): ProductPageSlug | null {
  if (/(^|[^0-9])2([^0-9]|$)/.test(product.name)) return 'femibion-2'
  if (/(^|[^0-9])1([^0-9]|$)/.test(product.name)) return 'femibion-1'
  if (index === 0) return 'femibion-1'
  if (index === 1) return 'femibion-2'
  return null
}
