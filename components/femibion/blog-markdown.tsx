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
          <Link key={key} href={href} className="cursor-pointer text-primary hover:underline">
            {label}
          </Link>
        )
      }
      return (
        <a key={key} href={href} target="_blank" rel="noopener noreferrer" className="cursor-pointer text-primary hover:underline">
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
      <ul key={key} className="mb-4 list-disc space-y-2 pl-6 text-lg text-muted-foreground">
        {items.map((item, i) => (
          <li key={i} className="leading-relaxed">
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

    if (!trimmed) {
      blocks.push(<br key={i} />)
      return
    }
    if (trimmed.startsWith('###')) {
      blocks.push(
        <h3 key={i} className="mb-4 mt-8 scroll-mt-28 text-xl font-bold text-foreground">
          {renderInline(trimmed.replace(/^###\s*/, ''), `h3-${i}`)}
        </h3>
      )
      return
    }
    if (trimmed.startsWith('##')) {
      h2Count += 1
      const text = plainText(trimmed.replace(/^##\s*/, ''))
      blocks.push(
        <h2 key={i} id={headingId(text, h2Count)} className="mb-5 mt-10 scroll-mt-28 text-2xl font-bold text-foreground">
          {renderInline(trimmed.replace(/^##\s*/, ''), `h2-${i}`)}
        </h2>
      )
      return
    }
    if (trimmed.startsWith('**') && trimmed.endsWith('**') && trimmed.indexOf('**', 2) === trimmed.length - 2) {
      blocks.push(
        <p key={i} className="mb-2 mt-6 font-bold text-foreground">
          {trimmed.replace(/\*\*/g, '')}
        </p>
      )
      return
    }
    blocks.push(
      <p key={i} className="mb-4 text-lg leading-relaxed text-muted-foreground">
        {renderInline(trimmed, `p-${i}`)}
      </p>
    )
  })

  flushList('ul-end')
  return <>{blocks}</>
}

export function BlogToc({ content }: { content: string }) {
  const toc: TocItem[] = extractToc(content)
  if (toc.length < 3) return null

  return (
    <nav aria-label="სარჩევი" className="mb-8 rounded-2xl border border-border/70 bg-card p-5">
      <p className="mb-3 text-sm font-semibold text-foreground">სარჩევი</p>
      <ol className="space-y-2 text-sm">
        {toc.map((item) => (
          <li key={item.id}>
            <a href={`#${item.id}`} className="cursor-pointer text-muted-foreground hover:text-primary">
              {item.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}
