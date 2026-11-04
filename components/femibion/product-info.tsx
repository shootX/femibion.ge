import Link from 'next/link'
import { FaqAccordion } from '@/components/femibion/faq-accordion'
import type { FaqItem } from '@/lib/faq'
import type { ProductPageSlug } from '@/lib/product-slug'

type Row = { substance: string; amount: string; nrv: string }

const PLACEHOLDER = '[შესავსები]'

const COMPOSITION: Record<ProductPageSlug, Row[]> = {
  'femibion-1': [
    { substance: 'ფოლატი (მათ შორის Metafolin®)', amount: '800 მკგ', nrv: PLACEHOLDER },
    { substance: 'ფურცლის დანარჩენი ნივთიერებები', amount: PLACEHOLDER, nrv: PLACEHOLDER },
  ],
  'femibion-2': [
    { substance: 'DHA (ომეგა-3)', amount: '200 მგ', nrv: PLACEHOLDER },
    { substance: 'ფოლატი (მათ შორის Metafolin®)', amount: PLACEHOLDER, nrv: PLACEHOLDER },
    { substance: 'ფურცლის დანარჩენი ნივთიერებები', amount: PLACEHOLDER, nrv: PLACEHOLDER },
  ],
}

const FAQ: Record<ProductPageSlug, FaqItem[]> = {
  'femibion-1': [
    {
      question: 'რა ღირს Femibion 1?',
      answer: ['Femibion 1-ის ფასი femibion.ge-ზე 100 ₾-ია. გადახდა ხდება მიწოდებისას, ნაღდი ანგარიშსწორებით ან საბანკო ბარათით.'],
    },
    {
      question: 'სად ვიყიდო და როგორ დავრწმუნდე, რომ ორიგინალია?',
      answer: [
        'შეკვეთა იფორმება ოფიციალურ საიტზე femibion.ge. ეს არის Femibion-ის ოფიციალური არხი საქართველოში. შეკვეთამდე გადაამოწმეთ, რომ მისამართი ზუსტად femibion.ge-ა, ხოლო კურიერის მოსვლისას — შეფუთვა და ვარგისიანობის ვადა.',
      ],
    },
    {
      question: 'შეიძლება თუ არა სხვა ვიტამინებთან ან რკინასთან ერთად?',
      answer: [
        `საიტის მასალებში აღნიშნულია, რომ ფემიბიონი რკინას არ შეიცავს, ამიტომ რკინის საჭიროებას ექიმი ანალიზების საფუძველზე ცალკე აფასებს. სხვა ვიტამინებთან ერთად მიღების წესი ფურცელში ${PLACEHOLDER}. მიღება შეუთანხმეთ ექიმს.`,
      ],
    },
    {
      question: 'როდის გადავიდე Femibion 2-ზე?',
      answer: [
        'Femibion 1 განკუთვნილია ორსულობის დაგეგმვიდან მე-12 კვირის ჩათვლით. მე-13 კვირიდან გამოიყენება Femibion 2, რომელიც დამატებით შეიცავს 200 მგ DHA-ს და გრძელდება ძუძუთი კვების დასრულებამდე.',
      ],
    },
    {
      question: 'როგორ შევინახო?',
      answer: [`შენახვის პირობები (ტემპერატურა და ვადა შეფუთვის გახსნის შემდეგ) ოფიციალურ ფურცელში ${PLACEHOLDER}.`],
    },
    {
      question: 'საჭმელთან ერთად მივიღო?',
      answer: [
        `დღიური დოზაა 1 ტაბლეტი. საჭმელთან ერთად მიღება თუ უზმოზე — ფურცელში ${PLACEHOLDER}. რამდენი დღეა ერთ შეფუთვაში, ასევე ${PLACEHOLDER}.`,
      ],
    },
  ],
  'femibion-2': [
    {
      question: 'რა ღირს Femibion 2?',
      answer: ['Femibion 2-ის ფასი femibion.ge-ზე 140 ₾-ია. გადახდა ხდება მიწოდებისას, ნაღდი ანგარიშსწორებით ან საბანკო ბარათით.'],
    },
    {
      question: 'სად ვიყიდო და როგორ დავრწმუნდე, რომ ორიგინალია?',
      answer: [
        'შეკვეთა იფორმება ოფიციალურ საიტზე femibion.ge. კურიერის მოსვლისას გადაამოწმეთ შეფუთვა, დასახელება (Femibion 2) და ვარგისიანობის ვადა. მარკეტფლეისზე უფრო იაფი შეთავაზება ორიგინალის გარანტია არ არის.',
      ],
    },
    {
      question: 'შეიძლება თუ არა სხვა ვიტამინებთან ან რკინასთან ერთად?',
      answer: [
        `ფემიბიონი რკინას არ შეიცავს. თუ ექიმი რკინას დაგინიშნავთ, ის ცალკე პრეპარატია და ანალიზებს ეყრდნობა. სხვა ვიტამინურ კომპლექსთან შეთავსების დეტალი ფურცელში ${PLACEHOLDER}. მიღება შეუთანხმეთ ექიმს.`,
      ],
    },
    {
      question: 'როდის უნდა გადავიდე Femibion 1-დან Femibion 2-ზე?',
      answer: [
        'გადასვლა ხდება მე-13 კვირიდან. მანამდე, დაგეგმვისა და პირველი ტრიმესტრის დროს, გამოიყენება Femibion 1 (1 ტაბლეტი დღეში, 800 მკგ ფოლატი). Femibion 2 გრძელდება ძუძუთი კვების დასრულებამდე.',
      ],
    },
    {
      question: 'როგორ შევინახო?',
      answer: [`შენახვის ტემპერატურა და პირობები ოფიციალურ ფურცელში ${PLACEHOLDER}.`],
    },
    {
      question: 'ტაბლეტი და კაფსულა ერთად მივიღო?',
      answer: [
        `დღიური დოზაა 1 ტაბლეტი და 1 კაფსულა. საჭმელთან ერთად მიღება თუ არა — ფურცელში ${PLACEHOLDER}. ერთი შეფუთვის დღეების რაოდენობა ასევე ${PLACEHOLDER}.`,
      ],
    },
  ],
}

