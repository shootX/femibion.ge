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
import { createProduct, saveProduct, uploadProductImage } from './actions'
import type { Product } from '@/lib/products'

type ProductEditorProps =
  | { mode: 'add'; product?: null }
  | { mode: 'edit'; product: Product }

export function ProductEditor({ mode, product }: ProductEditorProps) {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [imagePath, setImagePath] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const defaults = product ?? {
    id: '',
    name: '',
    price: undefined,
    subtitle: '',
    description: '',
    features: [],
    image: '/images/femibion-1.webp',
    orderLabel: '',
    active: true,
    stock: 0,
  }

  const currentImage = imagePath ?? defaults.image
  const featuresText = defaults.features.join('\n')

  const handleUpload = async () => {
    const file = fileRef.current?.files?.[0]
    if (!file) {
      setUploadError('აირჩიეთ ფაილი')
      return
    }
    setUploading(true)
    setUploadError(null)
    const fd = new FormData()
    fd.set('file', file)
    const result = await uploadProductImage(fd)
    setUploading(false)
    if (result.path) {
      setImagePath(result.path)
      fileRef.current!.value = ''
    } else {
      setUploadError(result.error ?? 'შეცდომა')
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    const form = e.currentTarget
    const formData = new FormData(form)
    if (imagePath) formData.set('image', imagePath)
    if (mode === 'edit') formData.set('id', product.id)

    const result = mode === 'add' ? await createProduct(formData) : await saveProduct(formData)
    if (result.error) {
      setError(result.error)
      return
    }
    setOpen(false)
    setImagePath(null)
    router.refresh()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={mode === 'add' ? 'default' : 'outline'} size={mode === 'add' ? 'default' : 'sm'}>
          {mode === 'add' ? 'პროდუქტის დამატება' : 'რედაქტირება'}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{mode === 'add' ? 'ახალი პროდუქტი' : 'პროდუქტის რედაქტირება'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">სახელი *</Label>
            <Input id="name" name="name" defaultValue={defaults.name} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subtitle">ქვესათაური *</Label>
            <Input id="subtitle" name="subtitle" defaultValue={defaults.subtitle} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">ფასი (₾)</Label>
            <Input
              id="price"
              name="price"
              type="number"
              min={0}
              step={1}
              defaultValue={defaults.price ?? ''}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="stock">სტოკი (მიმდინარე რაოდენობა)</Label>
            <Input
              id="stock"
              name="stock"
              type="number"
              step={1}
              defaultValue={defaults.stock ?? 0}
            />
            <p className="text-xs text-muted-foreground">
              საწყობში მიღებისთვის გამოიყენე „საწყობში მიღება“ ღილაკი სიაში
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="orderLabel">შეკვეთის ფორმაში ლეიბლი</Label>
            <Input
              id="orderLabel"
              name="orderLabel"
              defaultValue={defaults.orderLabel}
              placeholder="Femibion 1 - დაგეგმვა & I ტრიმესტრი"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">აღწერა *</Label>
            <Textarea id="description" name="description" rows={4} defaultValue={defaults.description} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="features">მახასიათებლები (თითო ხაზზე ერთი)</Label>
            <Textarea id="features" name="features" rows={3} defaultValue={featuresText} />
          </div>

          <div className="space-y-2">
            <Label>სურათი</Label>
            <div className="relative mb-2 h-32 w-full overflow-hidden rounded-lg bg-muted">
              <Image src={currentImage} alt="" fill unoptimized className="object-cover" />
            </div>
            <Input name="image" defaultValue={currentImage} placeholder="/images/..." />
            <div className="flex gap-2">
              <Input ref={fileRef} type="file" accept="image/*" className="flex-1" />
              <Button type="button" variant="outline" onClick={handleUpload} disabled={uploading}>
                {uploading ? 'იტვირთება...' : 'ატვირთვა'}
              </Button>
            </div>
            {uploadError && <p className="text-sm text-destructive">{uploadError}</p>}
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="active" defaultChecked={defaults.active} className="rounded" />
            აქტიური (საიტზე ჩანს)
          </label>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex justify-end gap-2 pt-2">
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
