import Link from 'next/link'
import { Clock, Facebook, Instagram, Mail, MapPin, Phone } from 'lucide-react'
import { FOOTER_LEGAL_LINE, LEGAL_ENTITY } from '@/lib/legal'

type FooterTexts = {
  brand: string
  logoLetter: string
  description: string
  contactTitle: string
  address: string
  phone: string
  email: string
  socialTitle: string
  copyright: string
  faqLinkLabel?: string
  privacyLinkLabel?: string
  termsLinkLabel?: string
  hours?: string
  warningText?: string
}
type FooterImages = { logo: string; hasLogo: boolean }

export function Footer({ texts }: { texts: FooterTexts; images?: FooterImages }) {
  const phoneHref = `tel:${texts.phone.replace(/[^\d+]/g, '')}`
  const infoLinks = [
    { href: '/#finder', label: 'რომელი Femibion მჭირდება?' },
    { href: '/femibion-1', label: 'Femibion 1' },
    { href: '/femibion-2', label: 'Femibion 2' },
    { href: '/blog', label: 'ბლოგი' },
    { href: '/faq', label: texts.faqLinkLabel || 'ხშირად დასმული კითხვები' },
  ]
  const legalLinks = [
    { href: '/terms', label: texts.termsLinkLabel || 'წესები და პირობები' },
    { href: '/privacy', label: texts.privacyLinkLabel || 'კონფიდენციალურობის პოლიტიკა' },
  ]

  return (
    <footer className="border-t border-border bg-white pb-12 pt-11 text-[14.5px] text-muted-foreground" aria-label="ფუტერი">
      <div className="wrap grid gap-8 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.3fr)_repeat(3,minmax(0,1fr))]">
        <div className="grid content-start gap-2.5 sm:col-span-2 lg:col-span-1">
          <p className="text-[15px] font-bold text-foreground">{texts.brand} Georgia</p>
          <p className="max-w-[34ch] leading-relaxed">{texts.description}</p>
        </div>

        <div>
          <p className="mb-2.5 text-[14px] font-bold text-foreground">{texts.contactTitle}</p>
          <ul className="grid gap-2.5">
            <li className="flex items-start gap-2.5">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
              <a href={phoneHref} className="text-foreground tabular-nums hover:text-primary">
                {texts.phone}
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
              <a href={`mailto:${texts.email}`} className="break-all text-foreground hover:text-primary">
                {texts.email}
              </a>
            </li>
            {texts.hours && (
              <li className="flex items-start gap-2.5">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                {texts.hours}
              </li>
            )}
            <li className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
              {texts.address}
            </li>
          </ul>
        </div>

        <nav aria-label="ინფორმაცია">
          <p className="mb-2.5 text-[14px] font-bold text-foreground">ინფორმაცია</p>
          <ul className="grid gap-2">
            {[...infoLinks, ...legalLinks].map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-foreground hover:text-primary">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="mb-2.5 text-[14px] font-bold text-foreground">{texts.socialTitle}</p>
          <div className="flex gap-2.5">
            <a
              href={LEGAL_ENTITY.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="press grid h-11 w-11 place-items-center rounded-[14px] bg-background text-foreground hover:text-primary"
            >
              <Facebook className="h-5 w-5" aria-hidden />
            </a>
            <a
              href="https://www.instagram.com/femibiongeorgia"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="press grid h-11 w-11 place-items-center rounded-[14px] bg-background text-foreground hover:text-primary"
            >
              <Instagram className="h-5 w-5" aria-hidden />
            </a>
          </div>
        </div>

        <div className="grid gap-1.5 border-t border-border pt-5 text-[13px] leading-relaxed sm:col-span-2 lg:col-span-4">
          {texts.warningText && <p>{texts.warningText}</p>}
          <p>{texts.copyright}</p>
          <p>{FOOTER_LEGAL_LINE}</p>
        </div>
      </div>
    </footer>
  )
}
