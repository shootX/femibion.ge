import { cache } from 'react'
import { readFile, writeFile } from 'fs/promises'
import { join } from 'path'

export const RETIRED_SLUGS = new Set(['dzilis-problemebi-orsulobisas'])

export type MedicalReviewer = {
  name: string
  specialty?: string
  workplace?: string
  photo?: string
  bio?: string
  slug?: string
}

export type BlogReference = {
  title: string
  url: string
}

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
  author?: string
  medicalReviewer?: MedicalReviewer
  reviewedAt?: string
  references?: BlogReference[]
}

const BLOG_FILE = 'data/blog-posts.json'

function getBlogPath(): string {
  const base = process.env.PWD || process.cwd()
  return join(base, BLOG_FILE)
}

const DEFAULT_IMAGE = '/images/hero-pregnant-woman.webp'

export const getBlogPosts = cache(async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const path = getBlogPath()
    const data = await readFile(path, 'utf-8')
    const raw = JSON.parse(data) as Array<Record<string, unknown>>
    const posts = raw.map(normalizePost).filter((post) => post.slug && !RETIRED_SLUGS.has(post.slug))
    return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  } catch {
    return []
  }
})

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
  if ('author' in updates) next.author = optionalText(updates.author)
  if ('reviewedAt' in updates) next.reviewedAt = optionalText(updates.reviewedAt)
  if ('medicalReviewer' in updates) {
    next.medicalReviewer = updates.medicalReviewer?.name ? updates.medicalReviewer : undefined
  }
  if ('references' in updates) {
    next.references = updates.references?.length ? updates.references : undefined
  }
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

function normalizeReviewer(value: unknown): MedicalReviewer | undefined {
  if (!value || typeof value !== 'object') return undefined
  const raw = value as Record<string, unknown>
  const name = optionalText(raw.name)
  if (!name) return undefined
  return {
    name,
    specialty: optionalText(raw.specialty),
    workplace: optionalText(raw.workplace),
    photo: optionalText(raw.photo),
    bio: optionalText(raw.bio),
    slug: optionalText(raw.slug),
  }
}

function normalizeReferences(value: unknown): BlogReference[] | undefined {
  if (!Array.isArray(value)) return undefined
  const items = value.flatMap((item) => {
    if (!item || typeof item !== 'object') return []
    const raw = item as Record<string, unknown>
    const title = optionalText(raw.title)
    const url = optionalText(raw.url)
    return title && url ? [{ title, url }] : []
  })
  return items.length ? items : undefined
}

/** Keeps unknown keys so a live JSON file with extra posts/fields survives an admin save. */
function normalizePost(raw: Record<string, unknown>): BlogPost {
  const reviewer = normalizeReviewer(raw.medicalReviewer)
  const references = normalizeReferences(raw.references)
  const post: BlogPost = {
    ...(raw as unknown as BlogPost),
    slug: optionalText(raw.slug) ?? '',
    title: optionalText(raw.title) ?? '',
    excerpt: typeof raw.excerpt === 'string' ? raw.excerpt : '',
    content: typeof raw.content === 'string' ? raw.content : '',
    image: optionalText(raw.image) ?? DEFAULT_IMAGE,
    imageAlt: optionalText(raw.imageAlt),
    date: optionalText(raw.date) ?? new Date().toISOString().slice(0, 10),
    updatedAt: optionalText(raw.updatedAt),
    metaTitle: optionalText(raw.metaTitle),
    metaDescription: optionalText(raw.metaDescription),
    author: optionalText(raw.author),
    medicalReviewer: reviewer,
    reviewedAt: optionalText(raw.reviewedAt),
    references,
  }
  if (!post.author) delete post.author
  if (!post.medicalReviewer) delete post.medicalReviewer
  if (!post.reviewedAt) delete post.reviewedAt
  if (!post.references) delete post.references
  if (!post.imageAlt) delete post.imageAlt
  if (!post.updatedAt) delete post.updatedAt
  if (!post.metaTitle) delete post.metaTitle
  if (!post.metaDescription) delete post.metaDescription
  return post
}

export type ExpertProfile = MedicalReviewer & {
  slug: string
  articles: Array<{ slug: string; title: string; reviewedAt?: string }>
}

export function expertsFromPosts(posts: BlogPost[]): ExpertProfile[] {
  const map = new Map<string, ExpertProfile>()
  for (const post of posts) {
    const reviewer = post.medicalReviewer
    if (!reviewer?.name || !reviewer.slug) continue
    const article = { slug: post.slug, title: post.title, reviewedAt: post.reviewedAt }
    const existing = map.get(reviewer.slug)
    if (!existing) {
      map.set(reviewer.slug, { ...reviewer, slug: reviewer.slug, articles: [article] })
      continue
    }
    existing.articles.push(article)
  }
  return [...map.values()]
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

const TOPIC_RULES = [
  { id: 'folate', pattern: /metafolin|მეტაფოლინ|ფოლატ|ფოლიუმ|mthfr|მეთილფოლატ|5-mthf/i },
  { id: 'dha', pattern: /dha|omega-3|ომეგა/i },
  { id: 'femibion12', pattern: /femibion\s*1|femibion\s*2|ფემიბიონი?\s*1|ფემიბიონი?\s*2/i },
] as const

const TOPIC_CLUSTER = ['folate', 'dha', 'femibion12'] as const

function topicWeights(post: BlogPost): Map<string, number> {
  const weights = new Map<string, number>()
  const fields: Array<[string, number]> = [
    [post.title, 4],
    [post.slug.replace(/-/g, ' '), 3],
    [post.excerpt, 1],
  ]
  for (const [text, weight] of fields) {
    for (const rule of TOPIC_RULES) {
      if (rule.pattern.test(text)) {
        weights.set(rule.id, (weights.get(rule.id) ?? 0) + weight)
      }
    }
  }
  return weights
}

export function relatedPosts(posts: BlogPost[], slug: string, limit = 3): BlogPost[] {
  const current = posts.find((post) => post.slug === slug)
  if (!current) return []

  const currentWeights = topicWeights(current)
  if (currentWeights.size === 0) return []

  const inCluster = TOPIC_CLUSTER.some((topic) => currentWeights.has(topic))
  const wanted = inCluster
    ? [...TOPIC_CLUSTER].sort(
        (a, b) =>
          (currentWeights.get(b) ?? 0) - (currentWeights.get(a) ?? 0) ||
          TOPIC_CLUSTER.indexOf(a) - TOPIC_CLUSTER.indexOf(b)
      )
    : [...currentWeights.keys()]

  const used = new Set<string>([current.slug])
  const picked: BlogPost[] = []

  for (const topic of wanted) {
    if (picked.length >= limit) break
    const best = posts
      .filter((post) => !used.has(post.slug))
      .map((post) => ({ post, weight: topicWeights(post).get(topic) ?? 0 }))
      .filter((item) => item.weight > 0)
      .sort((a, b) => b.weight - a.weight || b.post.date.localeCompare(a.post.date))[0]
    if (!best) continue
    used.add(best.post.slug)
    picked.push(best.post)
  }

  return picked
}

export function truncateExcerpt(text: string, maxChars: number = 200): string {
  if (text.length <= maxChars) return text
  const cut = text.slice(0, maxChars).lastIndexOf(' ')
  return (cut > 0 ? text.slice(0, cut) : text.slice(0, maxChars)) + '...'
}

/** "16 ოქტომბერი, 2026"-style date for article bylines; falls back to the raw value. */
export function formatPostDate(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('ka-GE', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'Asia/Tbilisi' })
}
