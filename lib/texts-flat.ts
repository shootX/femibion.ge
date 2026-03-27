import type { SiteTexts } from './texts'

export type FlatTextEntry = { key: string; value: string; label: string }

function getLabel(key: string): string {
  const stageMatch = key.match(/^pregnancy\.stages\.(\d+)\.(label|week|product)$/)
  if (stageMatch) {
    const field = stageMatch[2] === 'label' ? 'წარწერა' : stageMatch[2] === 'week' ? 'კვირა' : 'პროდუქტი'
    return `სლაიდერი - ეტაპი ${parseInt(stageMatch[1]) + 1} - ${field}`
  }
  const labels: Record<string, string> = {
    'header.brand': 'ლოგო ბრენდი',
    'header.logoLetter': 'ლოგო ასო',
    'header.navHome': 'მენიუ - მთავარი',
    'header.navProducts': 'მენიუ - პროდუქცია',
    'header.navBlog': 'მენიუ - ბლოგი',
    'header.navOrder': 'მენიუ - შეკვეთა',
    'hero.badge': 'Hero - ბეიჯი',
    'hero.title': 'Hero - სათაური',
    'hero.description': 'Hero - აღწერა',
    'hero.ctaOrder': 'Hero - ღილაკი შეკვეთა',
    'hero.ctaMore': 'Hero - ღილაკი მეტი',
    'products.sectionTitle': 'პროდუქტები - სათაური',
    'products.sectionSubtitle': 'პროდუქტები - ქვესათაური',
    'products.ctaOrder': 'პროდუქტები - ღილაკი',
    'products.items.0.name': 'პროდუქტი 1 - სახელი',
    'products.items.0.subtitle': 'პროდუქტი 1 - ქვესათაური',
    'products.items.0.description': 'პროდუქტი 1 - აღწერა',
    'products.items.0.features': 'პროდუქტი 1 - ფიჩერები (მძიმით გამოყოფილი)',
    'products.items.1.name': 'პროდუქტი 2 - სახელი',
    'products.items.1.subtitle': 'პროდუქტი 2 - ქვესათაური',
    'products.items.1.description': 'პროდუქტი 2 - აღწერა',
    'products.items.1.features': 'პროდუქტი 2 - ფიჩერები (მძიმით გამოყოფილი)',
    'pregnancy.title': 'სლაიდერი - სათაური',
    'pregnancy.subtitle': 'სლაიდერი - ქვესათაური',
    'pregnancy.labelStart': 'სლაიდერი - დასაწყისი',
    'pregnancy.labelEnd': 'სლაიდერი - დასასრული',
    'pregnancy.recommendedLabel': 'სლაიდერი - რეკომენდაცია',
    'pregnancy.product1Label': 'სლაიდერი - პროდუქტი 1',
    'pregnancy.product1Subtitle': 'სლაიდერი - პროდუქტი 1 ქვესათაური',
    'pregnancy.product2Label': 'სლაიდერი - პროდუქტი 2',
    'pregnancy.product2Subtitle': 'სლაიდერი - პროდუქტი 2 ქვესათაური',
    'order.title': 'ფორმა - სათაური',
    'order.subtitle': 'ფორმა - ქვესათაური',
    'order.nameLabel': 'ფორმა - სახელი ლეიბლი',
    'order.namePlaceholder': 'ფორმა - სახელი placeholder',
    'order.phoneLabel': 'ფორმა - ტელეფონი ლეიბლი',
    'order.phonePlaceholder': 'ფორმა - ტელეფონი placeholder',
    'order.addressLabel': 'ფორმა - მისამართი ლეიბლი',
    'order.addressPlaceholder': 'ფორმა - მისამართი placeholder',
    'order.productLabel': 'ფორმა - პროდუქტი ლეიბლი',
    'order.product1Option': 'ფორმა - ოფცია 1',
    'order.product2Option': 'ფორმა - ოფცია 2',
    'order.quantityUnit': 'ფორმა - ცალი',
    'order.productHint': 'ფორმა - მინიმუმ ერთი პროდუქტი',
    'order.submitButton': 'ფორმა - გაგზავნა',
    'order.termsNote': 'ფორმა - პირობები',
    'order.successTitle': 'ფორმა - წარმატების სათაური',
    'order.successMessage': 'ფორმა - წარმატების ტექსტი',
    'order.newOrderButton': 'ფორმა - ახალი შეკვეთა',
    'blog.title': 'ბლოგი - სათაური',
    'blog.subtitle': 'ბლოგი - ქვესათაური',
    'blog.readMore': 'ბლოგი - წაიკითხე მეტი',
    'footer.brand': 'Footer - ბრენდი',
    'footer.logoLetter': 'Footer - ლოგო ასო',
    'footer.description': 'Footer - აღწერა',
    'footer.contactTitle': 'Footer - კონტაქტი სათაური',
    'footer.address': 'Footer - მისამართი',
    'footer.phone': 'Footer - ტელეფონი',
    'footer.email': 'Footer - ელფოსტა',
    'footer.socialTitle': 'Footer - სოციალური სათაური',
    'footer.certificatesTitle': 'Footer - სერტიფიკატები სათაური',
    'footer.certificatesNote': 'Footer - სერტიფიკატების ტექსტი',
    'footer.copyright': 'Footer - საავტორო უფლებები',
    'footer.privacyLinkLabel': 'Footer - კონფიდენციალურობის ბმული',
    'footer.warningText': 'Footer - გაფრთხილების ტექსტი',
    'footer.cookies.title': 'Cookies - სათაური',
    'footer.cookies.description': 'Cookies - აღწერა',
    'footer.cookies.accept': 'Cookies - ღილაკი დათანხმება',
    'footer.cookies.decline': 'Cookies - ღილაკი უარყოფა',
    'seoContent.sectionAriaLabel': 'SEO ბლოკი - სექციის aria-label (ხელმისაწვდომობა)',
    'seoContent.column1Title': 'SEO ბლოკი - მარცხენა სვეტი - სათაური',
    'seoContent.column1Paragraph1': 'SEO ბლოკი - მარცხენა - პარაგრაფი 1',
    'seoContent.column1Paragraph2': 'SEO ბლოკი - მარცხენა - პარაგრაფი 2',
    'seoContent.column2Title': 'SEO ბლოკი - მარჯვენა სვეტი - სათაური',
    'seoContent.column2Paragraph1': 'SEO ბლოკი - მარჯვენა - პარაგრაფი 1',
    'seoContent.column2Paragraph2': 'SEO ბლოკი - მარჯვენა - პარაგრაფი 2',
  }
  return labels[key] || key
}

