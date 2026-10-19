import sharp from 'sharp'

const COVER_WIDTH = 1200
const COVER_HEIGHT = 630
const QUALITY = 80

export const BLOG_COVER_WIDTH = COVER_WIDTH
export const BLOG_COVER_HEIGHT = COVER_HEIGHT

export async function toCoverWebp(input: Buffer): Promise<Buffer> {
  return sharp(input)
    .rotate()
    .resize(COVER_WIDTH, COVER_HEIGHT, { fit: 'cover', position: 'centre' })
    .webp({ quality: QUALITY })
    .toBuffer()
}
