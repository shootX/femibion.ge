import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { cookies } from 'next/headers'
import { toCoverWebp } from '@/lib/blog-image'

export async function POST(req: NextRequest) {
  const cookieStore = await cookies()
  if (cookieStore.get('admin_session')?.value !== 'authenticated') {
    return NextResponse.json({ error: 'ავტორიზაცია საჭიროა' }, { status: 401 })
  }

  const formData = await req.formData()
  const file = formData.get('file') as File | null
  if (!file || file.size === 0) {
    return NextResponse.json({ error: 'ფაილი არ არის არჩეული' }, { status: 400 })
  }

  const ext = file.name.split('.').pop()?.toLowerCase() || ''
  if (!['jpg', 'jpeg', 'png', 'webp'].includes(ext)) {
    return NextResponse.json({ error: 'დაუშვებელი ფორმატი. PNG, JPG, WebP' }, { status: 400 })
  }
  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: 'ფაილი ძალიან დიდია (მაქს 5MB)' }, { status: 400 })
  }

  try {
    const name = `blog-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.webp`
    const base = process.cwd()
    const dir = join(base, 'public', 'images', 'blog')
    await mkdir(dir, { recursive: true })
    const destPath = join(dir, name)
    const bytes = Buffer.from(await file.arrayBuffer())
    await writeFile(destPath, await toCoverWebp(bytes))
    return NextResponse.json({ path: `/images/blog/${name}` })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'ატვირთვა ვერ მოხერხდა' }, { status: 500 })
  }
}
