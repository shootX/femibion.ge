'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { FaqItem } from '@/lib/faq'

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="mx-auto max-w-3xl space-y-3">
      {items.map((item, idx) => {
        const open = openIndex === idx
        return (
          <div
            key={idx}
            className="overflow-hidden rounded-2xl border border-border/70 bg-card/75 transition-colors hover:bg-card"
          >
            <button
              type="button"
              onClick={() => setOpenIndex(open ? null : idx)}
              className="flex w-full cursor-pointer items-center justify-between gap-4 p-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary md:p-6"
              aria-expanded={open}
            >
              <h2 className="font-medium leading-7 text-foreground md:text-lg">{item.question}</h2>
              <ChevronDown
                className={cn(
                  'h-5 w-5 shrink-0 text-primary transition-transform duration-200',
                  open && 'rotate-180'
                )}
              />
            </button>
            <div
              className={cn(
                'grid transition-[grid-template-rows] duration-300',
                open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
              )}
            >
              <div className="overflow-hidden">
                <div className="space-y-3 border-t border-border/50 px-5 pb-5 pt-4 leading-7 text-muted-foreground md:px-6 md:pb-6">
                  {item.answer.map((paragraph, pIdx) => (
                    <p key={pIdx}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}