'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Award, Check, CreditCard, Info, ShieldCheck, ShoppingBag, Truck } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCart, type CartProduct } from '@/components/femibion/cart'

type HeroTexts = {
  badge: string
  title: string
  description: string
}

type PregnancyTexts = {
  recommendedLabel: string
  stages: Array<{ week: number; label: string; product?: 1 | 2 }>
}

/** Slider positions: 0 = planning, 1–40 = weeks of pregnancy, 41 = breastfeeding. */
const MAX = 41
const START_WEEK = 8

function trimester(week: number): string {
  if (week === 0) return 'ორსულობამდე'
  if (week <= 12) return 'I ტრიმესტრი'
  if (week <= 27) return 'II ტრიმესტრი'
  if (week <= 40) return 'III ტრიმესტრი'
  return 'მშობიარობის შემდეგ'
}

function weekText(week: number): string {
  if (week === 0) return 'ორსულობის დაგეგმვა'
  if (week === MAX) return 'ლაქტაცია'
  return week === 1 ? '1-ლი კვირა' : `მე-${week} კვირა`
}

/** Shortcuts under the slider; each jumps to a representative week of that stage. */
const SHORTCUTS = [
  { label: 'დაგეგმვა', week: 0, from: 0, to: 0 },
  { label: 'I ტრიმესტრი', week: 8, from: 1, to: 12 },
  { label: 'II ტრიმესტრი', week: 20, from: 13, to: 27 },
  { label: 'III ტრიმესტრი', week: 32, from: 28, to: 40 },
  { label: 'ლაქტაცია', week: MAX, from: MAX, to: MAX },
] as const

/** First week that the editable stage list assigns to Femibion 2 (13 by default). */
function switchWeek(stages: PregnancyTexts['stages']): number {
  const weeks = stages.filter((s) => s.product === 2).map((s) => s.week)
  const first = weeks.length ? Math.min(...weeks) : 13
  return Math.min(Math.max(first, 1), MAX)
}

