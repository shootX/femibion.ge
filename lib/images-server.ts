import { join } from 'path'
import { existsSync, statSync } from 'fs'
import { unstable_noStore } from 'next/cache'
import {
  DEFAULT_PATHS,
  SLOT_TO_FILE,
  LOGO_EXTENSIONS,
  type ImageSlots,
} from './images'

function addCacheBust(path: string, publicDir: string, filePath: string): string {
  try {
    const fullPath = join(publicDir, filePath)
    if (existsSync(fullPath)) {
      const mtime = statSync(fullPath).mtimeMs
      return `${path}?v=${Math.round(mtime)}`
    }
  } catch {
    /* ignore */
  }
  return path
}

export function getImagePaths(): ImageSlots & { hasLogo: boolean } {
  unstable_noStore()
  try {
    const paths = { ...DEFAULT_PATHS }
    const base = process.env.PWD || process.cwd()
    const publicDir = join(base, 'public')

    paths.hero = addCacheBust(paths.hero, publicDir, SLOT_TO_FILE.hero)
    paths.product1 = addCacheBust(paths.product1, publicDir, SLOT_TO_FILE.product1)
    paths.product2 = addCacheBust(paths.product2, publicDir, SLOT_TO_FILE.product2)

    const faviconExt = ['svg', 'png', 'jpg', 'jpeg', 'webp'].find((e) =>
      existsSync(join(publicDir, `icon.${e}`))
    )
    if (faviconExt) {
      paths.favicon = addCacheBust(`/icon.${faviconExt}`, publicDir, `icon.${faviconExt}`)
    }

    const appleExt = ['png', 'jpg', 'jpeg', 'webp'].find((e) =>
      existsSync(join(publicDir, `apple-icon.${e}`))
    )
    if (appleExt) {
      paths.appleIcon = addCacheBust(`/apple-icon.${appleExt}`, publicDir, `apple-icon.${appleExt}`)
    }

    const hasLogo = LOGO_EXTENSIONS.some((ext) =>
      existsSync(join(publicDir, 'images', `logo.${ext}`))
    )
    if (hasLogo) {
      const ext = LOGO_EXTENSIONS.find((e) =>
        existsSync(join(publicDir, 'images', `logo.${e}`))
      )
      if (ext) {
        paths.logo = addCacheBust(
          `/images/logo.${ext}`,
          publicDir,
          `images/logo.${ext}`
        )
      }
    }
    return { ...paths, hasLogo }
  } catch {
    return { ...DEFAULT_PATHS, hasLogo: false }
  }
}
