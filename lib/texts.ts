import { readFile, writeFile } from 'fs/promises'
import { join } from 'path'
import { unstable_noStore } from 'next/cache'

export type SiteTexts = {
  header: { brand: string; logoLetter: string; navHome: string; navProducts: string; navBlog: string; navOrder: string }
  hero: {
    badge: string
    title: string
    description: string
    ctaOrder: string
    ctaMore: string
  }
  products: {
    sectionTitle: string
    sectionSubtitle: string
    ctaOrder: string
    items: Array<{
      name: string
      price?: number
      subtitle: string
      description: string
      features: string[]
    }>
  }
  pregnancy: {
    title: string
    subtitle: string
    labelStart: string
    labelEnd: string
    recommendedLabel: string
    product1Label: string
    product1Subtitle: string
    product2Label: string
    product2Subtitle: string
    stages: Array<{ week: number; label: string; product: 1 | 2 }>
  }
  order: {
    title: string
    subtitle: string
    shippingInfo?: string
    nameLabel: string
    namePlaceholder: string
    phoneLabel: string
    phonePlaceholder: string
    addressLabel: string
    addressPlaceholder: string
    productLabel: string
    product1Option: string
    product2Option: string
    quantityUnit: string
    productHint: string
    submitButton: string
    termsNote: string
    successTitle: string
    successMessage: string
    newOrderButton: string
  }
  footer: {
    brand: string
    logoLetter: string
    description: string
    contactTitle: string
    address: string
    phone: string
    email: string
    socialTitle: string
    certificatesTitle: string
    certificatesNote: string
    copyright: string
    privacyLinkLabel: string
    warningText?: string
    cookies: {
      title: string
      description: string
      accept: string
      decline: string
    }
  }
  blog: {
    title: string
    subtitle: string
    readMore: string
  }
  seoContent: {
    sectionAriaLabel: string
    column1Title: string
    column1Paragraph1: string
    column1Paragraph2: string
    column2Title: string
    column2Paragraph1: string
    column2Paragraph2: string
  }
}

