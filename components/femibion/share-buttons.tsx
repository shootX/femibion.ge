'use client'

import { Facebook, Mail, MessageCircle, Send, Twitter } from 'lucide-react'

const BASE = 'https://femibion.ge'

type Props = { url: string; title: string }

export function ShareButtons({ url, title }: Props) {
  const fullUrl = url.startsWith('http') ? url : `${BASE}${url}`
  const encodedUrl = encodeURIComponent(fullUrl)
  const encodedTitle = encodeURIComponent(title)
  const encodedText = encodeURIComponent(`${title} ${fullUrl}`)

  const links = [
    {
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      label: 'Facebook',
      icon: Facebook,
      color: 'hover:bg-[#1877f2] hover:text-white',
    },
    {
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      label: 'X (Twitter)',
      icon: Twitter,
      color: 'hover:bg-black hover:text-white',
    },
    {
      href: `https://wa.me/?text=${encodedText}`,
      label: 'WhatsApp',
      icon: MessageCircle,
      color: 'hover:bg-[#25d366] hover:text-white',
    },
    {
      href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
      label: 'Telegram',
      icon: Send,
      color: 'hover:bg-[#0088cc] hover:text-white',
    },
    {
      href: `mailto:?subject=${encodedTitle}&body=${encodedUrl}`,
      label: 'Email',
      icon: Mail,
      color: 'hover:bg-primary hover:text-primary-foreground',
    },
  ]

  const copyLink = async () => {
    await navigator.clipboard.writeText(fullUrl)
    alert('ლინკი კოპირებულია')
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm font-medium text-muted-foreground mr-1">გაზიარება:</span>
      {links.map(({ href, label, icon: Icon, color }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-colors ${color}`}
          aria-label={label}
        >
          <Icon className="h-4 w-4" />
        </a>
      ))}
      <button
        type="button"
        onClick={copyLink}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-colors hover:bg-[#e4405f] hover:text-white"
        aria-label="Instagram (ლინკის კოპირება)"
        title="Instagram – ლინკის კოპირება"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      </button>
    </div>
  )
}
