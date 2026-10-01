import { Award, ShieldCheck, Truck, Users } from 'lucide-react'

const TRUST_ITEMS = [
  {
    icon: Award,
    title: '#1 ევროპაში',
    description: 'პრენატალური ვიტამინი',
  },
  {
    icon: ShieldCheck,
    title: 'ევროპული ხარისხი',
    description: 'Merck ბრენდი',
  },
  {
    icon: Truck,
    title: 'მიწოდება სახლში',
    description: 'მთელ საქართველოში',
  },
  {
    icon: Users,
    title: 'Metafolin®',
    description: 'აქტიური ფოლატის ფორმა',
  },
] as const

export function TrustBar() {
  return (
    <section
      className="border-y border-border/70 bg-card/70 py-7 backdrop-blur-sm"
      aria-label="Femibion სანდოობის მაჩვენებლები"
    >
      <div className="wrap">
        <ul className="grid grid-cols-2 gap-x-5 gap-y-7 lg:grid-cols-4 lg:divide-x lg:divide-border/70">
          {TRUST_ITEMS.map(({ icon: Icon, title, description }) => (
            <li
              key={title}
              className="flex items-start gap-3 sm:items-center sm:gap-4 lg:px-5 first:lg:pl-0"
            >
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/70 text-accent-foreground sm:h-11 sm:w-11"
                aria-hidden
              >
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground sm:text-base">{title}</p>
                <p className="text-xs text-muted-foreground sm:text-sm">{description}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
