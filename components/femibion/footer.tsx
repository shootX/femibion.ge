'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Facebook, Instagram, MapPin, Phone, Mail, Shield, Award, Clock } from 'lucide-react'
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
  certificatesTitle: string
  certificatesNote: string
  copyright: string
  faqLinkLabel?: string
  privacyLinkLabel?: string
  termsLinkLabel?: string
  hours?: string
  warningText?: string
}
type FooterImages = { logo: string; hasLogo: boolean }

export function Footer({ texts, images }: { texts: FooterTexts; images?: FooterImages }) {
  const phoneHref = `tel:${texts.phone.replace(/[^\d+]/g, '')}`

  return (
    <footer
      className="border-t border-white/10 bg-footer py-14 text-white md:py-20"
      role="contentinfo"
      aria-label="ფუტერი"
    >
      <div className="wrap">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.2fr_1fr_0.8fr_0.9fr]">
          <div>
            <div className="mb-4 flex items-center gap-2">
              {images?.hasLogo && images.logo ? (
                <div className="relative h-10 w-28">
                  <Image
                    src={images.logo}
                    alt={texts.brand}
                    fill
                    className="object-contain object-left brightness-0 invert"
                    sizes="112px"
                  />
                </div>
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
                  <span className="font-bold">{texts.logoLetter}</span>
                </div>
              )}
            </div>
            <p className="max-w-xs text-sm leading-7 text-white/70">{texts.description}</p>
          </div>

          <div>
            <p className="mb-5 text-sm font-semibold uppercase tracking-[0.12em] text-white/90">{texts.contactTitle}</p>
            <ul className="space-y-3 text-sm text-white/70">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[#d9b58e]" aria-hidden />
                {texts.address}
              </li>
              {texts.hours && (
                <li className="flex items-start gap-3">
                  <Clock className="mt-0.5 h-5 w-5 shrink-0 text-[#d9b58e]" aria-hidden />
                  {texts.hours}
                </li>
              )}
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 shrink-0 text-[#d9b58e]" aria-hidden />
                <a
                  href={phoneHref}
                  className="cursor-pointer transition-colors hover:text-white"
                >
                  {texts.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 shrink-0 text-[#d9b58e]" aria-hidden />
                <a href={`mailto:${texts.email}`} className="cursor-pointer transition-colors hover:text-white">
                  {texts.email}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="mb-5 text-sm font-semibold uppercase tracking-[0.12em] text-white/90">{texts.socialTitle}</p>
            <div className="flex gap-3">
              <a
                href={LEGAL_ENTITY.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl border border-white/10 bg-white/5 transition-colors hover:bg-white/15"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://www.instagram.com/femibiongeorgia"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl border border-white/10 bg-white/5 transition-colors hover:bg-white/15"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <p className="mb-5 text-sm font-semibold uppercase tracking-[0.12em] text-white/90">{texts.certificatesTitle}</p>
            <div className="flex gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                <Shield className="h-7 w-7 text-[#d9b58e]" aria-hidden />
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                <Award className="h-7 w-7 text-[#d9b58e]" aria-hidden />
              </div>
            </div>
            <p className="mt-3 text-sm text-white/50">{texts.certificatesNote}</p>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-8 text-center text-sm text-white/50">
          {texts.warningText && (
            <p className="mx-auto mb-4 max-w-2xl italic text-white/60">{texts.warningText}</p>
          )}
          <div className="mb-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
            {texts.faqLinkLabel && (
              <Link
                href="/faq"
                className="cursor-pointer text-white/70 hover:text-primary hover:underline"
              >
                {texts.faqLinkLabel}
              </Link>
            )}
            {texts.termsLinkLabel && (
              <Link
                href="/terms"
                className="cursor-pointer text-white/70 hover:text-primary hover:underline"
              >
                {texts.termsLinkLabel}
              </Link>
            )}
            {texts.privacyLinkLabel && (
              <Link
                href="/privacy"
                className="cursor-pointer text-white/70 hover:text-primary hover:underline"
              >
                {texts.privacyLinkLabel}
              </Link>
            )}
          </div>
          <p>{texts.copyright}</p>
          <p className="mx-auto mt-3 max-w-3xl text-xs leading-6 text-white/70">{FOOTER_LEGAL_LINE}</p>
        </div>
      </div>
    </footer>
  )
}
