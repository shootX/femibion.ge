import { join } from 'path'

export type ImageSlots = {
  hero: string
  product1: string
  product2: string
  logo: string
  favicon: string
  appleIcon: string
}

export const DEFAULT_PATHS: ImageSlots = {
  hero: '/images/hero-pregnant-woman.webp',
  product1: '/images/femibion-1.webp',
  product2: '/images/femibion-2.webp',
  logo: '/images/logo.webp',
  favicon: '/icon.svg',
  appleIcon: '/apple-icon.png',
}

export const SLOT_TO_FILE: Record<keyof ImageSlots, string> = {
  hero: 'images/hero-pregnant-woman.webp',
  product1: 'images/femibion-1.webp',
  product2: 'images/femibion-2.webp',
  logo: 'images/logo.webp',
  favicon: 'icon.svg',
  appleIcon: 'apple-icon.png',
}

export const LOGO_EXTENSIONS = ['webp', 'png', 'svg', 'jpg', 'jpeg'] as const

export function getPublicPath(slot: keyof ImageSlots): string {
  return join(process.cwd(), 'public', SLOT_TO_FILE[slot])
}

export function getSlotLabel(slot: keyof ImageSlots): string {
  const labels: Record<keyof ImageSlots, string> = {
    hero: 'Hero სურათი',
    product1: 'პროდუქტი 1',
    product2: 'პროდუქტი 2',
    logo: 'ლოგო',
    favicon: 'Favicon',
    appleIcon: 'Apple Touch Icon',
  }
  return labels[slot]
}

export const IMAGE_SLOTS = ['hero', 'product1', 'product2', 'logo', 'favicon', 'appleIcon'] as const
