import { redirect } from 'next/navigation'
import Link from 'next/link'
import { isAdmin } from '@/lib/auth'
import { getPrivacyPolicy } from '@/lib/privacy-policy'
import { PrivacyEditor } from './privacy-editor'
import { ChevronLeft, ShieldCheck, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default async function AdminPrivacyPage() {
  const authenticated = await isAdmin()
  if (!authenticated) redirect('/adminpc')

  const policy = await getPrivacyPolicy()

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
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">კონფიდენციალურობის პოლიტიკა</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/privacy" target="_blank">
            <Button variant="outline" size="sm">
              <ExternalLink className="mr-2 h-4 w-4" /> საჯარო გვერდი
            </Button>
          </Link>
        </div>
      </div>
      
      <PrivacyEditor initialTitle={policy.title} initialContentHtml={policy.contentHtml} />
    </div>
  )
}
