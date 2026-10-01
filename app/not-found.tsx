import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: { absolute: '404 - გვერდი ვერ მოიძებნა | Femibion Georgia' },
  description: 'მოთხოვნილი გვერდი ვერ მოიძებნა.',
  robots: { index: false, follow: false },
}

export default function NotFound() {
  return (
    <main className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-3xl font-bold">404 — გვერდი ვერ მოიძებნა</h1>
        <p className="mt-3 text-muted-foreground">
          ბმული შეიძლება შეცვლილი იყოს ან გვერდი აღარ არსებობდეს.
        </p>
        <Link href="/" className="btn-primary mt-6">
          მთავარ გვერდზე დაბრუნება
        </Link>
      </div>
    </main>
  )
}
