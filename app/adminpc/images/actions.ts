'use server'

import { redirect } from 'next/navigation'
import { writeFile, mkdir, unlink } from 'fs/promises'
import { dirname, join } from 'path'
import { existsSync } from 'fs'
import { isAdmin } from '@/lib/auth'
import { getPublicPath, IMAGE_SLOTS } from '@/lib/images'

const ALLOWED_TYPES: Record<string, string[]> = {
  hero: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/x-png'],
  product1: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/x-png'],
  product2: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/x-png'],
  logo: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml', 'image/x-png'],
  favicon: ['image/jpeg', 'image/jpg', 'image/svg+xml', 'image/png', 'image/x-png'],
  appleIcon: ['image/jpeg', 'image/jpg', 'image/png', 'image/x-png'],
}

const LOGO_EXT = ['png', 'jpg', 'jpeg', 'webp', 'svg']

export async function uploadImage(slot: (typeof IMAGE_SLOTS)[number], formData: FormData) {
  const auth = await isAdmin()
  if (!auth) redirect('/adminpc')

  const file = formData.get('file') as File | null
  if (!file || file.size === 0) return { error: 'ფაილი არ არის არჩეული' }

  const allowed = ALLOWED_TYPES[slot]
  const ext = file.name.split('.').pop()?.toLowerCase()
  const validType = allowed?.includes(file.type)
  const validExt = (slot === 'logo' || slot === 'favicon' || slot === 'appleIcon') && ext && ['png', 'jpg', 'jpeg', 'webp', 'svg'].includes(ext)
  if (!validType && !validExt) {
    return { error: `დაუშვებელი ფორმატი. დაშვებული: PNG, JPG, WebP, SVG` }
  }

  const maxSize = 5 * 1024 * 1024
  if (file.size > maxSize) return { error: 'ფაილი ძალიან დიდია (მაქს 5MB)' }

  try {
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const base = process.env.PWD || process.cwd()
    const publicDir = join(base, 'public')
    let destPath: string
    if (slot === 'logo') {
      const safeExt = ['svg', 'png', 'webp', 'jpeg', 'jpg'].includes(ext) ? ext : 'png'
      destPath = join(publicDir, 'images', `logo.${safeExt}`)
      for (const oldExt of ['png', 'svg', 'jpg', 'jpeg', 'webp']) {
        if (oldExt !== safeExt) {
          const oldPath = join(publicDir, 'images', `logo.${oldExt}`)
          if (existsSync(oldPath)) await unlink(oldPath)
        }
      }
    } else if (slot === 'favicon' || slot === 'appleIcon') {
      const safeExt = ['svg', 'png', 'webp', 'jpeg', 'jpg'].includes(ext) ? ext : 'png'
      const baseName = slot === 'favicon' ? 'icon' : 'apple-icon'
      destPath = join(publicDir, `${baseName}.${safeExt}`)
      for (const oldExt of ['png', 'svg', 'jpg', 'jpeg', 'webp']) {
        if (oldExt !== safeExt) {
          const oldPath = join(publicDir, `${baseName}.${oldExt}`)
          if (existsSync(oldPath)) await unlink(oldPath)
        }
      }
    } else {
      destPath = getPublicPath(slot)
    }
    await mkdir(dirname(destPath), { recursive: true })
    await writeFile(destPath, buffer)
    return { success: true }
  } catch (e) {
    console.error(e)
    return { error: 'ატვირთვა ვერ მოხერხდა' }
  }
}