export function flattenTexts(texts: SiteTexts): FlatTextEntry[] {
  const entries: FlatTextEntry[] = []

  function add(path: string, value: unknown) {
    if (typeof value === 'string') {
      entries.push({ key: path, value, label: getLabel(path) })
    } else if (typeof value === 'number') {
      entries.push({ key: path, value: String(value), label: getLabel(path) })
    } else if (Array.isArray(value)) {
      value.forEach((item, i) => {
        if (typeof item === 'object' && item !== null) {
          Object.entries(item).forEach(([k, v]) =>
            add(`${path}.${i}.${k}`, v)
          )
        }
      })
    } else if (typeof value === 'object' && value !== null) {
      Object.entries(value).forEach(([k, v]) => add(`${path}.${k}`, v))
    }
  }

  Object.entries(texts).forEach(([section, data]) => {
    if (typeof data === 'object' && data !== null) {
      Object.entries(data).forEach(([k, v]) => add(`${section}.${k}`, v))
    }
  })

  return entries.sort((a, b) => a.label.localeCompare(b.label))
}

function setByPath(obj: Record<string, unknown>, path: string[], value: unknown) {
  let current: unknown = obj
  for (let i = 0; i < path.length - 1; i++) {
    const part = path[i]
    const nextPart = path[i + 1]
    const isNextNum = /^\d+$/.test(nextPart)

    const cur = current as Record<string, unknown>
    if (!(part in cur)) cur[part] = isNextNum ? [] : {}

    if (isNextNum) {
      const arr = cur[part] as unknown[]
      const idx = parseInt(nextPart, 10)
      if (!arr[idx]) arr[idx] = {}
      current = arr[idx]
      i += 2
    } else {
      current = cur[part]
    }
  }
  const last = path[path.length - 1]
  let parsed: unknown = value
  if (last === 'features' && typeof value === 'string') {
    parsed = value.split(',').map((s) => s.trim()).filter(Boolean)
  } else if ((last === 'week' || last === 'product') && typeof value === 'string') {
    parsed = parseInt(value, 10) || (last === 'product' ? 1 : 0)
  }
  ;(current as Record<string, unknown>)[last] = parsed
}

export function unflattenToTexts(entries: FlatTextEntry[]): SiteTexts {
  const result: Record<string, unknown> = {}
  for (const { key, value } of entries) {
    setByPath(result, key.split('.'), value)
  }
  return result as unknown as SiteTexts
}