const DEFAULT_TEXTS: SiteTexts = {
  header: { brand: 'Femibion', logoLetter: 'F', navHome: 'მთავარი გვერდი', navProducts: 'პროდუქცია', navBlog: 'ბლოგი', navOrder: 'შეკვეთა' },
  hero: {
    badge: '#1 ევროპაში',
    title: 'ზრუნვა პირველი დღიდან',
    description:
      'Femibion - პრემიუმ ვიტამინები ორსულობის დაგეგმვის, ორსულობის და ლაქტაციის პერიოდისთვის. ოპტიმალური ფორმა მათთვის, ვისაც სურს ფოლატების მაქსიმალური ათვისება.',
    ctaOrder: 'შეკვეთა',
    ctaMore: 'გაიგე მეტი',
  },
  products: {
    sectionTitle: 'აირჩიე შენთვის სწორი პროდუქტი',
    sectionSubtitle: 'ორსულობის თითოეული ეტაპისთვის სპეციალურად შემუშავებული ფორმულა',
    ctaOrder: 'შეკვეთა',
    items: [
      {
        name: 'Femibion 1',
        price: 100,
        subtitle: 'დაგეგმვა & I ტრიმესტრი',
        description:
          'ოპტიმალური ფორმულა ორსულობის დაგეგმვისა და პირველი ტრიმესტრისთვის. შეიცავს Metafolin®-ს — ოპტიმალური ფორმა მათთვის, ვისაც სურს ფოლატების მაქსიმალური ათვისება.',
        features: ['Metafolin®', 'ფოლატი 800მკგ'],
      },
      {
        name: 'Femibion 2',
        price: 140,
        subtitle: 'II-III ტრიმესტრი & ლაქტაცია',
        description:
          'გაფართოებული ფორმულა მეორე და მესამე ტრიმესტრისთვის. DHA ომეგა-3 ბავშვის ტვინის განვითარებისთვის.',
        features: ['DHA Omega-3', '200მგ DHA'],
      },
    ],
  },
  pregnancy: {
    title: 'გამოთვალე',
    subtitle: 'აირჩიე შენი ეტაპი და გაიგე რომელი პროდუქტია შენთვის',
    labelStart: 'დაგეგმვა',
    labelEnd: 'ლაქტაცია',
    recommendedLabel: 'შენთვის რეკომენდებულია:',
    product1Label: 'Femibion 1',
    product1Subtitle: 'დაგეგმვა & I ტრიმესტრი',
    product2Label: 'Femibion 2',
    product2Subtitle: 'II-III & ლაქტაცია',
    stages: [
      { week: 0, label: 'დაგეგმვა', product: 1 },
      { week: 4, label: '4 კვირა', product: 1 },
      { week: 8, label: '8 კვირა', product: 1 },
      { week: 12, label: '12 კვირა', product: 1 },
      { week: 13, label: '13 კვირა', product: 2 },
      { week: 20, label: '20 კვირა', product: 2 },
      { week: 28, label: '28 კვირა', product: 2 },
      { week: 36, label: '36 კვირა', product: 2 },
      { week: 40, label: 'მშობიარობა', product: 2 },
      { week: 44, label: 'ლაქტაცია', product: 2 },
    ],
  },
  order: {
    title: 'შეუკვეთე ახლავე',
    subtitle: 'შეავსე ფორმა და მიიღე პროდუქტი პირდაპირ სახლში',
    shippingInfo: 'მიწოდება 1-3 დღეში | თბილისში უფასო | რეგიონებში 10 ლარი | მთელი საქართველო',
    nameLabel: 'სახელი და გვარი',
    namePlaceholder: 'მარიამ ბერიძე',
    phoneLabel: 'ტელეფონის ნომერი',
    phonePlaceholder: '5XX XXX XXX',
    addressLabel: 'მიწოდების მისამართი',
    addressPlaceholder: 'თბილისი, ჭავჭავაძის გამზ. 12',
    productLabel: 'აირჩიე პროდუქტი',
    product1Option: 'Femibion 1 - დაგეგმვა & I ტრიმესტრი',
    product2Option: 'Femibion 2 - II-III ტრიმესტრი & ლაქტაცია',
    quantityUnit: 'ცალი',
    productHint: 'მინიმუმ ერთი პროდუქტი უნდა აირჩიო',
    submitButton: 'შეკვეთის დადასტურება',
    termsNote: 'შეკვეთის გაფორმებით თქვენ ეთანხმებით ჩვენს პირობებს',
    successTitle: 'მადლობა შეკვეთისთვის!',
    successMessage:
      'თქვენი შეკვეთა მიღებულია. ჩვენი ოპერატორი დაგიკავშირდებათ უახლოეს დროში.',
    newOrderButton: 'ახალი შეკვეთა',
  },
  footer: {
    brand: 'Femibion',
    logoLetter: 'F',
    description:
      '#1 პრენატალური ვიტამინი ევროპაში. ზრუნვა დედისა და ბავშვის ჯანმრთელობაზე. ოპტიმალური ფორმა მათთვის, ვისაც სურს ფოლატების მაქსიმალური ათვისება.',
    contactTitle: 'კონტაქტი',
    address: 'თბილისი, საქართველო',
    phone: '+995 595 94 74 50',
    email: 'info@femibion.ge',
    socialTitle: 'სოციალური',
    certificatesTitle: 'სერტიფიკატები',
    certificatesNote: 'სამედიცინო სერტიფიცირებული პროდუქტი',
    copyright: '© 2026 Femibion Georgia. ყველა უფლება დაცულია.',
    privacyLinkLabel: 'კონფიდენციალურობის პოლიტიკა',
    warningText: 'საკვები დანამატი არ ანაცვლებს ბალანსირებულ კვებას. გამოყენებამდე გაიარეთ კონსულტაცია მკურნალ ექიმთან.',
    cookies: {
      title: 'ქუქი-ფაილების გამოყენება',
      description: 'ჩვენ ვიყენებთ ქუქი-ფაილებს საიტის მუშაობის გასაუმჯობესებლად და თქვენი გამოცდილების პერსონალიზაციისთვის.',
      accept: 'დათანხმება',
      decline: 'უარყოფა',
    },
  },
  blog: {
    title: 'ბლოგი',
    subtitle: 'სასარგებლო სტატიები ორსულობისა და ვიტამინების შესახებ',
    readMore: 'წაიკითხე მეტი',
  },
  seoContent: {
    sectionAriaLabel: 'Femibion-ის შესახებ დეტალური ინფორმაცია',
    column1Title: 'რატომ Femibion — #1 პრენატალური ვიტამინი ევროპაში?',
    column1Paragraph1:
      'Femibion არის ევროპის ყველაზე პოპულარული პრენატალური ვიტამინი, რომელსაც ენდობა მილიონობით ორსული ქალი მთელ მსოფლიოში. საქართველოში Femibion ხელმისაწვდომია ოფიციალურ დისტრიბუტორთან — femibion.ge.',
    column1Paragraph2:
      'ორსულობის ვიტამინების არჩევისას მნიშვნელოვანია ფოლატის ფორმა. Femibion-ში გამოყენებულია Metafolin® — ოპტიმალური ფორმა მათთვის, ვისაც სურს ფოლატების მაქსიმალური ათვისება.',
    column2Title: 'ორსულობის ვიტამინები — როდის დავიწყოთ მიღება?',
    column2Paragraph1:
      'ექიმები რეკომენდაციას იძლევიან პრენატალური ვიტამინების მიღება ორსულობის დაგეგმვის ეტაპიდან დაიწყოთ, მინიმუმ 4 კვირით ადრე. ფოლიუმის მჟავა აუცილებელია ნერვული მილის სწორი განვითარებისთვის ორსულობის პირველ კვირებში.',
    column2Paragraph2:
      'Femibion 1 შეიცავს ფოლატს 800მკგ და განკუთვნილია ორსულობის დაგეგმვისა და პირველი ტრიმესტრისთვის. მეორე ტრიმესტრიდან საჭიროა Femibion 2-ზე გადასვლა, რომელიც დამატებით შეიცავს DHA ომეგა-3 ცხიმოვან მჟავას 200მგ — აუცილებელ კომპონენტს ბავშვის ტვინის და თვალების განვითარებისთვის.',
  },
}

