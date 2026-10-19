export const LEGAL_ENTITY = {
  displayName: 'ი/მ შოთა ჩხვირკია (Individual Entrepreneur Shota Chkhvirkia)',
  legalName: 'Individual Entrepreneur Shota Chkhvirkia',
  taxId: '62004025572',
  address:
    'საქართველო, ქ. თბილისი, დიდგორის რაიონი, დ. წყნეთი, ზონა „გ“, კორ. 3, სართ. 2, 01101',
  email: 'info@femibion.ge',
  facebook: 'https://www.facebook.com/femibion.ge',
} as const

export const FOOTER_LEGAL_LINE = `© 2026 Femibion.ge — ${LEGAL_ENTITY.displayName}, ს/ნ ${LEGAL_ENTITY.taxId}. მისამართი: ${LEGAL_ENTITY.address}.`
