'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { isAdmin } from '@/lib/auth'
import { addBlogPost, updateBlogPost, deleteBlogPost, type BlogReference, type MedicalReviewer } from '@/lib/blog'
import { slugify } from '@/lib/slugify'

function optionalField(value: FormDataEntryValue | null): string | undefined {
  if (typeof value !== 'string') return undefined
  const trimmed = value.trim()
  return trimmed || undefined
}

function parseReviewer(formData: FormData): MedicalReviewer | undefined {
  const name = optionalField(formData.get('reviewerName'))
  if (!name) return undefined
  const reviewer: MedicalReviewer = { name }
  const specialty = optionalField(formData.get('reviewerSpecialty'))
  const workplace = optionalField(formData.get('reviewerWorkplace'))
  const photo = optionalField(formData.get('reviewerPhoto'))
  const bio = optionalField(formData.get('reviewerBio'))
  const slug = optionalField(formData.get('reviewerSlug'))
  if (specialty) reviewer.specialty = specialty
  if (workplace) reviewer.workplace = workplace
  if (photo) reviewer.photo = photo
  if (bio) reviewer.bio = bio
  if (slug) reviewer.slug = slug
  return reviewer
}

function parseReferences(value: FormDataEntryValue | null): BlogReference[] | undefined {
  if (typeof value !== 'string') return undefined
  const items = value
    .split('\n')
    .map((line) => {
      const [title, url] = line.split('|').map((part) => part.trim())
      if (!title || !url) return null
      return { title, url }
    })
    .filter((item): item is BlogReference => item !== null)
  return items.length ? items : undefined
}

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
  const image = (formData.get('image') as string)?.trim() || '/images/hero-pregnant-woman.webp'
  const date = (formData.get('date') as string)?.trim() || new Date().toISOString().slice(0, 10)
  const updatedAt = optionalField(formData.get('updatedAt')) || date

  if (!slug || !title || !excerpt || !content) {
    return { error: 'შეავსეთ ყველა სავალდებულო ველი' }
  }

  try {
    await addBlogPost({
      slug,
      title,
      excerpt,
      content,
      image,
      imageAlt: optionalField(formData.get('imageAlt')),
      date,
      updatedAt,
      metaTitle: optionalField(formData.get('metaTitle')),
      metaDescription: optionalField(formData.get('metaDescription')),
      author: optionalField(formData.get('author')),
      medicalReviewer: parseReviewer(formData),
      reviewedAt: optionalField(formData.get('reviewedAt')),
      references: parseReferences(formData.get('references')),
    })
    revalidatePath('/adminpc/blog')
    revalidatePath('/blog')
    revalidatePath('/sitemap.xml')
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
  const updatedAt = optionalField(formData.get('updatedAt')) || new Date().toISOString().slice(0, 10)

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
      imageAlt: optionalField(formData.get('imageAlt')),
      date: date || undefined,
      updatedAt,
      metaTitle: optionalField(formData.get('metaTitle')),
      metaDescription: optionalField(formData.get('metaDescription')),
      author: optionalField(formData.get('author')),
      medicalReviewer: parseReviewer(formData),
      reviewedAt: optionalField(formData.get('reviewedAt')),
      references: parseReferences(formData.get('references')),
    })
    if (!updated) return { error: 'პოსტი ვერ მოიძებნა' }
    revalidatePath('/adminpc/blog')
    revalidatePath('/blog')
    revalidatePath(`/blog/${oldSlug}`)
    if (slug !== oldSlug) revalidatePath(`/blog/${slug}`)
    revalidatePath('/sitemap.xml')
    if (updated.medicalReviewer?.slug) revalidatePath(`/eqspertebi/${updated.medicalReviewer.slug}`)
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
  revalidatePath('/sitemap.xml')
  return { success: true }
}
