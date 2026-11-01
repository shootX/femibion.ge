const MAX_TITLE = 60
const SUFFIX_LONG = ' | Femibion Georgia'
const SUFFIX_SHORT = ' | Femibion'
const BRAND_TAIL = /\s*\|\s*(?:Femibion(?:\s+Georgia)?|ფემიბიონი)\s*$/i
const DANGLING_WORD = /^(?:და|თუ|ან|რომ|რა|როგორ|რომელიც|ანდა|and|or|the|a|an)$/i
const TRAILING_SEPARATOR = /[\s|:;,.|—–-]+$/u

function normalizeTitle(raw: string): string {
  return raw.replace(/\s+/g, ' ').trim()
}

function stripBrandSuffix(title: string): string {
  let current = title
  let previous = ''
  while (current && current !== previous) {
    previous = current
    current = current.replace(BRAND_TAIL, '').trim()
  }
  return current
}

function shortenTitle(title: string, max: number): string {
  if (title.length <= max) return title

  const space = title.lastIndexOf(' ', max)
  let result = (space > 0 ? title.slice(0, space) : title.split(' ')[0] || title).trim()
  let droppedConjunction = false

  while (result) {
    const stripped = result.replace(TRAILING_SEPARATOR, '').trim()
    if (stripped !== result) {
      result = stripped
      continue
    }
    const parts = result.split(' ')
    const last = parts[parts.length - 1] ?? ''
    if (parts.length > 1 && DANGLING_WORD.test(last)) {
      parts.pop()
      result = parts.join(' ')
      droppedConjunction = true
      continue
    }
    break
  }

  // The length limit landed inside a clause. Close it at the previous "და"
  // or punctuation instead of leaving a half phrase.
  if (!droppedConjunction && title.startsWith(result) && result.length < title.trim().length) {
    const andAt = result.lastIndexOf(' და ')
    const cutAt = andAt >= 18
      ? andAt
      : Math.max(result.lastIndexOf(':'), result.lastIndexOf(','), result.lastIndexOf('—'), result.lastIndexOf('–'))
    if (cutAt >= 18) result = result.slice(0, cutAt).replace(TRAILING_SEPARATOR, '').trim()
  }

  return result || title.split(' ')[0] || title
}

// Brand is appended only when the whole title still fits. Otherwise the
// previous slice left a dangling "|" or stopped mid-phrase.
export function pageTitle(raw: string): { absolute: string } {
  const core = stripBrandSuffix(normalizeTitle(raw))
  if (!core) return { absolute: 'Femibion Georgia' }

  const hasBrand = /femibion/i.test(core)
  if (!hasBrand) {
    if (core.length + SUFFIX_LONG.length <= MAX_TITLE) return { absolute: `${core}${SUFFIX_LONG}` }
    if (core.length + SUFFIX_SHORT.length <= MAX_TITLE) return { absolute: `${core}${SUFFIX_SHORT}` }
  }

  if (core.length <= MAX_TITLE) return { absolute: core }
  return { absolute: shortenTitle(core, MAX_TITLE) }
}
