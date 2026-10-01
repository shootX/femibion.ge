export type TocItem = {
  id: string
  text: string
}

export type ArticleFaq = {
  question: string
  answer: string
}

export function plainText(value: string): string {
  return value
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\*\*/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

export function headingId(text: string, index: number): string {
  const slug = plainText(text)
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 48)
  return `s${index}-${slug || 'section'}`
}

export function extractToc(content: string): TocItem[] {
  const items: TocItem[] = []
  for (const line of content.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed.startsWith('##') || trimmed.startsWith('###')) continue
    const text = plainText(trimmed.replace(/^##\s*/, ''))
    if (!text) continue
    items.push({ id: headingId(text, items.length + 1), text })
  }
  return items
}

const FAQ_HEADING = /ხშირ|კითხვ|faq/i

export function extractArticleFaq(content: string): ArticleFaq[] {
  const items: ArticleFaq[] = []
  let inFaq = false
  let question = ''
  let answer: string[] = []

  const flush = () => {
    const text = plainText(answer.join(' '))
    if (question && text) items.push({ question, answer: text })
    question = ''
    answer = []
  }

  for (const line of content.split('\n')) {
    const trimmed = line.trim()
    if (/^##\s+/.test(trimmed) && !trimmed.startsWith('###')) {
      flush()
      inFaq = FAQ_HEADING.test(plainText(trimmed.replace(/^##\s*/, '')))
      continue
    }
    if (!inFaq) continue
    if (trimmed.startsWith('###')) {
      flush()
      question = plainText(trimmed.replace(/^###\s*/, ''))
      continue
    }
    if (question && trimmed) answer.push(trimmed)
  }

  flush()
  return items
}
