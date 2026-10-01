import Image from 'next/image'
import { CheckCircle2, Truck } from 'lucide-react'

type HeroTexts = {
  badge: string
  title: string
  description: string
  ctaOrder: string
  ctaMore: string
}

export function Hero({ texts, imageSrc }: { texts: HeroTexts; imageSrc: string }) {
  return (
    <section
      className="relative overflow-hidden border-b border-border/50 bg-gradient-to-br from-secondary/75 via-background to-accent/35 pb-20 pt-14 md:pb-28 md:pt-20"
      aria-label="მთავარი სექცია - Femibion ორსულობის ვიტამინები"
    >
      <div className="absolute -left-28 top-24 h-72 w-72 rounded-full bg-accent/35 blur-3xl" aria-hidden />
      <div className="absolute -right-20 bottom-8 h-80 w-80 rounded-full bg-primary/10 blur-3xl" aria-hidden />
      <div className="wrap">
        <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div className="relative z-10 flex flex-col gap-8 text-center lg:text-left">
            <div className="space-y-6">
              <span className="eyebrow justify-center lg:justify-start">
                <span className="h-px w-7 bg-primary/60" aria-hidden />
                {texts.badge}
              </span>
              <h1 className="text-[2.65rem] font-semibold leading-[1.12] tracking-[-0.035em] text-foreground sm:text-5xl md:text-[3.65rem]">
                {texts.title}
              </h1>
              <p className="mx-auto max-w-xl text-[1.05rem] leading-8 text-muted-foreground lg:mx-0">
                {texts.description}
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <a href="#order" className="btn-primary">
                {texts.ctaOrder}
              </a>
              <a href="#products" className="btn-ghost">
                {texts.ctaMore}
              </a>
            </div>

            <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 border-t border-border/70 pt-5 text-sm text-muted-foreground lg:justify-start">
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-accent-foreground" aria-hidden />
                ოფიციალური პროდუქცია
              </span>
              <span className="inline-flex items-center gap-2">
                <Truck className="h-4 w-4 text-accent-foreground" aria-hidden />
                მიწოდება მთელ საქართველოში
              </span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
            <div
              className="absolute -inset-3 rounded-[4rem_2rem_4rem_2rem] border border-primary/10 bg-card/35"
              aria-hidden
            />
            <div className="relative overflow-hidden rounded-[3.5rem_1.5rem_3.5rem_1.5rem] border border-white/70 bg-card shadow-[var(--shadow-card)]">
              <div className="relative aspect-[5/6]">
                <Image
                  src={imageSrc || '/images/hero-pregnant-woman.webp'}
                  alt="Femibion პრენატალური ვიტამინები - ბედნიერი ორსული ქალი საქართველოში"
                  fill
                  className="object-cover saturate-[0.88]"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#4d3325]/20 via-transparent to-[#fff8ed]/10" aria-hidden />
              </div>
            </div>
            <div className="absolute -bottom-5 left-5 rounded-2xl border border-white/70 bg-card/90 px-5 py-4 shadow-[var(--shadow-soft)] backdrop-blur-md sm:left-8">
              <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">სანდო არჩევანი</p>
              <p className="mt-1 font-semibold text-foreground">ორსულობის ყველა ეტაპზე</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
