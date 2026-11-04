'use client'

import { useState } from 'react'
import Link from 'next/link'
import { localTodayISO, ovulationCycles, pregnancyDueDate, type CycleWindow, type DueDateResult } from '@/lib/cycle-math'
import { articleTool } from '@/lib/article-tools'

const fieldClass =
  'h-12 w-full rounded-[12px] border-[1.5px] border-input bg-white px-3.5 text-base text-foreground focus:border-primary focus:outline-none focus:ring-[3px] focus:ring-primary/20'

function formatKa(iso: string): string {
  const [year, month, day] = iso.split('-').map(Number)
  return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString('ka-GE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  })
}

function CycleField({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <label className="grid gap-1.5 text-[14px] font-semibold">
      ციკლის ხანგრძლივობა (დღე)
      <input
        className={fieldClass}
        inputMode="numeric"
        min={21}
        max={45}
        type="number"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  )
}

function DateField({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <label className="grid gap-1.5 text-[14px] font-semibold">
      ბოლო მენსტრუაციის პირველი დღე
      <input className={fieldClass} type="date" value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  )
}

export function OvulationCalculator() {
  const [lmp, setLmp] = useState('')
  const [cycle, setCycle] = useState('28')
  const [error, setError] = useState<string | null>(null)
  const [cycles, setCycles] = useState<CycleWindow[] | null>(null)

  function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    const result = ovulationCycles(lmp, Number(cycle), localTodayISO())
    if ('error' in result) {
      setCycles(null)
      setError(result.error)
      return
    }
    setError(null)
    setCycles(result.cycles)
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <DateField value={lmp} onChange={setLmp} />
        <CycleField value={cycle} onChange={setCycle} />
      </div>
      <button type="submit" className="btn-primary justify-self-start">
        გამოთვლა
      </button>
      {error && <p className="text-[15px] font-semibold text-destructive">{error}</p>}
      {cycles && (
        <div className="grid gap-3">
          {cycles.map((item, index) => (
            <div key={item.cycleStart} className="rounded-[16px] bg-white p-4">
              <p className="mb-2 font-bold">{index + 1} ციკლი</p>
              <dl className="grid gap-1.5 text-[15px]">
                <div className="flex flex-wrap justify-between gap-x-3">
                  <dt className="text-muted-foreground">შემდეგი მენსტრუაცია</dt>
                  <dd className="font-semibold">{formatKa(item.nextMenses)}</dd>
                </div>
                <div className="flex flex-wrap justify-between gap-x-3">
                  <dt className="text-muted-foreground">სავარაუდო ოვულაცია</dt>
                  <dd className="font-semibold">{formatKa(item.ovulation)}</dd>
                </div>
                <div className="flex flex-wrap justify-between gap-x-3">
                  <dt className="text-muted-foreground">ნაყოფიერი დღეები</dt>
                  <dd className="font-semibold">
                    {formatKa(item.fertileStart)} – {formatKa(item.fertileEnd)}
                  </dd>
                </div>
              </dl>
            </div>
          ))}
        </div>
      )}
      <p className="text-[14px] leading-relaxed text-muted-foreground">
        ეს მიახლოებითი კალენდრული გამოთვლაა და ექიმის კონსულტაციას არ ცვლის. ოვულაციის დღე ციკლიდან ციკლამდე შეიძლება გადაიწიოს.
      </p>
      <Link href="/femibion-1" className="btn-primary justify-self-start">
        დაგეგმვისას — Femibion 1
      </Link>
    </form>
  )
}

const TRIMESTER = { 1: 'I ტრიმესტრი', 2: 'II ტრიმესტრი', 3: 'III ტრიმესტრი' } as const

export function DueDateCalculator() {
  const [lmp, setLmp] = useState('')
  const [cycle, setCycle] = useState('28')
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<DueDateResult | null>(null)

  function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    const next = pregnancyDueDate(lmp, Number(cycle), localTodayISO())
    if ('error' in next) {
      setResult(null)
      setError(next.error)
      return
    }
    setError(null)
    setResult(next)
  }

  const productHref = result?.product === 'femibion-2' ? '/femibion-2' : '/femibion-1'
  const productLabel = result?.product === 'femibion-2' ? 'ამ ვადაზე — Femibion 2' : 'ამ ვადაზე — Femibion 1'

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <DateField value={lmp} onChange={setLmp} />
        <CycleField value={cycle} onChange={setCycle} />
      </div>
      <button type="submit" className="btn-primary justify-self-start">
        გამოთვლა
      </button>
      {error && <p className="text-[15px] font-semibold text-destructive">{error}</p>}
      {result && (
        <dl className="grid gap-2 rounded-[16px] bg-white p-4 text-[15px]">
          <div className="flex flex-wrap justify-between gap-x-3">
            <dt className="text-muted-foreground">მშობიარობის სავარაუდო თარიღი</dt>
            <dd className="font-semibold">{formatKa(result.edd)}</dd>
          </div>
          <div className="flex flex-wrap justify-between gap-x-3">
            <dt className="text-muted-foreground">სამეანო ვადა დღეს</dt>
            <dd className="font-semibold">
              {result.weeks} კვირა{result.days ? ` და ${result.days} დღე` : ''}
            </dd>
          </div>
          <div className="flex flex-wrap justify-between gap-x-3">
            <dt className="text-muted-foreground">ტრიმესტრი</dt>
            <dd className="font-semibold">{TRIMESTER[result.trimester]}</dd>
          </div>
        </dl>
      )}
      <p className="text-[14px] leading-relaxed text-muted-foreground">
        გამოთვლა ბოლო მენსტრუაციას ეყრდნობა. ულტრაბგერითმა კვლევამ, განსაკუთრებით პირველ ტრიმესტრში, ვადა შეიძლება დააზუსტოს. საბოლოო თარიღს ექიმი ადგენს.
      </p>
      {result && (
        <Link href={productHref} className="btn-primary justify-self-start">
          {productLabel}
        </Link>
      )}
    </form>
  )
}

const CALCULATORS = {
  'ovulaciis-gamotvla': OvulationCalculator,
  'orsulobis-vadis-gamotvla': DueDateCalculator,
} as const

export function ArticleTool({ slug }: { slug: string }) {
  const tool = articleTool(slug)
  if (!tool) return null
  const Calculator = CALCULATORS[slug as keyof typeof CALCULATORS]
  return (
    <section aria-labelledby={tool.id} className="panel-flat my-8 grid gap-4 p-5 sm:p-6">
      <h2 id={tool.id} className="scroll-mt-24 text-[1.6rem] font-bold leading-snug tracking-[-0.01em]">
        {tool.title}
      </h2>
      <Calculator />
    </section>
  )
}
