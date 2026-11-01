import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { FaqAccordion } from '@/components/femibion/faq-accordion'

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
  return (
    <section id="faq" className="py-12 md:py-16" aria-labelledby="home-faq-title">
      <div className="wrap grid items-start gap-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-12">
        <div className="grid justify-items-start gap-2 lg:sticky lg:top-[92px]">
          <h2 id="home-faq-title" className="section-heading">
            ხშირად დასმული კითხვები
          </h2>
          <p className="text-[17px] text-muted-foreground">ყველაფერი, რაც უნდა იცოდე Femibion-ის მიღებაზე.</p>
          <Link
            href="/faq"
            className="mt-2 inline-flex items-center gap-1.5 text-[15px] font-semibold text-primary underline-offset-4 hover:underline"
          >
            ყველა კითხვა
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
        <FaqAccordion
          headingLevel="h3"
          items={FAQ_ITEMS.map((item) => ({ question: item.question, answer: [item.answer] }))}
        />
      </div>
    </section>
  )
}
