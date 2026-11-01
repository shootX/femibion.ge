import { DELIVERY_FEE_REGION } from '@/lib/georgia-cities'

const STEPS = [
  {
    title: 'აირჩიე ეტაპი',
    text: 'კალკულატორი გაჩვენებს, რომელი ფორმულა გჭირდება ახლა.',
  },
  {
    title: 'შეუკვეთე ონლაინ',
    text: 'შეავსე ფორმა, ოპერატორი დაგირეკავს შეკვეთის დასადასტურებლად.',
  },
  {
    title: 'მიიღე სახლში',
    text: `თბილისში 1–3 სამუშაო დღეში უფასოდ, რეგიონებში 3–7 დღეში ${DELIVERY_FEE_REGION} ₾-ად. გადახდა მიწოდებისას.`,
  },
] as const

export function HowItWorks() {
  return (
    <section aria-label="როგორ შევუკვეთო" className="pb-4">
      <div className="wrap">
        <ol className="grid gap-3 md:grid-cols-3 md:gap-4">
          {STEPS.map((step, i) => (
            <li
              key={step.title}
              className="panel-flat grid grid-cols-[auto_1fr] content-start gap-x-3.5 gap-y-0.5 rounded-[18px] p-5"
            >
              <span
                className="row-span-2 grid h-[34px] w-[34px] place-items-center rounded-full bg-foreground text-[15px] font-extrabold text-white"
                aria-hidden
              >
                {i + 1}
              </span>
              <b className="text-[16.5px]">{step.title}</b>
              <span className="text-[14.5px] leading-normal text-muted-foreground">{step.text}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
