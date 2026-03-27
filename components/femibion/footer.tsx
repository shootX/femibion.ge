import Image from 'next/image'
import Link from 'next/link'
import { Facebook, Instagram, MapPin, Phone, Mail, Shield, Award } from 'lucide-react'

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
  privacyLinkLabel?: string
  warningText?: string
}
type FooterImages = { logo: string; hasLogo: boolean }

export function Footer({ texts, images }: { texts: FooterTexts; images?: FooterImages }) {
  return (
    <footer className="bg-foreground text-background py-12 md:py-16" role="contentinfo" aria-label="ფუტერი - Femibion Georgia კონტაქტი">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 mb-4">
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
                <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-lg">{texts.logoLetter}</span>
                </div>
              )}
              <span className="text-2xl font-semibold">{texts.brand}</span>
            </div>
            <p className="text-background/70 leading-relaxed">{texts.description}</p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">{texts.contactTitle}</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-background/70">
                <MapPin className="h-5 w-5 shrink-0" />
                <span>{texts.address}</span>
              </li>
              <li className="flex items-center gap-3 text-background/70">
                <Phone className="h-5 w-5 shrink-0" />
                <span>{texts.phone}</span>
              </li>
              <li className="flex items-center gap-3 text-background/70">
                <Mail className="h-5 w-5 shrink-0" />
                <span>{texts.email}</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">{texts.socialTitle}</h3>
            <div className="flex gap-3">
              <a
                href="https://www.facebook.com/femibiongeorgia"
                target="_blank"
                rel="noopener noreferrer"
                className="h-12 w-12 rounded-full bg-background/10 flex items-center justify-center transition-colors hover:bg-primary"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://www.instagram.com/femibiongeorgia"
                target="_blank"
                rel="noopener noreferrer"
                className="h-12 w-12 rounded-full bg-background/10 flex items-center justify-center transition-colors hover:bg-primary"
                aria-label="Femibion Georgia Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">{texts.certificatesTitle}</h3>
            <div className="flex gap-4">
              <div className="h-14 w-14 rounded-xl bg-background/10 flex items-center justify-center">
                <Shield className="h-7 w-7 text-primary" />
              </div>
              <div className="h-14 w-14 rounded-xl bg-background/10 flex items-center justify-center">
                <Award className="h-7 w-7 text-primary" />
              </div>
            </div>
            <p className="text-sm text-background/50 mt-3">{texts.certificatesNote}</p>
          </div>
        </div>

        <div className="border-t border-background/10 mt-10 pt-8 flex flex-col items-center gap-4 text-sm text-background/50">
          {texts.warningText && (
            <p className="text-center max-w-2xl text-background/60 font-medium italic">
              {texts.warningText}
            </p>
          )}
          <div className="flex flex-col items-center gap-2">
            {texts.privacyLinkLabel && (
              <Link
                href="/privacy"
                className="text-background/70 hover:text-primary transition-colors underline-offset-4 hover:underline"
              >
                {texts.privacyLinkLabel}
              </Link>
            )}
            <p>{texts.copyright}</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
