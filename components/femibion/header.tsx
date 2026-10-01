'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type HeaderTexts = {
  brand: string
  logoLetter: string
  navHome: string
  navProducts: string
  navBlog: string
  navFaq: string
  navOrder: string
}

type HeaderImages = { logo: string; hasLogo: boolean }

const navLinks = [
  { href: '/', key: 'navHome' as const },
  { href: '/#products', key: 'navProducts' as const },
  { href: '/blog', key: 'navBlog' as const },
  { href: '/faq', key: 'navFaq' as const },
  { href: '/#order', key: 'navOrder' as const },
]

export function Header({ texts, images }: { texts: HeaderTexts; images?: HeaderImages }) {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const [hash, setHash] = useState('')

  useEffect(() => {
    setMounted(true)
    setHash(window.location.hash)
    const handleHashChange = () => setHash(window.location.hash)
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const isLinkActive = (href: string) => {
    if (!mounted) return false
    if (href === '/') return pathname === '/' && hash === ''
    if (href === '/blog') return pathname.startsWith('/blog')
    if (href === '/faq') return pathname.startsWith('/faq')
    if (href.startsWith('/#')) {
      return pathname === '/' && hash === href.substring(1)
    }
    return false
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/88 backdrop-blur-xl">
      <div className="wrap flex h-[4.75rem] items-center justify-between">
        <Link href="/" className="cursor-pointer" onClick={() => setHash('')}>
          {images?.hasLogo && images.logo ? (
            <div className="relative h-10 w-28">
              <Image
                src={images.logo}
                alt={texts.brand}
                fill
                className="object-contain object-left"
                sizes="112px"
              />
            </div>
          ) : (
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary">
              <span className="text-sm font-bold text-primary-foreground">{texts.logoLetter}</span>
            </div>
          )}
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {navLinks.map(({ href, key }) => {
            const active = isLinkActive(href)
            const isOrder = key === 'navOrder'
            return (
              <Link
                key={key}
                href={href}
                onClick={() => {
                  if (href.startsWith('/#')) setHash(href.substring(1))
                  else if (href === '/') setHash('')
                }}
                className={cn(
                  'relative cursor-pointer text-sm font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4',
                  isOrder
                    ? 'rounded-xl bg-primary px-5 py-2.5 text-primary-foreground hover:bg-primary/90'
                    : 'py-2 text-muted-foreground hover:text-foreground'
                )}
              >
                {texts[key]}
                {active && !isOrder && (
                  <span className="absolute inset-x-0 -bottom-[1.35rem] h-0.5 rounded-full bg-primary" />
                )}
              </Link>
            )
          })}
        </nav>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              className="h-11 w-11 cursor-pointer rounded-xl border border-border/70 bg-card/70"
              aria-label="მენიუ"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full border-l border-border/60 bg-background p-0 sm:max-w-sm">
            <SheetTitle className="sr-only">{texts.brand}</SheetTitle>
            <div className="flex h-[4.5rem] items-center justify-between border-b border-border/50 px-6">
              {images?.logo && (
                <Link href="/" className="cursor-pointer" onClick={() => { setOpen(false); setHash('') }}>
                  <div className="relative h-8 w-24">
                    <Image src={images.logo} alt={texts.brand} fill className="object-contain object-left" />
                  </div>
                </Link>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setOpen(false)}
                className="h-11 w-11 cursor-pointer rounded-xl"
                aria-label="დახურვა"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <nav className="flex flex-col gap-2 p-6">
              {navLinks.map(({ href, key }) => {
                const active = isLinkActive(href)
                return (
                  <Link
                    key={key}
                    href={href}
                    onClick={() => {
                      setOpen(false)
                      if (href.startsWith('/#')) setHash(href.substring(1))
                      else if (href === '/') setHash('')
                    }}
                    className={cn(
                      'cursor-pointer rounded-xl px-5 py-4 text-lg font-semibold transition-colors',
                      active
                        ? 'bg-primary text-primary-foreground'
                        : 'border border-border/60 bg-card/70 text-foreground hover:bg-secondary'
                    )}
                  >
                    {texts[key]}
                  </Link>
                )
              })}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
