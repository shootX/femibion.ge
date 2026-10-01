import { readFile } from 'fs/promises'
import { join } from 'path'

export type FaqItem = {
  question: string
  answer: string[]
}

export type FaqData = {
  title: string
  description: string
  disclaimer: string
  items: FaqItem[]
}

export async function getFaqData(): Promise<FaqData> {
  const raw = await readFile(join(process.cwd(), 'data', 'faq.json'), 'utf-8')
  return JSON.parse(raw) as FaqData
}