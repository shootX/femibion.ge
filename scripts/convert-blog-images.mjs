import sharp from 'sharp'
import { readFile, writeFile, copyFile } from 'node:fs/promises'
import { join } from 'node:path'

const SRC_DIR = '/root/.cursor/projects/www-wwwroot-femibion-ge/assets'
const DST_DIR = '/www/wwwroot/femibion.ge/public/images/blog'

const files = [
  'blog-femibion-1-vs-2',
  'blog-foods-to-avoid-pregnancy',
  'blog-dha-omega-3-pregnancy',
  'blog-prenatal-vitamins-comparison',
]

for (const f of files) {
  const src = join(SRC_DIR, `${f}.png`)
  const buf = await readFile(src)
  const webp = await sharp(buf)
    .resize({ width: 1200, height: 630, fit: 'cover', position: 'center' })
    .webp({ quality: 82 })
    .toBuffer()
  await writeFile(join(DST_DIR, `${f}.webp`), webp)
  await copyFile(src, join(DST_DIR, `${f}.png`))
  console.log(`✓ ${f}.webp (${webp.length} bytes)`)
}
