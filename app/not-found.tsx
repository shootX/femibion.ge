import type { Metadata } from 'next'
import Link from 'next/link'
import { getSiteTexts } from '@/lib/texts'
import { getImagePaths } from '@/lib/images-server'
import { Header } from '@/components/femibion/header'
import { Footer } from '@/components/femibion/footer'

export const metadata: Metadata = {
  title: { absolute: '404 - გვერდი ვერ მოიძებნა | Femibion Georgia' },
  description: 'მოთხოვნილი გვერდი ვერ მოიძებნა.',
  robots: { index: false, follow: false },
}

export default async function NotFound() {
  const [texts, images] = await Promise.all([getSiteTexts(), getImagePaths()])
  const links = [
    { href: '/#finder', label: 'რომელი Femibion მჭირდება?' },
    { href: '/femibion-1', label: 'Femibion 1' },
    { href: '/femibion-2', label: 'Femibion 2' },
    { href: '/blog', label: 'ბლოგი' },
  ]

  return (
    <div className="min-h-screen">
      <Header texts={texts.header} images={images} />
      <main className="py-16 md:py-24">
        <div className="wrap">
          <div className="panel mx-auto grid max-w-[40rem] justify-items-start gap-4 p-6 sm:p-10">
            <p className="text-[5rem] font-extrabold leading-none tracking-[-0.05em] text-primary tabular-nums">404</p>
            <h1 className="text-[1.8rem] font-bold leading-tight">გვერდი ვერ მოიძებნა</h1>
            <p className="text-muted-foreground">ბმული შეიძლება შეცვლილი იყოს ან გვერდი აღარ არსებობდეს.</p>
            <ul className="flex flex-wrap gap-2">
              {links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="chip press bg-background py-2 text-[14px] text-foreground hover:text-primary">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <Link href="/" className="btn-primary mt-2">
              მთავარ გვერდზე დაბრუნება
            </Link>
          </div>
        </div>
      </main>
      <Footer texts={texts.footer} images={images} />
    </div>
  )
}
