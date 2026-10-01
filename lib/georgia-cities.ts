/** საქართველოს ქალაქები / დასახლებები — შეკვეთის autocomplete-ისთვის */
export const GEORGIA_CITIES = [
  'თბილისი',
  'ბათუმი',
  'ქუთაისი',
  'რუსთავი',
  'გორი',
  'ზუგდიდი',
  'ფოთი',
  'ხაშური',
  'სამტრედია',
  'სენაკი',
  'ზესტაფონი',
  'მარნეული',
  'თელავი',
  'ახალციხე',
  'ქობულეთი',
  'ოზურგეთი',
  'კასპი',
  'გარდაბანი',
  'ბოლნისი',
  'საჩხერე',
  'ტყიბული',
  'ჭიათურა',
  'ხონი',
  'ლანჩხუთი',
  'წყალტუბო',
  'ბორჯომი',
  'ახალქალაქი',
  'ცაგერი',
  'ამბროლაური',
  'ონი',
  'მესტია',
  'აბაშა',
  'მარტვილი',
  'წალენჯიხა',
  'ხობი',
  'ჩხოროწყუ',
  'ნინოწმინდა',
  'დმანისი',
  'თეთრიწყარო',
  'წალკა',
  'ასპინძა',
  'ადიგენი',
  'ხულო',
  'შუახევი',
  'ქედა',
  'ვანი',
  'ბაღდათი',
  'თერჯოლა',
  'საგარეჯო',
  'გურჯაანი',
  'ლაგოდეხი',
  'ყვარელი',
  'დედოფლისწყარო',
  'სიღნაღი',
  'ახმეტა',
  'ქარელი',
  'ხარაგაული',
  'ჩოხატაური',
  'ლენტეხი',
  'დუშეთი',
  'მცხეთა',
  'თიანეთი',
  'ყაზბეგი',
  'სტეფანწმინდა',
  'ჯვარი',
  'ჩაქვი',
  'გონიო',
] as const

const LATIN_ALIASES: Record<string, string> = {
  tbilisi: 'თბილისი',
  batumi: 'ბათუმი',
  kutaisi: 'ქუთაისი',
  rustavi: 'რუსთავი',
  gori: 'გორი',
  zugdidi: 'ზუგდიდი',
  poti: 'ფოთი',
  telavi: 'თელავი',
  kobuleti: 'ქობულეთი',
  marneuli: 'მარნეული',
  mtskheta: 'მცხეთა',
}

export const DELIVERY_FEE_REGION = 15
export const DELIVERY_FEE_TBILISI = 0

export function isTbilisi(city: string): boolean {
  const n = city.trim().toLowerCase()
  return n === 'თბილისი' || n === 'tbilisi' || n.startsWith('თბილის')
}

export function getDeliveryFee(city: string): number {
  if (!city.trim()) return DELIVERY_FEE_REGION
  return isTbilisi(city) ? DELIVERY_FEE_TBILISI : DELIVERY_FEE_REGION
}

export function searchCities(query: string, limit = 8): string[] {
  const q = query.trim().toLowerCase()
  if (q.length < 3) return []

  const results: string[] = []
  const aliasHit = LATIN_ALIASES[q]
  if (aliasHit) results.push(aliasHit)

  for (const city of GEORGIA_CITIES) {
    if (city.toLowerCase().includes(q) && !results.includes(city)) {
      results.push(city)
      if (results.length >= limit) break
    }
  }

  if (results.length < limit) {
    for (const [latin, geo] of Object.entries(LATIN_ALIASES)) {
      if (latin.includes(q) && !results.includes(geo)) {
        results.push(geo)
        if (results.length >= limit) break
      }
    }
  }

  return results
}
