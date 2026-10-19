import { LEGAL_ENTITY } from '@/lib/legal'

export function LegalEntityNotice() {
  return (
    <section
      className="mt-8 rounded-xl border bg-card p-5 text-sm leading-relaxed"
      aria-label="მონაცემთა დამმუშავებელი / გამყიდველი"
    >
      <h2 className="text-base font-semibold text-foreground">მონაცემთა დამმუშავებელი / გამყიდველი</h2>
      <dl className="mt-3 space-y-2 text-muted-foreground">
        <div>
          <dt className="inline font-medium text-foreground">იურიდიული სახელი: </dt>
          <dd className="inline">{LEGAL_ENTITY.displayName}</dd>
        </div>
        <div>
          <dt className="inline font-medium text-foreground">საიდენტიფიკაციო ნომერი: </dt>
          <dd className="inline">{LEGAL_ENTITY.taxId}</dd>
        </div>
        <div>
          <dt className="inline font-medium text-foreground">მისამართი: </dt>
          <dd className="inline">{LEGAL_ENTITY.address}</dd>
        </div>
        <div>
          <dt className="inline font-medium text-foreground">ელფოსტა: </dt>
          <dd className="inline">
            <a href={`mailto:${LEGAL_ENTITY.email}`} className="cursor-pointer underline-offset-2 hover:underline">
              {LEGAL_ENTITY.email}
            </a>
          </dd>
        </div>
      </dl>
    </section>
  )
}
