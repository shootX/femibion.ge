'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { isAdmin } from '@/lib/auth'
import {
  addProduct,
  updateProduct,
  deleteProduct,
  parseFeaturesInput,
  receiveStock,
} from '@/lib/products'

export async function uploadProductImage(formData: FormData): Promise<{ path?: string; error?: string }> {
  const auth = await isAdmin()
  if (!auth) redirect('/adminpc')

  const file = formData.get('file') as File | null
  if (!file || file.size === 0) return { error: 'ფაილი არ არის არჩეული' }

  const ext = file.name.split('.').pop()?.toLowerCase() || ''
  if (!['jpg', 'jpeg', 'png', 'webp'].includes(ext)) {
    return { error: 'დაუშვებელი ფორმატი. PNG, JPG, WebP' }
  }
  if (file.size > 5 * 1024 * 1024) return { error: 'ფაილი ძალიან დიდია (მაქს 5MB)' }

  try {
    const safeExt = ['jpg', 'jpeg', 'png', 'webp'].includes(ext) ? ext : 'jpg'
    const name = `product-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${safeExt}`
    const dir = join(process.cwd(), 'public', 'images', 'products')
    await mkdir(dir, { recursive: true })
    const bytes = await file.arrayBuffer()
    await writeFile(join(dir, name), Buffer.from(bytes))
    return { path: `/images/products/${name}` }
  } catch (e) {
    console.error(e)
    return { error: 'ატვირთვა ვერ მოხერხდა' }
  }
}

function readProductForm(formData: FormData) {
  const priceRaw = (formData.get('price') as string)?.trim()
  const stockRaw = (formData.get('stock') as string)?.trim()
  return {
    name: (formData.get('name') as string)?.trim(),
    subtitle: (formData.get('subtitle') as string)?.trim(),
    description: (formData.get('description') as string)?.trim(),
    price: priceRaw ? Number(priceRaw) : undefined,
    stock: stockRaw !== '' ? Number(stockRaw) : 0,
    features: parseFeaturesInput((formData.get('features') as string) ?? ''),
    image: (formData.get('image') as string)?.trim() || '/images/femibion-1.webp',
    orderLabel: (formData.get('orderLabel') as string)?.trim(),
    active: formData.get('active') === 'on',
  }
}

export async function createProduct(formData: FormData) {
  const auth = await isAdmin()
  if (!auth) redirect('/adminpc')

  const input = readProductForm(formData)
  if (!input.name || !input.subtitle || !input.description) {
    return { error: 'შეავსეთ სახელი, ქვესათაური და აღწერა' }
  }

  try {
    await addProduct(input)
    revalidateCatalog()
    revalidatePath('/blog')
    return { success: true }
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'შეცდომა' }
  }
}

export async function saveProduct(formData: FormData) {
  const auth = await isAdmin()
  if (!auth) redirect('/adminpc')

  const id = (formData.get('id') as string)?.trim()
  if (!id) return { error: 'ID არ არის' }

  const input = readProductForm(formData)
  if (!input.name || !input.subtitle || !input.description) {
    return { error: 'შეავსეთ სახელი, ქვესათაური და აღწერა' }
  }

  const updated = await updateProduct(id, input)
  if (!updated) return { error: 'პროდუქტი ვერ მოიძებნა' }

  revalidateCatalog()
  return { success: true }
}

export async function removeProduct(formData: FormData) {
  const auth = await isAdmin()
  if (!auth) redirect('/adminpc')

  const id = (formData.get('id') as string)?.trim()
  if (!id) return { error: 'ID არ არის' }

  const ok = await deleteProduct(id)
  if (!ok) return { error: 'პროდუქტი ვერ წაიშალა' }

  revalidateCatalog()
  return { success: true }
}

export async function addStockToWarehouse(formData: FormData) {
  const auth = await isAdmin()
  if (!auth) redirect('/adminpc')

  const id = (formData.get('id') as string)?.trim()
  const quantity = Number((formData.get('quantity') as string)?.trim())

  if (!id) return { error: 'პროდუქტი არ არის არჩეული' }
  if (!Number.isFinite(quantity) || quantity <= 0) {
    return { error: 'მიუთითეთ დადებითი რაოდენობა' }
  }

  const updated = await receiveStock(id, quantity)
  if (!updated) return { error: 'პროდუქტი ვერ მოიძებნა' }

  revalidateCatalog()
  return { success: true, stock: updated.stock }
}

function revalidateCatalog() {
  revalidatePath('/adminpc/products')
  revalidatePath('/')
  revalidatePath('/femibion-1')
  revalidatePath('/femibion-2')
  revalidatePath('/sitemap.xml')
}
