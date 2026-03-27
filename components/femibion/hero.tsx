import Image from 'next/image'

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
      className="relative overflow-hidden bg-gradient-to-b from-accent/30 to-background py-16 md:py-24"
      aria-label="მთავარი სექცია - Femibion ორსულობის ვიტამინები"
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="flex flex-col gap-6 text-center lg:text-left">
            <div className="space-y-4">
              <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                {texts.badge}
              </span>
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl text-balance">
                {texts.title}
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto lg:mx-0">
                {texts.description}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a
                href="#order"
                className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-8 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5"
              >
                {texts.ctaOrder}
              </a>
              <a
                href="#products"
                className="inline-flex h-12 items-center justify-center rounded-full border-2 border-border bg-background px-8 text-base font-semibold text-foreground transition-all hover:bg-secondary hover:-translate-y-0.5"
              >
                {texts.ctaMore}
              </a>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-primary/20 via-accent/30 to-transparent blur-2xl" />
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl shadow-2xl">
              <Image
                src={imageSrc || '/images/hero-pregnant-woman.jpg'}
                alt="Femibion პრენატალური ვიტამინები - ბედნიერი ორსული ქალი საქართველოში"
                fill
                unoptimized
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
    </section>
  )
}
