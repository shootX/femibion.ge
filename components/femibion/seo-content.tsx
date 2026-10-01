import { Heart, Leaf } from 'lucide-react'

type SeoContentTexts = {
  sectionAriaLabel: string
  column1Title: string
  column1Paragraph1: string
  column1Paragraph2: string
  column2Title: string
  column2Paragraph1: string
  column2Paragraph2: string
}

export function SeoContent({ texts }: { texts: SeoContentTexts }) {
  return (
    <section className="section-pad border-y border-border/60 bg-secondary/45" aria-label={texts.sectionAriaLabel}>
      <div className="wrap">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 max-w-2xl">
            <span className="eyebrow mb-4">რატომ Femibion</span>
            <h2 className="section-heading">ზრუნვა, რომელიც ცოდნაზეა დაფუძნებული</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 md:gap-8">
            <article className="paper-card rounded-[1.75rem] p-7 md:p-9">
              <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-full bg-accent text-accent-foreground">
                <Leaf className="h-5 w-5" aria-hidden />
              </div>
              <h3 className="mb-4 text-2xl font-semibold tracking-[-0.02em] text-foreground">{texts.column1Title}</h3>
              <p className="mb-4 leading-7 text-muted-foreground">{texts.column1Paragraph1}</p>
              <p className="leading-7 text-muted-foreground">{texts.column1Paragraph2}</p>
            </article>
            <article className="paper-card rounded-[1.75rem] p-7 md:mt-8 md:p-9">
              <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-full bg-secondary text-primary">
                <Heart className="h-5 w-5" aria-hidden />
              </div>
              <h3 className="mb-4 text-2xl font-semibold tracking-[-0.02em] text-foreground">{texts.column2Title}</h3>
              <p className="mb-4 leading-7 text-muted-foreground">{texts.column2Paragraph1}</p>
              <p className="leading-7 text-muted-foreground">{texts.column2Paragraph2}</p>
            </article>
          </div>
        </div>
      </div>
    </section>
  )
}
