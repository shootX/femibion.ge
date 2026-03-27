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
    <section
      className="py-12 md:py-16 bg-secondary/20"
      aria-label={texts.sectionAriaLabel}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid gap-8 md:grid-cols-2">
            <article>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                {texts.column1Title}
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                {texts.column1Paragraph1}
              </p>
              <p className="text-muted-foreground leading-relaxed">
                {texts.column1Paragraph2}
              </p>
            </article>

            <article>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                {texts.column2Title}
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                {texts.column2Paragraph1}
              </p>
              <p className="text-muted-foreground leading-relaxed">
                {texts.column2Paragraph2}
              </p>
            </article>
          </div>
        </div>
      </div>
    </section>
  )
}