function getTextsPath() {
  const base = process.env.PWD || process.cwd()
  return join(base, 'data', 'site-texts.json')
}

export async function getSiteTexts(): Promise<SiteTexts> {
  unstable_noStore()
  try {
    const data = await readFile(getTextsPath(), 'utf-8')
    const parsed = JSON.parse(data) as Partial<SiteTexts>
    return deepMerge(DEFAULT_TEXTS, parsed)
  } catch {
    return DEFAULT_TEXTS
  }
}

export async function saveSiteTexts(texts: SiteTexts): Promise<void> {
  const { mkdir } = await import('fs/promises')
  const base = process.env.PWD || process.cwd()
  const dir = join(base, 'data')
  await mkdir(dir, { recursive: true })
  await writeFile(join(dir, 'site-texts.json'), JSON.stringify(texts, null, 2), 'utf-8')
}

function deepMerge<T extends object>(base: T, override: Partial<T>): T {
  const result = JSON.parse(JSON.stringify(base)) as T
  for (const key of Object.keys(override) as (keyof T)[]) {
    const val = override[key]
    if (val != null) {
      if (
        typeof val === 'object' &&
        !Array.isArray(val) &&
        typeof (base[key] as object) === 'object' &&
        !Array.isArray(base[key])
      ) {
        ;(result as Record<string, unknown>)[key as string] = deepMerge(
          base[key] as object,
          val as object
        )
      } else if (Array.isArray(val) && Array.isArray(base[key])) {
        const baseArr = base[key] as unknown[]
        const merged = val.map((item, i) =>
          typeof item === 'object' && item !== null && baseArr[i] && typeof baseArr[i] === 'object'
            ? deepMerge(baseArr[i] as object, item as object)
            : item
        )
        ;(result as Record<string, unknown>)[key as string] = merged
      } else {
        ;(result as Record<string, unknown>)[key as string] = val
      }
    }
  }
  return result
}
