import type { Metadata } from 'next'
import { getSiteTexts } from '@/lib/texts'
import { getImagePaths } from '@/lib/images-server'
import { pageTitle } from '@/lib/seo'
import { Header } from '@/components/femibion/header'
import { Footer } from '@/components/femibion/footer'
import { LegalEntityNotice } from '@/components/femibion/legal-entity-notice'
import { LEGAL_ENTITY } from '@/lib/legal'

export const revalidate = 86400

const CANONICAL = 'https://femibion.ge/terms'
const DESCRIPTION =
  'Femibion Georgia-ს წესები და პირობები: მიწოდება, დაბრუნება და გადახდა საქართველოში.'

export const metadata: Metadata = {
  title: pageTitle('წესები და პირობები'),
  description: DESCRIPTION,
  alternates: {
    canonical: CANONICAL,
    languages: { ka: CANONICAL, 'x-default': CANONICAL },
  },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'წესები და პირობები | Femibion Georgia',
    description: DESCRIPTION,
    url: CANONICAL,
    type: 'website',
    locale: 'ka_GE',
    siteName: 'Femibion Georgia',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'წესები და პირობები | Femibion Georgia',
    description: DESCRIPTION,
  },
}

export default async function TermsPage() {
  const [texts, images] = await Promise.all([getSiteTexts(), getImagePaths()])

  return (
    <div className="min-h-screen">
      <Header texts={texts.header} images={images} />
      <main className="py-12 md:py-16">
        <div className="container mx-auto max-w-3xl px-4 md:px-6">
          <h1 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">წესები და პირობები</h1>
          <LegalEntityNotice />
          <div className="mt-8 space-y-4 leading-relaxed [&_h2]:mb-3 [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-semibold [&_li]:text-muted-foreground [&_p]:text-muted-foreground [&_ul]:list-disc [&_ul]:pl-6">
            <p>
              ეს პირობები მოქმედებს femibion.ge-ზე გაფორმებულ შეკვეთებზე. შეკვეთის გაგზავნამდე საჭიროა
              თანხმობა ამ წესებზე და კონფიდენციალურობის პოლიტიკაზე.
            </p>

            <h2>მიწოდება</h2>
            <p>{texts.order.shippingInfo}</p>
            <p>
              მიწოდება ხდება საქართველოს მასშტაბით, ფორმაში მითითებულ მისამართზე. კურიერის მოსვლისას
              შეამოწმეთ შეფუთვა და პროდუქტის მდგომარეობა.
            </p>

            <h2>დაბრუნება</h2>
            <p>
              მოწოდებისას შეფუთვა შესაძლოა დაზიანებული იყოს, ამიტომ პროდუქტის მდგომარეობა გადაამოწმეთ
              კურიერის თანდასწრებით.
            </p>
            <p>
              თბილისში შეცვლა უფასოა. კურიერის წასვლის შემდეგ დაბრუნების სერვისი ფასიანია: თბილისი 6
              ლარი, რეგიონი 15 ლარი.
            </p>

            <h2>გადახდა</h2>
            <p>გადახდა ხდება მიწოდებისას, ნაღდი ანგარიშსწორებით ან საბანკო ბარათით.</p>

            <h2>კონტაქტი</h2>
            <ul>
              <li>ტელეფონი: {texts.footer.phone}</li>
              <li>ელფოსტა: {texts.footer.email}</li>
              <li>მისამართი: {LEGAL_ENTITY.address}</li>
              <li>სამუშაო საათები: ორშაბათი–შაბათი, 10:00–19:00</li>
            </ul>
          </div>
        </div>
      </main>
      <Footer texts={texts.footer} images={images} />
    </div>
  )
}
