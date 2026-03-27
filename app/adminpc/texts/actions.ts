'use server'

import { redirect } from 'next/navigation'
import { isAdmin } from '@/lib/auth'
import { getSiteTexts, saveSiteTexts } from '@/lib/texts'
import { unflattenToTexts, type FlatTextEntry } from '@/lib/texts-flat'

export async function getTextsForEdit() {
  const auth = await isAdmin()
  if (!auth) redirect('/adminpc')
  const texts = await getSiteTexts()
  return texts
}

export async function saveTexts(entries: FlatTextEntry[]) {
  const auth = await isAdmin()
  if (!auth) redirect('/adminpc')
  const current = await getSiteTexts()
  const updated = unflattenToTexts(entries)
  const merged = deepMerge(current, updated)
  await saveSiteTexts(merged)
}

function deepMerge<T extends object>(base: T, override: Partial<T>): T {
  const result = JSON.parse(JSON.stringify(base)) as T
  for (const key of Object.keys(override) as (keyof T)[]) {
    const val = override[key]
    if (val != null) {
      if (
        typeof val === 'object' &&
        !Array.isArray(val) &&
        typeof (base[key] as object) === 'object' &&
        !Array.isArray(base[key])
      ) {
        ;(result as Record<string, unknown>)[key as string] = deepMerge(
          base[key] as object,
          val as object
        )
      } else if (Array.isArray(val) && Array.isArray(base[key])) {
        const baseArr = base[key] as unknown[]
        ;(result as Record<string, unknown>)[key as string] = val.map((item, i) =>
          typeof item === 'object' && item !== null && baseArr[i] && typeof baseArr[i] === 'object'
            ? deepMerge(baseArr[i] as object, item as object)
            : item
        )
      } else {
        ;(result as Record<string, unknown>)[key as string] = val
      }
    }
  }
  return result
}
