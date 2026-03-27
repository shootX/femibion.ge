'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Menu } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'

type HeaderTexts = { brand: string; logoLetter: string; navHome: string; navProducts: string; navBlog: string; navOrder: string }
type HeaderImages = { logo: string; hasLogo: boolean }

const navLinks = [
  { href: '/', key: 'navHome' as const },
  { href: '#products', key: 'navProducts' as const },
  { href: '/blog', key: 'navBlog' as const },
  { href: '#order', key: 'navOrder' as const },
]

export function Header({ texts, images }: { texts: HeaderTexts; images?: HeaderImages }) {
  const [open, setOpen] = useState(false)

  const NavLinks = ({ className = '' }: { className?: string }) => (
    <>
      {navLinks.map(({ href, key }) => (
        <Link
          key={key}
          href={href}
          onClick={() => setOpen(false)}
          className={`text-sm font-medium text-muted-foreground hover:text-foreground transition-colors ${className}`}
        >
          {texts[key]}
        </Link>
      ))}
    </>
  )

  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center">
          {images?.hasLogo && images.logo ? (
            <div className="relative h-10 w-24 shrink-0 sm:w-28">
              <Image
                src={images.logo}
                alt={texts.brand}
                fill
                unoptimized
                className="object-contain object-left"
                sizes="96px"
              />
            </div>
          ) : (
            <div className="h-8 w-8 shrink-0 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">{texts.logoLetter}</span>
            </div>
          )}
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <NavLinks />
        </nav>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" aria-label="მენიუ">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="pt-16 px-6">
            <nav className="flex flex-col gap-1">
              {navLinks.map(({ href, key }) => (
                <Link
                  key={key}
                  href={href}
                  onClick={() => setOpen(false)}
                  className="text-base font-medium py-3 px-3 rounded-lg text-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                >
                  {texts[key]}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
