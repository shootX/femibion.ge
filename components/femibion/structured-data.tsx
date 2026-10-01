import { getActiveProducts } from '@/lib/products'
import { pageSlugForProduct, productJsonLd } from '@/lib/product-pages'

export async function StructuredData() {
  const products = await getActiveProducts()
  const productSchemas = products.flatMap((product, index) => {
    const slug = pageSlugForProduct(product, index)
    return slug ? [productJsonLd(product, slug)] : []
  })

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': 'https://femibion.ge/#organization',
    name: 'Femibion Georgia',
    alternateName: ['ფემიბიონი საქართველო', 'Femibion საქართველო'],
    url: 'https://femibion.ge',
    logo: {
      '@type': 'ImageObject',
      url: 'https://femibion.ge/images/logo.webp',
      width: 600,
      height: 60,
    },
    image: 'https://femibion.ge/images/hero-pregnant-woman.webp',
    description: '#1 პრენატალური ვიტამინი ევროპაში. ორსულობის და ლაქტაციის ვიტამინები საქართველოში.',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'თბილისი',
      addressRegion: 'თბილისი',
      addressCountry: 'GE',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+995595947450',
      email: 'info@femibion.ge',
      contactType: 'sales',
      areaServed: 'GE',
      availableLanguage: ['Georgian', 'English'],
    },
    sameAs: [
      'https://www.facebook.com/femibiongeorgia',
      'https://www.instagram.com/femibiongeorgia',
    ],
  }

  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'Store',
    '@id': 'https://femibion.ge/#store',
    name: 'Femibion Georgia',
    url: 'https://femibion.ge',
    image: 'https://femibion.ge/images/logo.webp',
    telephone: '+995595947450',
    email: 'info@femibion.ge',
    priceRange: '₾100–₾140',
    currenciesAccepted: 'GEL',
    paymentAccepted: 'Cash, Credit Card',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'თბილისი',
      addressCountry: 'GE',
    },
    areaServed: { '@type': 'Country', name: 'Georgia' },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '10:00',
        closes: '19:00',
      },
    ],
  }

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': 'https://femibion.ge/#website',
    name: 'Femibion Georgia',
    url: 'https://femibion.ge',
    inLanguage: 'ka-GE',
    description: 'Femibion - პრენატალური ვიტამინები ორსულობის დაგეგმვის, ორსულობის და ლაქტაციის პერიოდისთვის.',
    publisher: { '@id': 'https://femibion.ge/#organization' },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://femibion.ge/blog?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'მთავარი', item: 'https://femibion.ge' },
    ],
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'რა არის Femibion და რისთვის გამოიყენება?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Femibion არის #1 პრენატალური ვიტამინი ევროპაში, რომელიც სპეციალურად შემუშავებულია ორსულობის დაგეგმვის, ორსულობის და ლაქტაციის პერიოდისთვის. შეიცავს Metafolin® - ფოლიუმის მჟავას აქტიურ ფორმას, რომელსაც ორგანიზმი პირდაპირ ითვისებს.',
        },
      },
      {
        '@type': 'Question',
        name: 'რა განსხვავებაა Femibion 1 და Femibion 2 შორის?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Femibion 1 განკუთვნილია ორსულობის დაგეგმვისა და პირველი ტრიმესტრისთვის (1-12 კვირა), შეიცავს ფოლატს 800მკგ. Femibion 2 განკუთვნილია მეორე-მესამე ტრიმესტრისთვის და ლაქტაციის პერიოდისთვის (13+ კვირა), დამატებით შეიცავს DHA ომეგა-3 200მგ ბავშვის ტვინის განვითარებისთვის.',
        },
      },
      {
        '@type': 'Question',
        name: 'რა არის Metafolin® და რატომ არის მნიშვნელოვანი?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Metafolin® არის ფოლიუმის მჟავას ბიოაქტიური ფორმა (L-მეთილფოლატი). ჩვეულებრივი ფოლიუმის მჟავისგან განსხვავებით, Metafolin® პირდაპირ ითვისება ორგანიზმის მიერ, რაც განსაკუთრებით მნიშვნელოვანია ორსულობის პერიოდში ნერვული მილის სწორი განვითარებისთვის.',
        },
      },
      {
        '@type': 'Question',
        name: 'როგორ შევუკვეთო Femibion საქართველოში?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Femibion-ის შეკვეთა საქართველოში შესაძლებელია femibion.ge ვებსაიტზე შეკვეთის ფორმის შევსებით. პროდუქტი მიიტანება პირდაპირ სახლში. დარეკეთ: +995 595 94 74 50.',
        },
      },
      {
        '@type': 'Question',
        name: 'როდის უნდა დავიწყო Femibion-ის მიღება?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Femibion 1-ის მიღება რეკომენდებულია ორსულობის დაგეგმვის ეტაპიდან (მინიმუმ 4 კვირით ადრე) და გაგრძელდეს პირველი ტრიმესტრის ბოლომდე. მე-13 კვირიდან გადაერთეთ Femibion 2-ზე, რომელიც ლაქტაციის პერიოდშიც გამოიყენება.',
        },
      },
      {
        '@type': 'Question',
        name: 'რატომ არის DHA ომეგა-3 მნიშვნელოვანი ორსულობის დროს?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'DHA (დოკოზაჰექსაენის მჟავა) არის ომეგა-3 ცხიმოვანი მჟავა, რომელიც აუცილებელია ნაყოფის ტვინის და თვალების ნორმალური განვითარებისთვის. Femibion 2 შეიცავს 200მგ DHA-ს, რაც რეკომენდებული დღიური დოზაა ორსულებისთვის.',
        },
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {productSchemas.map((schema) => (
        <script
          key={schema['@id']}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  )
}
