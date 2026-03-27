import { readFile, writeFile } from 'fs/promises'
import { join } from 'path'
import { unstable_noStore } from 'next/cache'

export type BlogPost = {
  slug: string
  title: string
  excerpt: string
  content: string
  image: string
  date: string
}

const BLOG_FILE = 'data/blog-posts.json'

function getBlogPath(): string {
  const base = process.env.PWD || process.cwd()
  return join(base, BLOG_FILE)
}

const DEFAULT_IMAGE = '/images/hero-pregnant-woman.jpg'

export async function getBlogPosts(): Promise<BlogPost[]> {
  unstable_noStore()
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
      date: p.date ?? new Date().toISOString().slice(0, 10),
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
  updates: Partial<Omit<BlogPost, 'slug'>>
): Promise<BlogPost | null> {
  const posts = await getBlogPosts()
  const idx = posts.findIndex((p) => p.slug === oldSlug)
  if (idx === -1) return null
  posts[idx] = { ...posts[idx], ...updates }
  await savePosts(posts)
  return posts[idx]
}

export async function deleteBlogPost(slug: string): Promise<boolean> {
  const posts = await getBlogPosts()
  const filtered = posts.filter((p) => p.slug !== slug)
  if (filtered.length === posts.length) return false
  await savePosts(filtered)
  return true
}

export function truncateExcerpt(text: string, maxChars: number = 200): string {
  if (text.length <= maxChars) return text
  const cut = text.slice(0, maxChars).lastIndexOf(' ')
  return (cut > 0 ? text.slice(0, cut) : text.slice(0, maxChars)) + '...'
}
