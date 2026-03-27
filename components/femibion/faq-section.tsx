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
    <section
      className="py-16 md:py-24 bg-secondary/30"
      aria-label="ხშირად დასმული კითხვები Femibion-ის შესახებ"
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4 text-balance">
            ხშირად დასმული კითხვები
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            ყველაფერი რაც უნდა იცოდეთ Femibion პრენატალურ ვიტამინებზე
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {FAQ_ITEMS.map((item, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full flex items-center justify-between p-5 md:p-6 text-left gap-4"
                aria-expanded={openIndex === idx}
              >
                <h3 className="font-semibold text-foreground text-base md:text-lg">
                  {item.question}
                </h3>
                <ChevronDown
                  className={cn(
                    'h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200',
                    openIndex === idx && 'rotate-180'
                  )}
                />
              </button>
              <div
                className={cn(
                  'overflow-hidden transition-all duration-300',
                  openIndex === idx ? 'max-h-96 pb-5 md:pb-6' : 'max-h-0'
                )}
              >
                <p className="px-5 md:px-6 text-muted-foreground leading-relaxed">
                  {item.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
