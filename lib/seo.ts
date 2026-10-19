const SUFFIX = ' | Femibion Georgia'
const MAX = 65

export function pageTitle(raw: string): { absolute: string } {
  const title = raw.replace(/\s+/g, ' ').trim()
  const full = /femibion/i.test(title) ? title : `${title}${SUFFIX}`
  if (full.length <= MAX) return { absolute: full }
  const sliced = full.slice(0, MAX)
  const boundary = sliced.lastIndexOf(' ')
  const trimmed = (boundary > 40 ? sliced.slice(0, boundary) : sliced).trim()
  return { absolute: trimmed }
}
