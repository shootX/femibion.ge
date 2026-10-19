import type { MetadataRoute } from 'next'
import { stat } from 'fs/promises'
import { join } from 'path'
import { unstable_noStore } from 'next/cache'
import { getBlogPosts } from '@/lib/blog'
import { getPrivacyPolicy } from '@/lib/privacy-policy'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const BASE_URL = 'https://femibion.ge'

function safeDate(value: unknown, fallback: Date): Date {
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value
  if (typeof value === 'string' && value.trim()) {
    const parsed = new Date(value)
    if (!Number.isNaN(parsed.getTime())) return parsed
  }
  return fallback
}

function latestDate(dates: Date[], fallback: Date): Date {
  const valid = dates.filter((date) => !Number.isNaN(date.getTime()))
  if (valid.length === 0) return fallback
  return valid.reduce((latest, current) => (current.getTime() > latest.getTime() ? current : latest))
}

async function fileMtime(relativePath: string): Promise<Date | null> {
  try {
    const info = await stat(join(process.cwd(), relativePath))
    return Number.isNaN(info.mtime.getTime()) ? null : info.mtime
  } catch {
    return null
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  unstable_noStore()
  const now = new Date()

  try {
    const [posts, privacy, faqUpdated, productsUpdated] = await Promise.all([
      getBlogPosts(),
      getPrivacyPolicy(),
      fileMtime('data/faq.json'),
      fileMtime('data/products.json'),
    ])

    const blogPages: MetadataRoute.Sitemap = posts
      .filter((post) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(post.slug))
      .map((post) => ({
        url: `${BASE_URL}/blog/${post.slug}`,
        lastModified: safeDate(post.updatedAt || post.date, now),
        changeFrequency: 'monthly',
        priority: 0.7,
      }))

    const blogUpdated = latestDate(
      blogPages.map((page) => page.lastModified).filter((date): date is Date => date instanceof Date),
      now
    )
    const privacyUpdated = safeDate(privacy.updatedAt, now)
    const homeUpdated = latestDate(
      [blogUpdated, privacyUpdated, faqUpdated, productsUpdated].filter((date): date is Date => date instanceof Date),
      now
    )

    return [
      { url: BASE_URL, lastModified: homeUpdated, changeFrequency: 'weekly', priority: 1 },
      { url: `${BASE_URL}/femibion-1`, lastModified: productsUpdated ?? now, changeFrequency: 'weekly', priority: 0.9 },
      { url: `${BASE_URL}/femibion-2`, lastModified: productsUpdated ?? now, changeFrequency: 'weekly', priority: 0.9 },
      { url: `${BASE_URL}/blog`, lastModified: blogUpdated, changeFrequency: 'weekly', priority: 0.8 },
      { url: `${BASE_URL}/faq`, lastModified: faqUpdated ?? now, changeFrequency: 'monthly', priority: 0.6 },
      { url: `${BASE_URL}/privacy`, lastModified: privacyUpdated, changeFrequency: 'monthly', priority: 0.5 },
      { url: `${BASE_URL}/terms`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
      ...blogPages,
    ]
  } catch (error) {
    console.error('sitemap failed', error)
    return [{ url: BASE_URL, lastModified: now, changeFrequency: 'weekly', priority: 1 }]
  }
}
