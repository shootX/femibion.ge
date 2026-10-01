/**
 * საქართველოს სტანდარტული დრო = UTC+4 მთელი წლის განმავლობაში (DST არ გამოიყენება).
 * ფიქსირებული ოფსეტი — სერვერზე სადაც Intl timeZone არ მუშაობს ან tzdata არასრულია.
 */
const GEORGIA_OFFSET_MS = 4 * 60 * 60 * 1000

function pad2(n: number): string {
  return String(n).padStart(2, '0')
}

export function formatGeorgiaDateTime(
  iso: string,
  options: { withSeconds?: boolean; padDayMonth?: boolean } = {},
): string {
  const { withSeconds = true, padDayMonth = false } = options
  const ms = Date.parse(iso)
  if (Number.isNaN(ms)) return iso

  const d = new Date(ms + GEORGIA_OFFSET_MS)
  const day = padDayMonth ? pad2(d.getUTCDate()) : d.getUTCDate()
  const month = padDayMonth ? pad2(d.getUTCMonth() + 1) : d.getUTCMonth() + 1
  const year = d.getUTCFullYear()
  const h = pad2(d.getUTCHours())
  const min = pad2(d.getUTCMinutes())
  const datePart = `${day}.${month}.${year}`
  if (!withSeconds) {
    return `${datePart}, ${h}:${min}`
  }
  const s = pad2(d.getUTCSeconds())
  return `${datePart}, ${h}:${min}:${s}`
}

export function formatGeorgiaDate(iso: string, padDayMonth = false): string {
  const ms = Date.parse(iso)
  if (Number.isNaN(ms)) return iso
  const d = new Date(ms + GEORGIA_OFFSET_MS)
  const day = padDayMonth ? pad2(d.getUTCDate()) : d.getUTCDate()
  const month = padDayMonth ? pad2(d.getUTCMonth() + 1) : d.getUTCMonth() + 1
  return `${day}.${month}.${d.getUTCFullYear()}`
}