export function StageFinder({ hero, pregnancy }: { hero: HeroTexts; pregnancy: PregnancyTexts }) {
  const { bySlug } = useCart()
  const [week, setWeek] = useState(START_WEEK)
  const split = switchWeek(pregnancy.stages)
  const splitPct = ((split - 0.5) / MAX) * 100
  const stage: 1 | 2 = week < split ? 1 : 2
  const first = bySlug('femibion-1')
  const second = bySlug('femibion-2')
  const recommended = stage === 1 ? first : second
  const showHint = week >= split - 3 && week <= split + 2
  const recommendedLabel = pregnancy.recommendedLabel.replace(/[:：]\s*$/, '')

  return (
    <section id="finder" className="pb-12 pt-8 md:pb-16 md:pt-12" aria-labelledby="finder-title">
      <div className="wrap">
        <div className="mb-7 grid max-w-[46rem] justify-items-start gap-3">
          <p className="rise inline-flex items-center gap-2 rounded-full border border-border bg-white py-1.5 pl-2.5 pr-3 text-[13.5px] font-semibold" style={{ ['--i' as string]: 0 }}>
            <Award className="h-4 w-4 text-primary" aria-hidden />
            {hero.badge}
          </p>
          <h1
            id="finder-title"
            className="rise break-words text-[2rem] font-bold leading-[1.1] tracking-[-0.02em] sm:text-[2.6rem] lg:text-[3.2rem]"
            style={{ ['--i' as string]: 1 }}
          >
            {hero.title}
          </h1>
          <p className="rise max-w-[40rem] text-[17px] leading-relaxed text-muted-foreground" style={{ ['--i' as string]: 2 }}>
            {hero.description}
          </p>
          <ul className="rise mt-1 flex flex-wrap gap-x-5 gap-y-2 text-[14px] font-medium" style={{ ['--i' as string]: 3 }}>
            <li className="inline-flex items-center gap-2">
              <ShieldCheck className="h-[18px] w-[18px] text-primary" aria-hidden />
              ოფიციალური პროდუქცია
            </li>
            <li className="inline-flex items-center gap-2">
              <Truck className="h-[18px] w-[18px] text-primary" aria-hidden />
              მიწოდება მთელ საქართველოში
            </li>
            <li className="inline-flex items-center gap-2">
              <CreditCard className="h-[18px] w-[18px] text-primary" aria-hidden />
              გადახდა მიწოდებისას
            </li>
          </ul>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.1fr_1fr]">
          <div className="panel rise grid content-start gap-2 p-5 sm:p-7" style={{ ['--i' as string]: 3 }}>
            <label htmlFor="stage-week" className="text-[15px] font-semibold text-muted-foreground">
              რომელ კვირაზე ხარ?
            </label>
            <p className="mt-1 flex min-h-[4.6rem] items-end gap-3 sm:min-h-[7rem]" aria-hidden>
              {week === 0 || week === MAX ? (
                <span className="text-[2.5rem] font-extrabold leading-[1.1] tracking-[-0.02em] sm:text-[3.6rem]">
                  {week === 0 ? 'დაგეგმვა' : 'ლაქტაცია'}
                </span>
              ) : (
                <>
                  <span className="text-[5rem] font-extrabold leading-[0.9] tracking-[-0.05em] tabular-nums sm:text-[7.5rem]">
                    {week}
                  </span>
                  <span className="pb-[0.4em] text-[22px] font-semibold text-muted-foreground">კვირა</span>
                </>
              )}
            </p>
            <p>
              <span
                className={cn(
                  'chip text-[14px] transition-colors duration-200',
                  stage === 1 ? 'bg-f1-wash text-f1-ink' : 'bg-f2-wash text-f2-ink'
                )}
              >
                {trimester(week)}
              </span>
            </p>

            <div className="relative mt-5">
              <span
                className="pointer-events-none absolute top-1.5 h-8 w-0.5 -translate-x-1/2 rounded-full bg-foreground/20"
                style={{ left: `${splitPct}%` }}
                aria-hidden
              />
              <input
                id="stage-week"
                type="range"
                min={0}
                max={MAX}
                step={1}
                value={week}
                onChange={(e) => setWeek(Number(e.target.value))}
                aria-valuetext={`${weekText(week)}, ${recommended?.name ?? ''}`}
                className="stage-range"
                style={{ ['--fill' as string]: `${(week / MAX) * 100}%`, ['--split' as string]: `${splitPct}%` }}
              />
              <div className="mt-1.5 grid text-[13px] font-semibold leading-snug" style={{ gridTemplateColumns: `${splitPct}% 1fr` }} aria-hidden>
                <span className="pr-2 text-f1-ink">
                  {first?.name ?? 'Femibion 1'}
                  <small className="block text-[12.5px] font-medium text-muted-foreground max-[480px]:hidden">
                    დაგეგმვა – მე-{split - 1} კვირა
                  </small>
                </span>
                <span className="pl-3 text-f2-ink">
                  {second?.name ?? 'Femibion 2'}
                  <small className="block text-[12.5px] font-medium text-muted-foreground max-[480px]:hidden">
                    მე-{split} კვირა – ლაქტაცია
                  </small>
                </span>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="ეტაპის სწრაფი არჩევა">
              {SHORTCUTS.map((shortcut) => {
                const active = week >= shortcut.from && week <= shortcut.to
                const f1 = shortcut.week < split
                return (
                  <button
                    key={shortcut.label}
                    type="button"
                    onClick={() => setWeek(shortcut.week)}
                    aria-pressed={active}
                    className={cn(
                      'press cursor-pointer rounded-full border-[1.5px] px-3.5 py-2 text-[14px] font-semibold',
                      active
                        ? f1
                          ? 'border-transparent bg-f1-wash text-f1-ink'
                          : 'border-transparent bg-f2-wash text-f2-ink'
                        : 'border-border bg-white text-foreground hover:border-input'
                    )}
                  >
                    {shortcut.label}
                  </button>
                )
              })}
            </div>

            {showHint && (
              <p className="mt-3 flex items-start gap-2.5 rounded-[14px] bg-background px-3.5 py-3 text-[14px] leading-normal">
                <Info className="mt-0.5 h-[18px] w-[18px] shrink-0 text-primary" aria-hidden />
                <span>
                  {first?.name ?? 'Femibion 1'}-დან {second?.name ?? 'Femibion 2'}-ზე გადასვლა მე-{split - 1}–{split} კვირაზეა,
                  თუმცა შეიძლება 2 კვირით გადაიწიოს. თუ ეჭვი გაქვს, ჰკითხე გინეკოლოგს.
                </span>
              </p>
            )}
          </div>

          <div
            className={cn(
              'rise grid content-start gap-2.5 rounded-[22px] p-5 shadow-[var(--shadow-panel)] transition-colors duration-300 sm:p-7',
              stage === 1 ? 'bg-f1-wash' : 'bg-f2-wash'
            )}
            style={{ ['--i' as string]: 4 }}
            aria-live="polite"
          >
            <p
              className={cn(
                'text-[12.5px] font-bold uppercase tracking-[0.07em] transition-colors duration-200',
                stage === 1 ? 'text-f1-ink' : 'text-f2-ink'
              )}
            >
              {recommendedLabel}
            </p>
            {recommended ? (
              <Recommendation product={recommended} packs={[first, second]} stage={stage} />
            ) : (
              <p className="text-muted-foreground">პროდუქტი დროებით მიუწვდომელია.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

function Recommendation({
  product,
  packs,
  stage,
}: {
  product: CartProduct
  packs: Array<CartProduct | undefined>
  stage: 1 | 2
}) {
  return (
    <>
      <div className="relative mx-auto aspect-square w-full max-w-[230px]">
        {packs.map((pack, i) =>
          pack ? (
            <Image
              key={pack.id}
              src={pack.image}
              alt={i + 1 === stage ? `${pack.name} შეფუთვა` : ''}
              fill
              sizes="230px"
              priority
              data-hidden={i + 1 !== stage}
              className="pack-img object-contain mix-blend-multiply"
            />
          ) : null
        )}
      </div>
      <h2 className="text-[2rem] font-bold leading-tight tracking-[-0.02em]">
        <Link href={product.slug ? `/${product.slug}` : '/#products'} className="hover:text-primary">
          {product.name}
        </Link>
      </h2>
      <p className="-mt-1.5 text-[15px] text-muted-foreground">{product.subtitle}</p>
      {product.features.length > 0 && (
        <ul className="grid gap-2">
          {product.features.map((feature) => (
            <li key={feature} className="flex items-start gap-2.5 text-[15.5px] leading-normal">
              <Check className="mt-[3px] h-[17px] w-[17px] shrink-0 text-primary" aria-hidden />
              {feature}
            </li>
          ))}
        </ul>
      )}
      <div className="mt-2.5 flex flex-wrap items-center justify-between gap-3">
        <span className="text-[2.1rem] font-extrabold tracking-[-0.02em] tabular-nums">{product.price} ₾</span>
        <AddToCartButton product={product} />
      </div>
      {product.slug && (
        <Link
          href={`/${product.slug}`}
          className="inline-flex items-center gap-1.5 justify-self-start text-[14.5px] font-semibold text-primary underline-offset-4 hover:underline"
        >
          შემადგენლობა და დეტალები
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      )}
    </>
  )
}

/** Adds one pack and confirms in place for ~1.3s; the header badge and phone cart bar update too. */
export function AddToCartButton({
  product,
  label = 'კალათაში დამატება',
  className,
}: {
  product: CartProduct
  label?: string
  className?: string
}) {
  const { add } = useCart()
  const [done, setDone] = useState(false)
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  if (!product.inStock) {
    return <span className="text-[15px] font-semibold text-muted-foreground">ამოიწურა</span>
  }

  return (
    <button
      type="button"
      onClick={() => {
        add(product.id)
        setDone(true)
        window.clearTimeout(timer.current)
        timer.current = window.setTimeout(() => setDone(false), 1300)
      }}
      className={cn('btn-primary', className)}
    >
      {done ? <Check className="h-[18px] w-[18px]" aria-hidden /> : <ShoppingBag className="h-[18px] w-[18px]" aria-hidden />}
      <span aria-live="polite">{done ? 'დამატებულია' : label}</span>
    </button>
  )
}
