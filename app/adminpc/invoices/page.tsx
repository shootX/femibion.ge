import { redirect } from 'next/navigation'
import Link from 'next/link'
import { isAdmin } from '@/lib/auth'
import { getInvoices } from '@/lib/invoices'
import { InvoicesPanel } from '@/components/femibion/invoices/invoices-panel'
import { ChevronLeft, Receipt, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const dynamic = 'force-dynamic'

export default async function AdminInvoicesPage() {
  const authenticated = await isAdmin()
  if (!authenticated) {
    redirect('/adminpc')
  }

  const invoices = await getInvoices()

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <Link
            href="/adminpc/dashboard"
            className="mb-2 flex items-center text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            <ChevronLeft className="mr-1 h-4 w-4" /> დაფა
          </Link>
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-primary/10 p-2 text-primary">
              <Receipt className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">ინვოისები</h1>
              <p className="text-sm text-muted-foreground">
                ინვოისების გამოწერა, სტატუსების მართვა და საწყობის სინქრონიზაცია
              </p>
            </div>
          </div>
        </div>

        <Button asChild className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
          <Link href="/adminpc/invoices/new">
            <Plus className="h-4 w-4" />
            ახალი ინვოისი
          </Link>
        </Button>
      </div>

      <InvoicesPanel invoices={invoices} />
    </div>
  )
}
