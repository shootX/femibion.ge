type SeoContentTexts = {
  sectionAriaLabel: string
  column1Title: string
  column1Paragraph1: string
  column1Paragraph2: string
  column2Title: string
  column2Paragraph1: string
  column2Paragraph2: string
}

/** Long-form answers to the two questions people search for most; kept on the homepage for SEO. */
export function SeoContent({ texts }: { texts: SeoContentTexts }) {
  const columns = [
    { title: texts.column1Title, paragraphs: [texts.column1Paragraph1, texts.column1Paragraph2] },
    { title: texts.column2Title, paragraphs: [texts.column2Paragraph1, texts.column2Paragraph2] },
  ]

  return (
    <section className="py-12 md:py-16" aria-label={texts.sectionAriaLabel}>
      <div className="wrap">
        <div className="grid gap-4 md:grid-cols-2">
          {columns.map((column) => (
            <article key={column.title} className="panel-flat grid content-start gap-3 p-6 sm:p-8">
              <h2 className="text-[1.4rem] font-bold leading-snug tracking-[-0.01em]">{column.title}</h2>
              {column.paragraphs.map((paragraph, i) => (
                <p key={i} className="leading-relaxed text-muted-foreground">
                  {paragraph}
                </p>
              ))}
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
