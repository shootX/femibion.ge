'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { isAdmin } from '@/lib/auth'
import { addBlogPost, updateBlogPost, deleteBlogPost } from '@/lib/blog'
import { slugify } from '@/lib/slugify'
import type { BlogPost } from '@/lib/blog'

export async function uploadBlogImage(formData: FormData): Promise<{ path?: string; error?: string }> {
  const auth = await isAdmin()
  if (!auth) redirect('/adminpc')

  const file = formData.get('file') as File | null
  if (!file || file.size === 0) return { error: 'ფაილი არ არის არჩეული' }

  const ext = file.name.split('.').pop()?.toLowerCase() || ''
  if (!['jpg', 'jpeg', 'png', 'webp'].includes(ext)) return { error: 'დაუშვებელი ფორმატი. PNG, JPG, WebP' }
  if (file.size > 5 * 1024 * 1024) return { error: 'ფაილი ძალიან დიდია (მაქს 5MB)' }

  try {
    const safeExt = ['jpg', 'jpeg', 'png', 'webp'].includes(ext) ? ext : 'jpg'
    const name = `blog-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${safeExt}`
    const base = process.cwd()
    const dir = join(base, 'public', 'images', 'blog')
    await mkdir(dir, { recursive: true })
    const destPath = join(dir, name)
    const bytes = await file.arrayBuffer()
    await writeFile(destPath, Buffer.from(bytes))
    return { path: `/images/blog/${name}` }
  } catch (e) {
    console.error(e)
    return { error: 'ატვირთვა ვერ მოხერხდა' }
  }
}

export async function createPost(formData: FormData) {
  const auth = await isAdmin()
  if (!auth) redirect('/adminpc')

  const slug = slugify((formData.get('slug') as string)?.trim() || '')
  const title = (formData.get('title') as string)?.trim()
  const excerpt = (formData.get('excerpt') as string)?.trim()
  const content = (formData.get('content') as string)?.trim()
  const image = (formData.get('image') as string)?.trim() || '/images/hero-pregnant-woman.jpg'
  const date = (formData.get('date') as string)?.trim() || new Date().toISOString().slice(0, 10)

  if (!slug || !title || !excerpt || !content) {
    return { error: 'შეავსეთ ყველა სავალდებულო ველი' }
  }

  try {
    await addBlogPost({ slug, title, excerpt, content, image, date })
    revalidatePath('/adminpc/blog')
    revalidatePath('/blog')
    return { success: true }
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'შეცდომა' }
  }
}

export async function updatePost(formData: FormData) {
  const auth = await isAdmin()
  if (!auth) redirect('/adminpc')

  const oldSlug = formData.get('oldSlug') as string
  const slug = slugify((formData.get('slug') as string)?.trim() || '')
  const title = (formData.get('title') as string)?.trim()
  const excerpt = (formData.get('excerpt') as string)?.trim()
  const content = (formData.get('content') as string)?.trim()
  const image = (formData.get('image') as string)?.trim()
  const date = (formData.get('date') as string)?.trim()

  if (!oldSlug || !slug || !title || !excerpt || !content) {
    return { error: 'შეავსეთ ყველა სავალდებულო ველი' }
  }

  try {
    const updated = await updateBlogPost(oldSlug, {
      slug,
      title,
      excerpt,
      content,
      image: image || undefined,
      date: date || undefined,
    })
    if (!updated) return { error: 'პოსტი ვერ მოიძებნა' }
    revalidatePath('/adminpc/blog')
    revalidatePath('/blog')
    revalidatePath(`/blog/${oldSlug}`)
    if (slug !== oldSlug) revalidatePath(`/blog/${slug}`)
    return { success: true }
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'შეცდომა' }
  }
}

export async function removePost(formData: FormData) {
  const auth = await isAdmin()
  if (!auth) redirect('/adminpc')

  const slug = formData.get('slug') as string
  if (!slug) return { error: 'slug არ არის' }

  const ok = await deleteBlogPost(slug)
  if (!ok) return { error: 'პოსტი ვერ წაიშალა' }
  revalidatePath('/adminpc/blog')
  revalidatePath('/blog')
  return { success: true }
}
