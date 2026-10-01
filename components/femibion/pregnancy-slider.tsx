'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Sprout } from 'lucide-react'
import { cn } from '@/lib/utils'

type PregnancyTexts = {
  title: string
  subtitle: string
  labelStart: string
  labelEnd: string
  recommendedLabel: string
  product1Label: string
  product1Subtitle: string
  product2Label: string
  product2Subtitle: string
  stages: Array<{ week: number; label: string; product?: 1 | 2 }>
}

export function PregnancySlider({ texts }: { texts: PregnancyTexts }) {
  const [selectedWeek, setSelectedWeek] = useState(8)

  const currentStage = texts.stages.reduce(
    (prev, curr) => (curr.week <= selectedWeek ? curr : prev),
    texts.stages[0]
  )
  const recommendedProduct = (currentStage?.product ?? (selectedWeek <= 12 ? 1 : 2)) as 1 | 2

  return (
    <section
      className="section-pad bg-accent/40"
      aria-label="ორსულობის კალკულატორი"
    >
      <div className="wrap">
        <div className="mb-12 text-center">
          <span className="eyebrow mb-4 justify-center">შენი ეტაპი</span>
          <h2 className="section-heading">
            {texts.title}
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">{texts.subtitle}</p>
        </div>

        <div className="mx-auto max-w-3xl">
          <div className="paper-card rounded-[2rem] p-6 md:p-10">
            <div className="mb-8">
              <div className="mb-4 flex justify-between text-sm font-medium text-muted-foreground">
                <span>{texts.labelStart}</span>
                <span>{texts.labelEnd}</span>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="h-2.5 w-full rounded-full bg-gradient-to-r from-accent via-secondary to-primary/55" />
                </div>
                <input
                  type="range"
                  min="0"
                  max="44"
                  value={selectedWeek}
                  onChange={(e) => setSelectedWeek(Number(e.target.value))}
                  aria-label="ორსულობის კვირა"
                  className="relative z-10 w-full cursor-pointer appearance-none bg-transparent [&::-moz-range-thumb]:h-7 [&::-moz-range-thumb]:w-7 [&::-moz-range-thumb]:cursor-grab [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-4 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:bg-primary [&::-moz-range-thumb]:shadow-md [&::-webkit-slider-thumb]:h-7 [&::-webkit-slider-thumb]:w-7 [&::-webkit-slider-thumb]:cursor-grab [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-md"
                  style={{ height: '2.5rem' }}
                />
              </div>

              <div className="mt-5 flex justify-center">
                <span className="inline-flex items-center gap-2 rounded-xl bg-secondary px-5 py-2.5 text-lg font-semibold text-primary">
                  <Sprout className="h-5 w-5" aria-hidden />
                  {currentStage.label}
                </span>
              </div>
            </div>

            <div className="border-t border-border/60 pt-8">
              <p className="mb-5 text-center text-sm text-muted-foreground">
                {texts.recommendedLabel}
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <ProductCard
                  href="/femibion-1"
                  active={recommendedProduct === 1}
                  label={texts.product1Label}
                  subtitle={texts.product1Subtitle}
                />
                <ProductCard
                  href="/femibion-2"
                  active={recommendedProduct === 2}
                  label={texts.product2Label}
                  subtitle={texts.product2Subtitle}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function ProductCard({
  href,
  active,
  label,
  subtitle,
}: {
  href: string
  active: boolean
  label: string
  subtitle: string
}) {
  return (
    <Link
      href={href}
      className={cn(
        'block cursor-pointer rounded-2xl border p-5 transition-colors duration-200',
        active
          ? 'border-primary/45 bg-secondary/65'
          : 'border-border/70 bg-card/55 hover:border-primary/30'
      )}
    >
      <h3 className="font-semibold text-foreground">{label}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
    </Link>
  )
}
