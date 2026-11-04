import Link from 'next/link'
import { extractToc, headingId, plainText, type TocItem } from '@/lib/blog-content'

function renderInline(text: string, keyPrefix: string): React.ReactNode[] {
  const tokens = text.split(/(\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*)/g).filter(Boolean)
  return tokens.map((token, i) => {
    const key = `${keyPrefix}-${i}`
    const linkMatch = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
    if (linkMatch) {
      const [, label, href] = linkMatch
      const isInternal = href.startsWith('/') || href.startsWith('#') || href.includes('femibion.ge')
      if (isInternal) {
        return (
          <Link key={key} href={href} className="font-medium text-primary underline underline-offset-2 hover:decoration-2">
            {label}
          </Link>
        )
      }
      return (
        <a key={key} href={href} target="_blank" rel="noopener noreferrer" className="font-medium text-primary underline underline-offset-2 hover:decoration-2">
          {label}
        </a>
      )
    }
    if (token.startsWith('**') && token.endsWith('**')) {
      return (
        <strong key={key} className="font-semibold text-foreground">
          {token.replace(/\*\*/g, '')}
        </strong>
      )
    }
    return <span key={key}>{token}</span>
  })
}

export function BlogMarkdown({ content }: { content: string }) {
  const lines = content.split('\n')
  const blocks: React.ReactNode[] = []
  let listBuffer: string[] = []
  let h2Count = 0

  const flushList = (key: string) => {
    if (listBuffer.length === 0) return
    const items = listBuffer
    listBuffer = []
    blocks.push(
      <ul key={key} className="mb-5 list-disc space-y-2 pl-6 text-[17.5px] text-ink-soft marker:text-primary">
        {items.map((item, i) => (
          <li key={i} className="pl-1 leading-[1.7]">
            {renderInline(item, `${key}-li-${i}`)}
          </li>
        ))}
      </ul>
    )
  }

  lines.forEach((line, i) => {
    const trimmed = line.trim()

    if (/^[-*]\s+/.test(trimmed)) {
      listBuffer.push(trimmed.replace(/^[-*]\s+/, ''))
      return
    }
    flushList(`ul-${i}`)

    if (!trimmed) return
    // A single-# heading repeats the page's own <h1>; the article title is rendered by the page.
    if (/^#(?!#)\s*/.test(trimmed)) return
    if (trimmed.startsWith('###')) {
      blocks.push(
        <h3 key={i} className="mb-3 mt-8 scroll-mt-24 text-[1.22rem] font-bold leading-snug text-foreground">
          {renderInline(trimmed.replace(/^###\s*/, ''), `h3-${i}`)}
        </h3>
      )
      return
    }
    if (trimmed.startsWith('##')) {
      h2Count += 1
      const text = plainText(trimmed.replace(/^##\s*/, ''))
      blocks.push(
        <h2 key={i} id={headingId(text, h2Count)} className="mb-4 mt-11 scroll-mt-24 text-[1.6rem] font-bold leading-snug tracking-[-0.01em] text-foreground">
          {renderInline(trimmed.replace(/^##\s*/, ''), `h2-${i}`)}
        </h2>
      )
      return
    }
    if (trimmed.startsWith('**') && trimmed.endsWith('**') && trimmed.indexOf('**', 2) === trimmed.length - 2) {
      blocks.push(
        <p key={i} className="mb-2 mt-6 text-[17.5px] font-bold text-foreground">
          {trimmed.replace(/\*\*/g, '')}
        </p>
      )
      return
    }
    blocks.push(
      <p key={i} className="mb-5 text-[17.5px] leading-[1.75] text-ink-soft">
        {renderInline(trimmed, `p-${i}`)}
      </p>
    )
  })

  flushList('ul-end')
  return <>{blocks}</>
}

export function BlogToc({ content, leading = [] }: { content: string; leading?: TocItem[] }) {
  const toc: TocItem[] = [...leading, ...extractToc(content)]
  if (toc.length < 3) return null

  return (
    <nav aria-label="სარჩევი" className="panel-flat mb-8 p-5 sm:p-6">
      <p className="mb-3 text-[12.5px] font-bold uppercase tracking-[0.07em] text-primary">სარჩევი</p>
      <ol className="grid list-decimal gap-2 pl-5 text-[15px] marker:text-muted-foreground">
        {toc.map((item) => (
          <li key={item.id}>
            <a href={`#${item.id}`} className="text-ink-soft underline-offset-2 hover:text-primary hover:underline">
              {item.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}
