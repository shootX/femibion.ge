import { readFile, writeFile } from 'fs/promises'
import { join } from 'path'

export type BlogPost = {
  slug: string
  title: string
  excerpt: string
  content: string
  image: string
  imageAlt?: string
  date: string
  updatedAt?: string
  metaTitle?: string
  metaDescription?: string
}

const BLOG_FILE = 'data/blog-posts.json'

function getBlogPath(): string {
  const base = process.env.PWD || process.cwd()
  return join(base, BLOG_FILE)
}

const DEFAULT_IMAGE = '/images/hero-pregnant-woman.webp'

export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const path = getBlogPath()
    const data = await readFile(path, 'utf-8')
    const raw = JSON.parse(data) as Array<Partial<BlogPost>>
    const posts: BlogPost[] = raw.map((p) => ({
      slug: p.slug ?? '',
      title: p.title ?? '',
      excerpt: p.excerpt ?? '',
      content: p.content ?? '',
      image: p.image ?? DEFAULT_IMAGE,
      imageAlt: optionalText(p.imageAlt),
      date: p.date ?? new Date().toISOString().slice(0, 10),
      updatedAt: optionalText(p.updatedAt),
      metaTitle: optionalText(p.metaTitle),
      metaDescription: optionalText(p.metaDescription),
    }))
    return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  } catch {
    return []
  }
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const posts = await getBlogPosts()
  return posts.find((p) => p.slug === slug) ?? null
}

async function savePosts(posts: BlogPost[]): Promise<void> {
  const sorted = [...posts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  await writeFile(getBlogPath(), JSON.stringify(sorted, null, 2))
}

export async function addBlogPost(post: Omit<BlogPost, 'date'> & { date?: string }): Promise<BlogPost> {
  const posts = await getBlogPosts()
  const newPost: BlogPost = {
    ...post,
    date: post.date || new Date().toISOString().slice(0, 10),
  }
  if (posts.some((p) => p.slug === newPost.slug)) {
    throw new Error('slug უკვე არსებობს')
  }
  posts.unshift(newPost)
  await savePosts(posts)
  return newPost
}

export async function updateBlogPost(
  oldSlug: string,
  updates: Partial<BlogPost>
): Promise<BlogPost | null> {
  const posts = await getBlogPosts()
  const idx = posts.findIndex((p) => p.slug === oldSlug)
  if (idx === -1) return null
  const next: BlogPost = { ...posts[idx], ...updates }
  if ('imageAlt' in updates) next.imageAlt = optionalText(updates.imageAlt)
  if ('metaTitle' in updates) next.metaTitle = optionalText(updates.metaTitle)
  if ('metaDescription' in updates) next.metaDescription = optionalText(updates.metaDescription)
  if ('updatedAt' in updates) next.updatedAt = optionalText(updates.updatedAt) || posts[idx].updatedAt
  posts[idx] = next
  await savePosts(posts)
  return posts[idx]
}

export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length
}

export async function deleteBlogPost(slug: string): Promise<boolean> {
  const posts = await getBlogPosts()
  const filtered = posts.filter((p) => p.slug !== slug)
  if (filtered.length === posts.length) return false
  await savePosts(filtered)
  return true
}

function optionalText(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined
  const trimmed = value.trim()
  return trimmed || undefined
}

export function articleTitle(post: BlogPost): string {
  return post.metaTitle?.trim() || post.title
}

export function articleDescription(post: BlogPost): string {
  return post.metaDescription?.trim() || post.excerpt
}

export function articleImageAlt(post: BlogPost): string {
  return post.imageAlt?.trim() || post.title
}

export function relatedPosts(posts: BlogPost[], slug: string, limit = 3): BlogPost[] {
  const current = posts.find((post) => post.slug === slug)
  if (!current) return posts.filter((post) => post.slug !== slug).slice(0, limit)

  const words = new Set(
    current.title
      .toLowerCase()
      .split(/\s+/)
      .map((word) => word.replace(/[^\p{L}\p{N}]/gu, ''))
      .filter((word) => word.length > 3)
  )

  return posts
    .filter((post) => post.slug !== slug)
    .map((post) => {
      const score = post.title
        .toLowerCase()
        .split(/\s+/)
        .map((word) => word.replace(/[^\p{L}\p{N}]/gu, ''))
        .filter((word) => words.has(word)).length
      return { post, score }
    })
    .sort((a, b) => b.score - a.score || b.post.date.localeCompare(a.post.date))
    .slice(0, limit)
    .map((item) => item.post)
}

export function truncateExcerpt(text: string, maxChars: number = 200): string {
  if (text.length <= maxChars) return text
  const cut = text.slice(0, maxChars).lastIndexOf(' ')
  return (cut > 0 ? text.slice(0, cut) : text.slice(0, maxChars)) + '...'
}
