import { redirect } from 'next/navigation'
import Link from 'next/link'
import { isAdmin } from '@/lib/auth'
import { getSiteTexts } from '@/lib/texts'
import { flattenTexts } from '@/lib/texts-flat'
import { TextsEditor } from '../texts/texts-editor'
import { ChevronLeft, LayoutTemplate } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default async function AdminSeoBlockPage() {
  const authenticated = await isAdmin()
  if (!authenticated) redirect('/adminpc')

  const texts = await getSiteTexts()
  const seoEntries = flattenTexts(texts).filter((e) => e.key.startsWith('seoContent.'))

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
              <LayoutTemplate className="h-6 w-6" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">SEO ბლოკი</h1>
          </div>
          <p className="text-sm text-muted-foreground max-w-xl">
            მთავარი გვერდის ორკოლონიანი სექცია („რატომ Femibion…“ / „როდის დავიწყოთ…“).
          </p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/adminpc/texts">ყველა ტექსტი</Link>
        </Button>
      </div>
      <TextsEditor initialEntries={seoEntries} mode="seo-only" />
    </div>
  )
}
