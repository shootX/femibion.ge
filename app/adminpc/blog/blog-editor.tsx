'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { createPost, updatePost } from './actions'
import { slugify } from '@/lib/slugify'
import type { BlogPost } from '@/lib/blog'

type BlogEditorProps =
  | { mode: 'add'; post?: null }
  | { mode: 'edit'; post: BlogPost }

export function BlogEditor({ mode, post }: BlogEditorProps) {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [imagePath, setImagePath] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const today = new Date().toISOString().slice(0, 10)
  const defaultValues = post ?? {
    slug: '',
    title: '',
    excerpt: '',
    content: '',
    image: '/images/hero-pregnant-woman.webp',
    imageAlt: '',
    date: today,
    updatedAt: today,
    metaTitle: '',
    metaDescription: '',
  }

  const currentImage = imagePath ?? defaultValues.image

  const handleUpload = async () => {
    const file = fileRef.current?.files?.[0]
    if (!file) {
      setUploadError('აირჩიეთ ფაილი')
      return
    }
    setUploading(true)
    setUploadError(null)
    try {
      const fd = new FormData()
      fd.set('file', file)
      const res = await fetch('/api/upload-blog-image', { method: 'POST', body: fd })
      const data = (await res.json()) as { path?: string; error?: string }
      if (res.ok && data.path) {
        setImagePath(data.path)
        setUploadError(null)
        fileRef.current!.value = ''
      } else {
        setUploadError(data.error ?? 'შეცდომა')
      }
    } catch {
      setUploadError('შეცდომა ქსელში')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    const form = e.currentTarget
    const formData = new FormData(form)
    if (imagePath) formData.set('image', imagePath)
    if (mode === 'edit') formData.set('oldSlug', post.slug)

    const result = mode === 'add'
      ? await createPost(formData)
      : await updatePost(formData)

    if (result?.error) {
      setError(result.error)
      return
    }
    setOpen(false)
    router.refresh()
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setImagePath(null); setError(null); setUploadError(null); }}>
      <DialogTrigger asChild>
        <Button size="sm">{mode === 'add' ? 'ახალი პოსტი' : 'რედაქტირება'}</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{mode === 'add' ? 'ახალი ბლოგ პოსტი' : 'პოსტის რედაქტირება'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div>
            <Label htmlFor="title">სათაური</Label>
            <Input
              id="title"
              name="title"
              defaultValue={defaultValues.title}
              required
              onBlur={(e) => {
                if (mode === 'add') {
                  const slug = e.target.form?.querySelector('#slug') as HTMLInputElement
                  if (slug && !slug.value) slug.value = slugify(e.target.value)
                }
              }}
            />
          </div>
          <div>
            <Label htmlFor="slug">Slug (URL)</Label>
            <Input
              id="slug"
              name="slug"
              defaultValue={defaultValues.slug}
              required
              placeholder="post-url-slug"
            />
          </div>
          <div>
            <Label htmlFor="excerpt">მოკლე აღწერა (~200 სიმბ.)</Label>
            <Textarea
              id="excerpt"
              name="excerpt"
              defaultValue={defaultValues.excerpt}
              required
              rows={3}
              className="resize-none"
            />
          </div>
          <div>
            <Label htmlFor="metaTitle">Meta title</Label>
            <Input
              id="metaTitle"
              name="metaTitle"
              defaultValue={defaultValues.metaTitle ?? ''}
              placeholder="ცარიელი — სათაური"
            />
          </div>
          <div>
            <Label htmlFor="metaDescription">Meta description</Label>
            <Textarea
              id="metaDescription"
              name="metaDescription"
              defaultValue={defaultValues.metaDescription ?? ''}
              rows={2}
              placeholder="ცარიელი — მოკლე აღწერა"
              className="resize-none"
            />
          </div>
          <div>
            <Label htmlFor="content">სრული ტექსტი</Label>
            <Textarea
              id="content"
              name="content"
              defaultValue={defaultValues.content}
              required
              rows={8}
              className="resize-none"
            />
          </div>
          <div>
            <Label>სურათი</Label>
            <div className="mt-2 flex flex-col gap-2">
              <div className="relative aspect-video max-w-xs overflow-hidden rounded-lg bg-muted">
                <Image
                  src={currentImage + (currentImage.includes('?') ? '' : '?t=' + Date.now())}
                  alt=""
                  fill
                  className="object-cover"
                  unoptimized
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/hero-pregnant-woman.webp'
                  }}
                />
              </div>
              <div className="flex gap-2">
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  className="flex-1 text-sm file:mr-2 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-primary-foreground"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleUpload}
                  disabled={uploading}
                >
                  {uploading ? 'იტვირთება...' : 'ატვირთვა'}
                </Button>
              </div>
              {uploadError && <p className="text-xs text-destructive">{uploadError}</p>}
              <Input
                id="image"
                name="image"
                value={currentImage}
                onChange={(e) => setImagePath(e.target.value)}
                placeholder="/images/blog/..."
                className="text-sm"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="imageAlt">სურათის alt ტექსტი</Label>
            <Input
              id="imageAlt"
              name="imageAlt"
              defaultValue={defaultValues.imageAlt ?? ''}
              placeholder="ცარიელი — სათაური"
            />
          </div>
          <div>
            <Label htmlFor="date">თარიღი</Label>
            <Input
              id="date"
              name="date"
              type="date"
              defaultValue={defaultValues.date.slice(0, 10)}
            />
          </div>
          <div>
            <Label htmlFor="updatedAt">განახლების თარიღი</Label>
            <Input
              id="updatedAt"
              name="updatedAt"
              type="date"
              defaultValue={(defaultValues.updatedAt || defaultValues.date).slice(0, 10)}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              გაუქმება
            </Button>
            <Button type="submit">{mode === 'add' ? 'დამატება' : 'შენახვა'}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
