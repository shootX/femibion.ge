import sharp from 'sharp'
import { readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const PUBLIC_DIR = new URL('../public/', import.meta.url).pathname
const SOURCE = join(PUBLIC_DIR, 'logo-favicon-source.png')

async function build() {
  const buf = await readFile(SOURCE)
  const sizes = [
    { name: 'icon.png', size: 32 },
    { name: 'icon-192.png', size: 192 },
    { name: 'icon-512.png', size: 512 },
    { name: 'icon-512-maskable.png', size: 512, padding: 0.1 },
  ]

  for (const item of sizes) {
    let pipeline = sharp(buf).resize(item.size, item.size, {
      fit: 'contain',
      background: { r: 255, g: 255, b: 255, alpha: 0 },
    })
    if (item.padding) {
      const inner = Math.round(item.size * (1 - item.padding * 2))
      pipeline = sharp(buf)
        .resize(inner, inner, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
        .extend({
          top: Math.round((item.size - inner) / 2),
          bottom: Math.round((item.size - inner) / 2),
          left: Math.round((item.size - inner) / 2),
          right: Math.round((item.size - inner) / 2),
          background: { r: 255, g: 255, b: 255, alpha: 1 },
        })
    }
    const out = await pipeline.png({ compressionLevel: 9 }).toBuffer()
    await writeFile(join(PUBLIC_DIR, item.name), out)
    console.log(`Wrote ${item.name} (${item.size}x${item.size})`)
  }
}

build().catch((err) => {
  console.error(err)
  process.exit(1)
})
