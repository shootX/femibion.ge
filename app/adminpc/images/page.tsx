import { redirect } from 'next/navigation'
import Link from 'next/link'
import { isAdmin } from '@/lib/auth'
import { IMAGE_SLOTS } from '@/lib/images'
import { getImagePaths } from '@/lib/images-server'
import { ImagesEditor } from './images-editor'
import { ChevronLeft, ImageIcon } from 'lucide-react'

export default async function AdminImagesPage() {
  const authenticated = await isAdmin()
  if (!authenticated) redirect('/adminpc')

  const imageData = getImagePaths()

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <Link
            href="/adminpc/dashboard"
            className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-2"
          >
            <ChevronLeft className="mr-1 h-4 w-4" /> დაფა
          </Link>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <ImageIcon className="h-6 w-6" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">ფოტოების მართვა</h1>
          </div>
        </div>
      </div>
      <ImagesEditor slots={IMAGE_SLOTS} paths={imageData} />
    </div>
  )
}
