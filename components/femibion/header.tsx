'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowRight, Menu, ShoppingBag, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCart } from '@/components/femibion/cart'

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

export function Header({ texts, images }: { texts: HeaderTexts; images?: HeaderImages }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const menuButton = useRef<HTMLButtonElement>(null)
  const { count, subtotal, ready } = useCart()

  const links = [
    { href: '/#finder', label: 'კალკულატორი' },
    { href: '/#products', label: texts.navProducts },
    { href: '/blog', label: texts.navBlog },
    { href: '/faq', label: texts.navFaq },
  ]

  useEffect(() => setOpen(false), [pathname])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        menuButton.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const isActive = (href: string) => !href.includes('#') && pathname.startsWith(href)
  const hasItems = ready && count > 0

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border bg-white/92 backdrop-blur-md [padding-top:env(safe-area-inset-top,0px)]">
        <div className="wrap relative flex h-[68px] items-center gap-5">
          <Link href="/" className="shrink-0 rounded-xl" aria-label={`${texts.brand} — ${texts.navHome}`}>
            {images?.hasLogo && images.logo ? (
              <Image
                src={images.logo}
                alt={texts.brand}
                width={40}
                height={40}
                className="h-10 w-10 rounded-xl object-cover"
                priority
              />
            ) : (
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary font-bold text-primary-foreground">
                {texts.logoLetter}
              </span>
            )}
          </Link>

          <nav
            id="site-menu"
            aria-label="მთავარი მენიუ"
            className={cn(
              'gap-1',
              open
                ? 'absolute inset-x-0 top-full flex flex-col border-b border-border bg-white px-[max(20px,env(safe-area-inset-left,0px))] pb-5 pt-2 shadow-[0_24px_32px_-24px_rgb(31_23_41/0.28)] md:hidden'
                : 'hidden md:flex'
            )}
          >
            {links.map((link) => {
              const active = isActive(link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'rounded-full text-[15px] font-medium transition-colors duration-150',
                    open
                      ? 'border-b border-border px-1 py-3.5 text-[17px] last:border-b-0'
                      : 'px-3.5 py-2 hover:bg-background',
                    active && !open && 'bg-background text-primary',
                    active && open && 'text-primary'
                  )}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>

          <Link
            href="/#order"
            className="press ml-auto inline-flex min-h-11 items-center gap-3 rounded-full bg-foreground pl-3.5 pr-4 font-semibold text-white tabular-nums"
            aria-label={hasItems ? `${texts.navOrder}: ${count} ცალი, ${subtotal} ₾` : texts.navOrder}
          >
            <span className="relative grid">
              <ShoppingBag className="h-5 w-5" aria-hidden />
              {hasItems && (
                <span className="absolute -right-2.5 -top-2 grid h-[19px] min-w-[19px] place-items-center rounded-full bg-f1 px-1 text-[11.5px] font-extrabold leading-none text-foreground">
                  {count}
                </span>
              )}
            </span>
            <span className="hidden text-[15px] sm:inline">{hasItems ? `${subtotal} ₾` : texts.navOrder}</span>
          </Link>

          <button
            ref={menuButton}
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="site-menu"
            aria-label={open ? 'მენიუს დახურვა' : 'მენიუ'}
            className="press grid h-11 w-11 shrink-0 cursor-pointer place-items-center rounded-full border border-border bg-white md:hidden"
          >
            {open ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
          </button>
        </div>
      </header>
      <CartBar navOrder={texts.navOrder} />
    </>
  )
}

/** Phone-only checkout bar: appears once something is in the cart, hides while the order form is on screen. */
function CartBar({ navOrder }: { navOrder: string }) {
  const { count, subtotal, ready } = useCart()
  const [orderVisible, setOrderVisible] = useState(false)

  useEffect(() => {
    const target = document.getElementById('order')
    if (!target || typeof IntersectionObserver === 'undefined') return
    const observer = new IntersectionObserver(([entry]) => setOrderVisible(entry.isIntersecting), {
      rootMargin: '0px 0px -30% 0px',
    })
    observer.observe(target)
    return () => observer.disconnect()
  }, [])

  const show = ready && count > 0 && !orderVisible

  return (
    <Link
      href="/#order"
      aria-hidden={!show}
      tabIndex={show ? 0 : -1}
      className={cn(
        'fixed inset-x-3 z-40 flex items-center justify-between gap-3 rounded-2xl bg-foreground px-4 py-3 font-semibold text-white tabular-nums shadow-[0_14px_30px_-10px_rgb(31_23_41/0.5)] transition-[transform,opacity] duration-300 [bottom:calc(12px+env(safe-area-inset-bottom,0px))] [transition-timing-function:var(--ease-drawer)] md:hidden',
        show ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-[160%] opacity-0'
      )}
    >
      <span className="inline-flex items-center gap-2">
        <ShoppingBag className="h-[18px] w-[18px]" aria-hidden />
        {count} ცალი
      </span>
      <span>{subtotal} ₾</span>
      <span className="inline-flex items-center gap-1.5">
        {navOrder}
        <ArrowRight className="h-4 w-4" aria-hidden />
      </span>
    </Link>
  )
}
