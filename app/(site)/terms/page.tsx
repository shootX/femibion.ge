import type { Metadata } from 'next'
import { getSiteTexts } from '@/lib/texts'
import { getImagePaths } from '@/lib/images-server'
import { pageTitle } from '@/lib/seo'
import { Footer } from '@/components/femibion/footer'
import { LegalEntityNotice } from '@/components/femibion/legal-entity-notice'
import { SiteBreadcrumbs } from '@/components/femibion/site-breadcrumbs'
import { PageIntro } from '@/components/femibion/page-intro'
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
      <main className="pb-14 pt-6 md:pb-20 md:pt-8">
        <div className="wrap">
          <SiteBreadcrumbs items={[{ href: '/', label: 'მთავარი' }, { label: 'წესები და პირობები' }]} />
          <div className="mx-auto max-w-[760px]">
          <PageIntro title="წესები და პირობები" className="mb-6" />
          <LegalEntityNotice />
          <div className="panel-flat mt-4 p-6 sm:p-8 grid gap-4 leading-[1.75] text-ink-soft [&_a]:text-primary [&_a]:underline [&_h2]:mt-6 [&_h2]:text-[1.3rem] [&_h2]:font-bold [&_h2]:leading-snug [&_h2]:text-foreground [&_h3]:mt-4 [&_h3]:font-bold [&_h3]:text-foreground [&_li]:pl-1 [&_ul]:grid [&_ul]:list-disc [&_ul]:gap-1.5 [&_ul]:pl-6 [&_ol]:grid [&_ol]:list-decimal [&_ol]:gap-1.5 [&_ol]:pl-6">
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
        </div>
      </main>
      <Footer texts={texts.footer} images={images} />
    </div>
  )
}
