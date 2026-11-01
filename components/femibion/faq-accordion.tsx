'use client'

import { useId, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { FaqItem } from '@/lib/faq'

/** Question list inside one white panel; answers expand with a grid-rows transition. */
export function FaqAccordion({
  items,
  headingLevel = 'h2',
  className,
}: {
  items: FaqItem[]
  headingLevel?: 'h2' | 'h3'
  className?: string
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const uid = useId()
  const Heading = headingLevel

  return (
    <div className={cn('panel-flat px-5 sm:px-6', className)}>
      {items.map((item, idx) => {
        const open = openIndex === idx
        const panelId = `${uid}-a${idx}`
        return (
          <div key={idx} className="border-b border-border last:border-b-0">
            <Heading className="m-0">
              <button
                type="button"
                onClick={() => setOpenIndex(open ? null : idx)}
                aria-expanded={open}
                aria-controls={panelId}
                className="flex w-full cursor-pointer items-start justify-between gap-4 py-[18px] text-left text-[16.5px] font-semibold leading-snug focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
              >
                <span>{item.question}</span>
                <ChevronDown
                  className={cn(
                    'mt-0.5 h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200 [transition-timing-function:var(--ease-out)]',
                    open && 'rotate-180'
                  )}
                  aria-hidden
                />
              </button>
            </Heading>
            <div
              id={panelId}
              className={cn(
                'grid transition-[grid-template-rows] duration-300 [transition-timing-function:var(--ease-out)]',
                open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
              )}
            >
              <div className="overflow-hidden" inert={!open}>
                <div className="grid max-w-[62ch] gap-3 pb-5 leading-relaxed text-muted-foreground">
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
