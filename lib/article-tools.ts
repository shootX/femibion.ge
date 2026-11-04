export const ARTICLE_TOOLS = {
  'ovulaciis-gamotvla': {
    id: 'ovulation-calculator',
    title: 'ოვულაციის კალკულატორი',
  },
  'orsulobis-vadis-gamotvla': {
    id: 'due-date-calculator',
    title: 'ორსულობის ვადის კალკულატორი',
  },
} as const

export type ArticleToolSlug = keyof typeof ARTICLE_TOOLS

export function articleTool(slug: string) {
  if (slug in ARTICLE_TOOLS) return ARTICLE_TOOLS[slug as ArticleToolSlug]
  return null
}
