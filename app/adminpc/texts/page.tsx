import { redirect } from 'next/navigation'
import Link from 'next/link'
import { isAdmin } from '@/lib/auth'
import { getSiteTexts } from '@/lib/texts'
import { flattenTexts } from '@/lib/texts-flat'
import { TextsEditor } from './texts-editor'
import { ChevronLeft, Settings } from 'lucide-react'

export default async function AdminTextsPage() {
  const authenticated = await isAdmin()
  if (!authenticated) redirect('/adminpc')

  const texts = await getSiteTexts()
  const flatEntries = flattenTexts(texts)

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
              <Settings className="h-6 w-6" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">ტექსტების მართვა</h1>
          </div>
        </div>
      </div>
      <TextsEditor initialEntries={flatEntries} />
    </div>
  )
}
