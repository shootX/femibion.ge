'use client'

import { useState } from 'react'
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
    <section className="py-16 md:py-24 bg-secondary/50" aria-label="ორსულობის კალკულატორი - აირჩიე შენთვის სწორი Femibion პროდუქტი">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4 text-balance">
            {texts.title}
          </h2>
          <p className="text-lg text-muted-foreground">
            {texts.subtitle}
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="bg-card rounded-3xl p-6 md:p-10 shadow-xl border border-border">
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-medium text-muted-foreground">{texts.labelStart}</span>
                <span className="text-sm font-medium text-muted-foreground">{texts.labelEnd}</span>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full h-3 rounded-full bg-gradient-to-r from-pink-200 via-rose-300 to-pink-400" />
                </div>

                <input
                  type="range"
                  min="0"
                  max="44"
                  value={selectedWeek}
                  onChange={(e) => setSelectedWeek(Number(e.target.value))}
                  className="relative w-full h-3 appearance-none bg-transparent cursor-pointer z-10 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-7 [&::-webkit-slider-thumb]:w-7 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:cursor-grab [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110 [&::-moz-range-thumb]:h-7 [&::-moz-range-thumb]:w-7 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-primary [&::-moz-range-thumb]:shadow-lg [&::-moz-range-thumb]:border-4 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:cursor-grab"
                />

                <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full flex justify-between px-1 pointer-events-none">
                  <div className="h-2 w-0.5 bg-white/50 rounded-full" />
                  <div className="h-2 w-0.5 bg-white/50 rounded-full" />
                  <div className="h-2 w-0.5 bg-white/50 rounded-full" />
                  <div className="h-2 w-0.5 bg-white/50 rounded-full" />
                  <div className="h-2 w-0.5 bg-white/50 rounded-full" />
                </div>
              </div>

              <div className="flex justify-center mt-4">
                <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2">
                  <span className="text-2xl font-bold text-primary">
                    {currentStage.label}
                  </span>
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-8">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">{texts.recommendedLabel}</p>
                <div className="flex items-center justify-center gap-4">
                  <div
                    className={cn(
                      'flex-1 max-w-[200px] rounded-2xl p-4 border-2 transition-all duration-300',
                      recommendedProduct === 1
                        ? 'border-primary bg-primary/5 shadow-lg scale-105'
                        : 'border-border opacity-50'
                    )}
                  >
                    <h3 className="font-bold text-foreground">{texts.product1Label}</h3>
                    <p className="text-xs text-muted-foreground">{texts.product1Subtitle}</p>
                  </div>
                  <div
                    className={cn(
                      'flex-1 max-w-[200px] rounded-2xl p-4 border-2 transition-all duration-300',
                      recommendedProduct === 2
                        ? 'border-primary bg-primary/5 shadow-lg scale-105'
                        : 'border-border opacity-50'
                    )}
                  >
                    <h3 className="font-bold text-foreground">{texts.product2Label}</h3>
                    <p className="text-xs text-muted-foreground">{texts.product2Subtitle}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
