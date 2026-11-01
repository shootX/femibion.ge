import { LEGAL_ENTITY } from '@/lib/legal'

export function LegalEntityNotice() {
  const rows = [
    { label: 'იურიდიული სახელი', value: LEGAL_ENTITY.displayName },
    { label: 'საიდენტიფიკაციო ნომერი', value: LEGAL_ENTITY.taxId },
    { label: 'მისამართი', value: LEGAL_ENTITY.address },
  ]
  return (
    <section className="rounded-[22px] bg-white/60 p-5 text-[14.5px] ring-1 ring-border sm:p-6" aria-label="მონაცემთა დამმუშავებელი / გამყიდველი">
      <h2 className="text-[15px] font-bold">მონაცემთა დამმუშავებელი / გამყიდველი</h2>
      <dl className="mt-3 grid gap-2">
        {rows.map((row) => (
          <div key={row.label} className="grid gap-x-3 sm:grid-cols-[12rem_minmax(0,1fr)]">
            <dt className="text-muted-foreground">{row.label}</dt>
            <dd className="font-medium">{row.value}</dd>
          </div>
        ))}
        <div className="grid gap-x-3 sm:grid-cols-[12rem_minmax(0,1fr)]">
          <dt className="text-muted-foreground">ელფოსტა</dt>
          <dd className="font-medium">
            <a href={`mailto:${LEGAL_ENTITY.email}`} className="text-primary underline-offset-2 hover:underline">
              {LEGAL_ENTITY.email}
            </a>
          </dd>
        </div>
      </dl>
    </section>
  )
}
