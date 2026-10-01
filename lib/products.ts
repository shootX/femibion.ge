import { readFile, writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { unstable_noStore } from 'next/cache'

export type Product = {
  id: string
  name: string
  price?: number
  subtitle: string
  description: string
  features: string[]
  image: string
  orderLabel: string
  active: boolean
  stock: number
}

type ProductsFile = {
  items: Product[]
}

const PRODUCTS_FILE = 'data/products.json'

function getDataDir(): string {
  return join(process.env.PWD || process.cwd(), 'data')
}

function getProductsPath(): string {
  return join(getDataDir(), 'products.json')
}

function getSiteTextsPath(): string {
  return join(getDataDir(), 'site-texts.json')
}

function newProductId(): string {
  return `prod_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}

function normalizeProduct(raw: Partial<Product> & { price?: number | string }): Product {
  const name = String(raw.name ?? '').trim()
  const subtitle = String(raw.subtitle ?? '').trim()
  const priceRaw = raw.price
  const price =
    priceRaw != null && priceRaw !== '' && !Number.isNaN(Number(priceRaw))
      ? Number(priceRaw)
      : undefined

  return {
    id: raw.id?.trim() || newProductId(),
    name,
    price,
    subtitle,
    description: String(raw.description ?? '').trim(),
    features: Array.isArray(raw.features)
      ? raw.features.map((f) => String(f).trim()).filter(Boolean)
      : [],
    image: String(raw.image ?? '/images/femibion-1.webp').trim(),
    orderLabel: String(raw.orderLabel ?? '').trim() || `${name} - ${subtitle}`,
    active: raw.active !== false,
    stock: Number.isFinite(Number(raw.stock)) ? Math.floor(Number(raw.stock)) : 0,
  }
}

async function seedFromSiteTexts(): Promise<ProductsFile> {
  const defaults = ['/images/femibion-1.webp', '/images/femibion-2.webp']
  try {
    const data = await readFile(getSiteTextsPath(), 'utf-8')
    const parsed = JSON.parse(data) as {
      products?: { items?: Array<Partial<Product>> }
      order?: { product1Option?: string; product2Option?: string }
    }
    const items = (parsed.products?.items ?? []).map((item, idx) =>
      normalizeProduct({
        id: `prod_default_${idx + 1}`,
        name: item.name,
        price: item.price,
        subtitle: item.subtitle,
        description: item.description,
        features: item.features,
        image: defaults[idx] ?? defaults[0],
        orderLabel:
          idx === 0
            ? parsed.order?.product1Option
            : idx === 1
              ? parsed.order?.product2Option
              : undefined,
        active: true,
      })
    )
    if (items.length > 0) return { items }
  } catch {
    /* use hardcoded fallback */
  }

  return {
    items: [
      normalizeProduct({
        id: 'prod_default_1',
        name: 'Femibion 1',
        price: 100,
        subtitle: 'დაგეგმვა & I ტრიმესტრი',
        description:
          'ოპტიმალური ფორმულა ორსულობის დაგეგმვისა და პირველი ტრიმესტრისთვის.',
        features: ['Metafolin®', 'ფოლატი 800მკგ'],
        image: defaults[0],
        orderLabel: 'Femibion 1 - დაგეგმვა & I ტრიმესტრი',
        active: true,
      }),
      normalizeProduct({
        id: 'prod_default_2',
        name: 'Femibion 2',
        price: 140,
        subtitle: 'II-III ტრიმესტრი & ლაქტაცია',
        description: 'გაფართოებული ფორმულა მეორე და მესამე ტრიმესტრისთვის.',
        features: ['DHA Omega-3', '200მგ DHA'],
        image: defaults[1],
        orderLabel: 'Femibion 2 - II-III ტრიმესტრი & ლაქტაცია',
        active: true,
      }),
    ],
  }
}

async function readProductsFile(): Promise<ProductsFile> {
  unstable_noStore()
  try {
    const data = await readFile(getProductsPath(), 'utf-8')
    const parsed = JSON.parse(data) as ProductsFile
    if (!Array.isArray(parsed.items)) return { items: [] }
    return { items: parsed.items.map((item) => normalizeProduct(item)) }
  } catch {
    const seeded = await seedFromSiteTexts()
    await writeProductsFile(seeded)
    return seeded
  }
}

async function writeProductsFile(data: ProductsFile): Promise<void> {
  await mkdir(getDataDir(), { recursive: true })
  await writeFile(getProductsPath(), JSON.stringify(data, null, 2), 'utf-8')
}

async function syncProductsToSiteTexts(items: Product[]): Promise<void> {
  const active = items.filter((p) => p.active)
  let texts: Record<string, unknown> = {}

  try {
    const raw = await readFile(getSiteTextsPath(), 'utf-8')
    texts = JSON.parse(raw) as Record<string, unknown>
  } catch {
    return
  }

  const products = (texts.products as Record<string, unknown>) ?? {}
  products.items = active.map(({ name, price, subtitle, description, features }) => ({
    name,
    price,
    subtitle,
    description,
    features,
  }))
  texts.products = products

  const order = (texts.order as Record<string, unknown>) ?? {}
  if (active[0]) order.product1Option = active[0].orderLabel
  if (active[1]) order.product2Option = active[1].orderLabel
  texts.order = order

  await writeFile(getSiteTextsPath(), JSON.stringify(texts, null, 2), 'utf-8')
}

export async function getAllProducts(): Promise<Product[]> {
  const data = await readProductsFile()
  return data.items
}

export async function getActiveProducts(): Promise<Product[]> {
  return (await getAllProducts()).filter((p) => p.active)
}

export async function getProductById(id: string): Promise<Product | null> {
  return (await getAllProducts()).find((p) => p.id === id) ?? null
}

export async function addProduct(
  input: Omit<Product, 'id'> & { id?: string }
): Promise<Product> {
  const data = await readProductsFile()
  const product = normalizeProduct(input)
  data.items.push(product)
  await writeProductsFile(data)
  await syncProductsToSiteTexts(data.items)
  return product
}

export async function updateProduct(
  id: string,
  input: Partial<Omit<Product, 'id'>>
): Promise<Product | null> {
  const data = await readProductsFile()
  const idx = data.items.findIndex((p) => p.id === id)
  if (idx === -1) return null
  const updated = normalizeProduct({ ...data.items[idx], ...input, id })
  data.items[idx] = updated
  await writeProductsFile(data)
  await syncProductsToSiteTexts(data.items)
  return updated
}

export async function deleteProduct(id: string): Promise<boolean> {
  const data = await readProductsFile()
  const next = data.items.filter((p) => p.id !== id)
  if (next.length === data.items.length) return false
  await writeProductsFile({ items: next })
  await syncProductsToSiteTexts(next)
  return true
}

export async function receiveStock(id: string, quantity: number): Promise<Product | null> {
  const qty = Math.floor(Number(quantity))
  if (!id || qty <= 0) return null
  const data = await readProductsFile()
  const idx = data.items.findIndex((p) => p.id === id)
  if (idx === -1) return null
  data.items[idx] = normalizeProduct({
    ...data.items[idx],
    stock: data.items[idx].stock + qty,
  })
  await writeProductsFile(data)
  return data.items[idx]
}

export async function setProductStock(id: string, stock: number): Promise<Product | null> {
  const qty = Math.floor(Number(stock) || 0)
  return updateProduct(id, { stock: qty })
}

export type StockLineItem = {
  productId?: string
  label: string
  qty: number
}

async function resolveProductId(
  items: Product[],
  productId: string | undefined,
  label: string
): Promise<string | null> {
  if (productId) {
    const byId = items.find((p) => p.id === productId)
    if (byId) return byId.id
  }
  const byLabel = items.find((p) => p.orderLabel === label || p.name === label)
  return byLabel?.id ?? null
}

/** ჩამოჭრა (negative qty) ან დაბრუნება (positive qty) საწყობში */
export async function adjustStockByLineItems(
  lineItems: StockLineItem[],
  mode: 'deduct' | 'restore'
): Promise<void> {
  const data = await readProductsFile()
  const sign = mode === 'deduct' ? -1 : 1

  for (const line of lineItems) {
    if (line.qty <= 0) continue
    const productId = await resolveProductId(data.items, line.productId, line.label)
    if (!productId) continue
    const idx = data.items.findIndex((p) => p.id === productId)
    if (idx === -1) continue
    data.items[idx] = normalizeProduct({
      ...data.items[idx],
      stock: data.items[idx].stock + sign * line.qty,
    })
  }

  await writeProductsFile(data)
}

export function parseFeaturesInput(value: string): string[] {
  return value
    .split(/[\n,]/)
    .map((s) => s.trim())
    .filter(Boolean)
}