function faqJsonLd(slug: ProductPageSlug) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ[slug].map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer.join(' ') },
    })),
  }
}

export function ProductInfo({ slug }: { slug: ProductPageSlug }) {
  const second = slug === 'femibion-2'
  const rows = COMPOSITION[slug]

  return (
    <div className="mt-10 grid gap-8 border-t border-border pt-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(slug)) }} />

      <section className="grid gap-3" aria-labelledby="composition-title">
        <h2 id="composition-title" className="text-[1.6rem] font-bold tracking-[-0.01em]">
          შემადგენლობა
        </h2>
        <p className="max-w-[68ch] text-[16.5px] leading-relaxed text-ink-soft">
          ცხრილში მხოლოდ ის რაოდენობებია, რომლებიც საიტის დადასტურებულ მონაცემებში წერია. დანარჩენი სტრიქონები და ნუტრიენტის რეკომენდებული დღიური ოდენობის პროცენტი (% NRV) ოფიციალური ფურცლიდან უნდა შეივსოს — სანამ ფურცელი არ არის დამატებული, უჯრაში დგას {PLACEHOLDER}.
        </p>
        <div className="overflow-x-auto rounded-[16px] border border-border">
          <table className="w-full min-w-[36rem] border-collapse text-left text-[15px]">
            <thead className="bg-background text-[13px] uppercase tracking-[0.04em] text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-bold">ნივთიერება</th>
                <th className="px-4 py-3 font-bold">რაოდენობა დღიურ დოზაში</th>
                <th className="px-4 py-3 font-bold">% NRV</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.substance} className="border-t border-border">
                  <th className="px-4 py-3 font-semibold">{row.substance}</th>
                  <td className="px-4 py-3">{row.amount}</td>
                  <td className="px-4 py-3">{row.nrv}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {second ? (
          <p className="max-w-[68ch] text-[16.5px] leading-relaxed text-ink-soft">
            Femibion 2 გაფართოებული ფორმულაა მეორე და მესამე ტრიმესტრისა და ძუძუთი კვებისთვის. დადასტურებულია 200 მგ DHA ომეგა-3. ფოლატი, მათ შორის Metafolin®, ამ ფორმულაშიც არის, მაგრამ ზუსტი რაოდენობა ფურცლის გარეშე აქ არ წერია. ფემიბიონი რკინას არ შეიცავს.
          </p>
        ) : (
          <p className="max-w-[68ch] text-[16.5px] leading-relaxed text-ink-soft">
            Femibion 1 ორსულობის დაგეგმვისა და პირველი ტრიმესტრის ფორმულაა. დადასტურებული დღიური ფოლატია 800 მკგ, მათ შორის Metafolin® — ფოლატის ის ფორმა, რომელსაც საიტის მასალები პირდაპირ ათვისებად ფორმად აღწერს. ფურცლის სრული ცხრილი (ვიტამინები, მინერალები და მათი % NRV) ჯერ არ არის შეტანილი.
          </p>
        )}
      </section>

      <section className="grid gap-3" aria-labelledby="how-to-title">
        <h2 id="how-to-title" className="text-[1.6rem] font-bold tracking-[-0.01em]">
          როგორ მივიღოთ
        </h2>
        {second ? (
          <>
            <p className="max-w-[68ch] text-[16.5px] leading-relaxed text-ink-soft">
              დღიური დოზაა 1 ტაბლეტი და 1 კაფსულა. Femibion 2 იწყება ორსულობის მე-13 კვირიდან და გრძელდება ძუძუთი კვების დასრულებამდე. მანამდე, დაგეგმვიდან მე-12 კვირის ჩათვლით, გამოიყენება Femibion 1 — დღეში 1 ტაბლეტი.
            </p>
            <p className="max-w-[68ch] text-[16.5px] leading-relaxed text-ink-soft">
              საჭმელთან ერთად მიღება თუ უზმოზე, დღის რომელი მონაკვეთი ჯობია და ერთი შეფუთვა რამდენ დღეს ყოფნის — ეს დეტალები ფურცელში {PLACEHOLDER}. ვადას თუ ეჭვი გეპარებათ, ჯერ გინეკოლოგს ჰკითხეთ და საიტის კალკულატორშიც შეგიძლიათ კვირა ნახოთ.
            </p>
          </>
        ) : (
          <>
            <p className="max-w-[68ch] text-[16.5px] leading-relaxed text-ink-soft">
              დღიური დოზაა 1 ტაბლეტი. Femibion 1 განკუთვნილია ორსულობის დაგეგმვის პერიოდისთვის და პირველი ტრიმესტრისთვის, მე-12 კვირის ჩათვლით. მე-13 კვირიდან გადადით Femibion 2-ზე: იქ დოზაა 1 ტაბლეტი და 1 კაფსულა, და მიღება გრძელდება ლაქტაციის ბოლომდე.
            </p>
            <p className="max-w-[68ch] text-[16.5px] leading-relaxed text-ink-soft">
              დაგეგმვა ხშირად ტესტზე ორ ხაზამდე იწყება, რადგან ფოლატზე მოთხოვნა ორსულობის პირველ კვირებში იზრდება. რამდენი კვირით ადრე დაიწყოთ კონკრეტულად თქვენ, ექიმი გეტყვით. საჭმელთან ერთად მიღება და შეფუთვის ხანგრძლივობა დღეებში ფურცელში {PLACEHOLDER}.
            </p>
          </>
        )}
        <p className="max-w-[68ch] text-[16.5px] leading-relaxed text-ink-soft">
          კვირის დასათვლელად გამოიყენეთ მთავარ გვერდზე არსებული კალკულატორი. 12 კვირის ჩათვლით რჩებით Femibion 1-ზე, მე-13 კვირიდან იწყება Femibion 2. გადასვლის დღეს ორივე კოლოფის ერთად მიღება საიტის მასალებში არ წერია — ამთავრებთ ერთ ეტაპს და იწყებთ მომდევნოს. თუ ერთი დღე გამოგრჩათ, ფურცლის მითითება ამ შემთხვევაზე {PLACEHOLDER}; მიღება შეუთანხმეთ ექიმს.
        </p>
        <p className="max-w-[68ch] text-[16.5px] leading-relaxed text-ink-soft">
          შეკვეთამდე გადაამოწმეთ, რომ სწორ კოლოფს ირჩევთ: დაგეგმვა და პირველი ტრიმესტრი არის Femibion 1 (100 ₾), მეორე ტრიმესტრიდან ლაქტაციის ბოლომდე — Femibion 2 (140 ₾). კურიერის მოსვლისას შეხედეთ დასახელებას და ვარგისიანობის ვადას. დაზიანებული ან ვადაგასული შეფუთვა არ მიიღოთ. შენახვის ზუსტი პირობები ფურცელში {PLACEHOLDER}.
        </p>
      </section>

      <section className="grid gap-3" aria-labelledby="caution-title">
        <h2 id="caution-title" className="text-[1.6rem] font-bold tracking-[-0.01em]">
          სიფრთხილის ზომები
        </h2>
        <p className="max-w-[68ch] text-[16.5px] leading-relaxed text-ink-soft">
          მიღება შეუთანხმეთ ექიმს. ფურცლის გაფრთხილებები — უკუჩვენებები, ურთიერთქმედება სხვა პრეპარატებთან და რა გააკეთოთ, თუ დოზა გამოგრჩათ — აქ {PLACEHOLDER}, სანამ ოფიციალური ფურცლის ტექსტი არ დაემატება.
        </p>
        <p className="max-w-[68ch] text-[16.5px] leading-relaxed text-ink-soft">
          საკვები დანამატი არ ცვლის მრავალფეროვან კვებას და ექიმის დანიშნულ მკურნალობას. რკინას ფემიბიონი არ შეიცავს, ამიტომ ანემიის ან რკინის დეფიციტის საკითხი ცალკე განიხილეთ. თუ შეფუთვა დაზიანებულია ან ვარგისიანობის ვადა ამოწურულია, პროდუქტი არ მიიღოთ და მოგვწერეთ.
        </p>
      </section>

      <section className="grid gap-3" aria-labelledby="delivery-title">
        <h2 id="delivery-title" className="text-[1.6rem] font-bold tracking-[-0.01em]">
          მიწოდება და გადახდა
        </h2>
        <p className="max-w-[68ch] text-[16.5px] leading-relaxed text-ink-soft">
          თბილისში მიწოდება უფასოა და 1–3 სამუშაო დღეს გრძელდება. რეგიონებში მიწოდება 15 ₾ ღირს და 3–7 დღე სჭირდება. გადახდა ხდება მიწოდებისას. კურიერის მოსვლისას შეამოწმეთ შეფუთვა და პროდუქტის მდგომარეობა.
        </p>
        <p className="max-w-[68ch] text-[16.5px] leading-relaxed text-ink-soft">
          დაბრუნებისა და შეცვლის პირობები წერია გვერდზე{' '}
          <Link href="/terms" className="font-semibold text-primary underline underline-offset-2">
            წესები და პირობები
          </Link>
          . მოკლედ: თბილისში შეცვლა უფასოა. კურიერის წასვლის შემდეგ დაბრუნების სერვისი ფასიანია — თბილისი 6 ₾, რეგიონი 15 ₾.
        </p>
        <p className="max-w-[68ch] text-[16.5px] leading-relaxed text-ink-soft">
          შეკვეთა ივსება საიტზე: ირჩევთ კოლოფს, რაოდენობას, სახელს, ტელეფონს და მისამართს. ოპერატორი ან კურიერი დაგიკავშირდებათ მიწოდებამდე. თუ ქალაქი თბილისია, საკურიერო საფასური არ ემატება. სხვა ქალაქსა და სოფელში ემატება 15 ₾. გადახდამდე შეგიძლიათ უარი თქვათ დაზიანებულ შეფუთვაზე — ამიტომ გახსენით და დაათვალიერეთ კოლოფი კურიერის თანდასწრებით. ქვითარი ან შეკვეთის დადასტურება შეინახეთ, თუ მოგვიანებით შეცვლა დაგჭირდებათ.
        </p>
      </section>

      <section className="grid gap-3" aria-labelledby="product-faq-title">
        <h2 id="product-faq-title" className="text-[1.6rem] font-bold tracking-[-0.01em]">
          ხშირი კითხვები
        </h2>
        <FaqAccordion items={FAQ[slug]} headingLevel="h3" />
      </section>
    </div>
  )
}
