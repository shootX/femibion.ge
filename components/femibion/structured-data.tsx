export function StructuredData() {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Femibion Georgia',
    url: 'https://femibion.ge',
    logo: 'https://femibion.ge/images/logo.jpg',
    description: '#1 პრენატალური ვიტამინი ევროპაში. ორსულობის და ლაქტაციის ვიტამინები საქართველოში.',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'თბილისი',
      addressCountry: 'GE',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+995595947450',
      contactType: 'sales',
      availableLanguage: ['Georgian'],
    },
    sameAs: ['https://www.facebook.com/femibiongeorgia'],
  }

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Femibion Georgia',
    url: 'https://femibion.ge',
    inLanguage: 'ka',
    description: 'Femibion - პრენატალური ვიტამინები ორსულობის დაგეგმვის, ორსულობის და ლაქტაციის პერიოდისთვის.',
  }

  const product1Schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'Femibion 1',
    description:
      'ოპტიმალური ფორმულა ორსულობის დაგეგმვისა და პირველი ტრიმესტრისთვის. შეიცავს Metafolin® - ფოლიუმის მჟავას აქტიურ ფორმას, ფოლატი 800მკგ.',
    image: 'https://femibion.ge/images/femibion-1.jpg',
    brand: { '@type': 'Brand', name: 'Femibion' },
    category: 'პრენატალური ვიტამინები',
    offers: {
      '@type': 'Offer',
      url: 'https://femibion.ge/#order',
      availability: 'https://schema.org/InStock',
      price: 100,
      priceCurrency: 'GEL',
      seller: { '@type': 'Organization', name: 'Femibion Georgia' },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: {
          '@type': 'MonetaryAmount',
          value: 0,
          currency: 'GEL',
        },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: {
            '@type': 'QuantitativeValue',
            minValue: 0,
            maxValue: 1,
            unitCode: 'DAY',
          },
          transitTime: {
            '@type': 'QuantitativeValue',
            minValue: 1,
            maxValue: 3,
            unitCode: 'DAY',
          },
        },
        shippingDestination: {
          '@type': 'DefinedRegion',
          addressCountry: 'GE',
        },
      },
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
        merchantReturnDays: 3,
        returnMethod: 'https://schema.org/ReturnByMail',
        refundType: 'https://schema.org/FullRefund',
        customerService: {
          '@type': 'ContactPoint',
          telephone: '+995595947450',
          contactType: 'customer service',
        },
      },
    },
  }

  const product2Schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'Femibion 2',
    description:
      'გაფართოებული ფორმულა მეორე და მესამე ტრიმესტრისთვის და ლაქტაციის პერიოდისთვის. DHA ომეგა-3 200მგ ბავშვის ტვინის განვითარებისთვის.',
    image: 'https://femibion.ge/images/femibion-2.jpg',
    brand: { '@type': 'Brand', name: 'Femibion' },
    category: 'პრენატალური ვიტამინები',
    offers: {
      '@type': 'Offer',
      url: 'https://femibion.ge/#order',
      availability: 'https://schema.org/InStock',
      price: 140,
      priceCurrency: 'GEL',
      seller: { '@type': 'Organization', name: 'Femibion Georgia' },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: {
          '@type': 'MonetaryAmount',
          value: 0,
          currency: 'GEL',
        },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: {
            '@type': 'QuantitativeValue',
            minValue: 0,
            maxValue: 1,
            unitCode: 'DAY',
          },
          transitTime: {
            '@type': 'QuantitativeValue',
            minValue: 1,
            maxValue: 3,
            unitCode: 'DAY',
          },
        },
        shippingDestination: {
          '@type': 'DefinedRegion',
          addressCountry: 'GE',
        },
      },
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
        merchantReturnDays: 3,
        returnMethod: 'https://schema.org/ReturnByMail',
        refundType: 'https://schema.org/FullRefund',
        customerService: {
          '@type': 'ContactPoint',
          telephone: '+995595947450',
          contactType: 'customer service',
        },
      },
    },
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(product1Schema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(product2Schema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  )
}
