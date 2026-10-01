'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

const FAQ_ITEMS = [
  {
    question: 'რა არის Femibion და რისთვის გამოიყენება?',
    answer:
      'Femibion არის #1 პრენატალური ვიტამინი ევროპაში, რომელიც სპეციალურად შემუშავებულია ორსულობის დაგეგმვის, ორსულობის და ლაქტაციის პერიოდისთვის. შეიცავს Metafolin® - ფოლიუმის მჟავას აქტიურ ფორმას, რომელსაც ორგანიზმი პირდაპირ ითვისებს.',
  },
  {
    question: 'რა განსხვავებაა Femibion 1 და Femibion 2 შორის?',
    answer:
      'Femibion 1 განკუთვნილია ორსულობის დაგეგმვისა და პირველი ტრიმესტრისთვის (1-12 კვირა), შეიცავს ფოლატს 800მკგ. Femibion 2 განკუთვნილია მეორე-მესამე ტრიმესტრისთვის და ლაქტაციის პერიოდისთვის (13+ კვირა), დამატებით შეიცავს DHA ომეგა-3 200მგ ბავშვის ტვინის განვითარებისთვის.',
  },
  {
    question: 'რა არის Metafolin® და რატომ არის მნიშვნელოვანი?',
    answer:
      'Metafolin® არის ფოლიუმის მჟავას ბიოაქტიური ფორმა (L-მეთილფოლატი). ჩვეულებრივი ფოლიუმის მჟავისგან განსხვავებით, Metafolin® პირდაპირ ითვისება ორგანიზმის მიერ, რაც განსაკუთრებით მნიშვნელოვანია ორსულობის პერიოდში ნერვული მილის სწორი განვითარებისთვის.',
  },
  {
    question: 'როგორ შევუკვეთო Femibion საქართველოში?',
    answer:
      'Femibion-ის შეკვეთა საქართველოში შესაძლებელია femibion.ge ვებსაიტზე შეკვეთის ფორმის შევსებით. პროდუქტი მიიტანება პირდაპირ სახლში. ასევე შეგიძლიათ დარეკოთ: +995 595 94 74 50.',
  },
  {
    question: 'როდის უნდა დავიწყო Femibion-ის მიღება?',
    answer:
      'Femibion 1-ის მიღება რეკომენდებულია ორსულობის დაგეგმვის ეტაპიდან (მინიმუმ 4 კვირით ადრე) და გაგრძელდეს პირველი ტრიმესტრის ბოლომდე (მე-12 კვირამდე). მე-13 კვირიდან გადაერთეთ Femibion 2-ზე, რომელიც ლაქტაციის პერიოდშიც გამოიყენება.',
  },
  {
    question: 'რატომ არის DHA ომეგა-3 მნიშვნელოვანი ორსულობის დროს?',
    answer:
      'DHA (დოკოზაჰექსაენის მჟავა) არის ომეგა-3 ცხიმოვანი მჟავა, რომელიც აუცილებელია ნაყოფის ტვინის და თვალების ნორმალური განვითარებისთვის. Femibion 2 შეიცავს 200მგ DHA-ს, რაც რეკომენდებული დღიური დოზაა ორსულებისთვის.',
  },
]

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="section-pad bg-background/85" aria-label="ხშირად დასმული კითხვები">
      <div className="wrap">
        <div className="mb-12 text-center">
          <span className="eyebrow mb-4 justify-center">სასარგებლო ინფორმაცია</span>
          <h2 className="section-heading">ხშირად დასმული კითხვები</h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
            ყველაფერი რაც უნდა იცოდეთ Femibion პრენატალურ ვიტამინებზე
          </p>
        </div>

        <div className="mx-auto max-w-3xl space-y-3">
          {FAQ_ITEMS.map((item, idx) => {
            const open = openIndex === idx
            return (
              <div
                key={idx}
                className="overflow-hidden rounded-2xl border border-border/70 bg-card/75 transition-colors hover:bg-card"
              >
                <button
                  onClick={() => setOpenIndex(open ? null : idx)}
                  className="flex w-full cursor-pointer items-center justify-between gap-4 p-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary md:p-6"
                  aria-expanded={open}
                >
                  <h3 className="font-medium leading-7 text-foreground md:text-lg">{item.question}</h3>
                  <ChevronDown
                    className={cn(
                      'h-5 w-5 shrink-0 text-primary transition-transform duration-200',
                      open && 'rotate-180'
                    )}
                  />
                </button>
                <div
                  className={cn(
                    'overflow-hidden transition-all duration-300',
                    open ? 'max-h-96' : 'max-h-0'
                  )}
                >
                  <p className="border-t border-border/50 px-5 pb-5 pt-4 leading-7 text-muted-foreground md:px-6 md:pb-6">
                    {item.answer}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
