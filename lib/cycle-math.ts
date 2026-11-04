/** Date-only arithmetic for the article calculators. Dates are UTC calendar days. */

export function parseISODate(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  if (!match) return null
  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])
  const date = new Date(Date.UTC(year, month - 1, day))
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return null
  return date
}

export function formatISODate(date: Date): string {
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  const day = String(date.getUTCDate()).padStart(2, '0')
  return `${date.getUTCFullYear()}-${month}-${day}`
}

export function addDays(date: Date, days: number): Date {
  const next = new Date(date.getTime())
  next.setUTCDate(next.getUTCDate() + days)
  return next
}

export function diffDays(from: Date, to: Date): number {
  return Math.round((to.getTime() - from.getTime()) / 86_400_000)
}

export function localTodayISO(now = new Date()): string {
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${now.getFullYear()}-${month}-${day}`
}

export type CycleWindow = {
  cycleStart: string
  nextMenses: string
  ovulation: string
  fertileStart: string
  fertileEnd: string
}

const CYCLE_ERROR = 'ციკლის ხანგრძლივობა 21-დან 45 დღემდე უნდა იყოს'
const FUTURE_ERROR = 'ბოლო მენსტრუაციის თარიღი მომავალში ვერ იქნება'
const DATE_ERROR = 'თარიღი არასწორია'

function readInputs(lmp: string, cycle: number, today: string): { start: Date; now: Date } | { error: string } {
  const start = parseISODate(lmp)
  const now = parseISODate(today)
  if (!start || !now) return { error: DATE_ERROR }
  if (!Number.isInteger(cycle) || cycle < 21 || cycle > 45) return { error: CYCLE_ERROR }
  if (start.getTime() > now.getTime()) return { error: FUTURE_ERROR }
  return { start, now }
}

/** Next period = LMP + cycle. Ovulation ≈ next period − 14. Fertile = ovulation − 5 … ovulation. */
export function ovulationCycles(
  lmp: string,
  cycle: number,
  today: string
): { error: string } | { cycles: CycleWindow[] } {
  const parsed = readInputs(lmp, cycle, today)
  if ('error' in parsed) return parsed

  const cycles: CycleWindow[] = []
  let cursor = parsed.start
  for (let i = 0; i < 3; i++) {
    const nextMenses = addDays(cursor, cycle)
    const ovulation = addDays(nextMenses, -14)
    cycles.push({
      cycleStart: formatISODate(cursor),
      nextMenses: formatISODate(nextMenses),
      ovulation: formatISODate(ovulation),
      fertileStart: formatISODate(addDays(ovulation, -5)),
      fertileEnd: formatISODate(ovulation),
    })
    cursor = nextMenses
  }
  return { cycles }
}

export type DueDateResult = {
  edd: string
  weeks: number
  days: number
  trimester: 1 | 2 | 3
  product: 'femibion-1' | 'femibion-2'
}

/** EDD = LMP + 280 + (cycle − 28). Gestational age is counted from LMP to today. */
export function pregnancyDueDate(
  lmp: string,
  cycle: number,
  today: string
): { error: string } | DueDateResult {
  const parsed = readInputs(lmp, cycle, today)
  if ('error' in parsed) return parsed

  const ageDays = diffDays(parsed.start, parsed.now)
  if (ageDays > 44 * 7) return { error: 'ბოლო მენსტრუაცია 44 კვირაზე ძველი არ უნდა იყოს' }

  const weeks = Math.floor(ageDays / 7)
  const days = ageDays % 7
  const trimester: 1 | 2 | 3 = weeks <= 12 ? 1 : weeks <= 27 ? 2 : 3
  return {
    edd: formatISODate(addDays(parsed.start, 280 + (cycle - 28))),
    weeks,
    days,
    trimester,
    product: weeks >= 13 ? 'femibion-2' : 'femibion-1',
  }
}
