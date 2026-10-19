import PDFDocument from 'pdfkit'
import { readFile } from 'fs/promises'
import { join } from 'path'
import type { Invoice } from './invoice-types'

const FONT_NORMAL = join(process.cwd(), 'FiraGO-Medium.otf')
const FONT_BOLD = join(process.cwd(), 'FiraGO-ExtraBold.otf')

function money(n: number): string {
  return `${n.toFixed(2)} ₾`
}

export async function generateInvoicePdf(invoice: Invoice): Promise<Buffer> {
  const logoPath = join(process.cwd(), 'public', 'images', 'logo.png')
  let logo: Buffer | null = null
  try {
    logo = await readFile(logoPath)
  } catch {
    logo = null
  }

  const doc = new PDFDocument({
    size: 'A4',
    margin: 40,
    info: {
      Title: `ინვოისი ${invoice.number}`,
      Author: invoice.seller.name,
    },
  })

  doc.registerFont('Regular', FONT_NORMAL)
  doc.registerFont('Bold', FONT_BOLD)

  const chunks: Buffer[] = []
  const done = new Promise<Buffer>((resolve, reject) => {
    doc.on('data', (chunk: Buffer) => chunks.push(chunk))
    doc.on('end', () => resolve(Buffer.concat(chunks)))
    doc.on('error', reject)
  })

  const left = 40
  const right = 555
  const width = right - left

  if (logo) {
    doc.image(logo, left, 36, { fit: [42, 42] })
  }

  doc.font('Bold').fontSize(13).fillColor('#111827').text('FEMIBION GEORGIA', left + 50, 40)
  doc.font('Regular').fontSize(8).fillColor('#6b7280').text('ოფიციალური დისტრიბუცია საქართველოში', left + 50, 58)

  doc.font('Bold').fontSize(18).fillColor('#111827').text('ინვოისი', left, 38, { width, align: 'right' })
  doc.font('Bold').fontSize(11).fillColor('#db2777').text(`#${invoice.number}`, left, 60, { width, align: 'right' })
  doc.font('Regular').fontSize(8).fillColor('#4b5563').text(`თარიღი: ${invoice.date}`, left, 76, { width, align: 'right' })
  if (invoice.dueDate) {
    doc.text(`ვადა: ${invoice.dueDate}`, left, 88, { width, align: 'right' })
  }

  doc.moveTo(left, 108).lineTo(right, 108).strokeColor('#e5e7eb').lineWidth(1).stroke()

  const boxY = 120
  const boxW = (width - 12) / 2
  const boxH = 92

  doc.roundedRect(left, boxY, boxW, boxH, 4).fillAndStroke('#f9fafb', '#e5e7eb')
  doc.roundedRect(left + boxW + 12, boxY, boxW, boxH, 4).fillAndStroke('#f9fafb', '#e5e7eb')

  doc.fillColor('#6b7280').font('Bold').fontSize(8).text('გამყიდველი', left + 10, boxY + 10)
  doc.fillColor('#111827').font('Bold').fontSize(10).text(invoice.seller.name, left + 10, boxY + 24, { width: boxW - 20 })
  doc.fillColor('#374151').font('Regular').fontSize(8)
  doc.text(`ს/კ: ${invoice.seller.taxId}`, left + 10, boxY + 42, { width: boxW - 20 })
  doc.text(invoice.seller.address, left + 10, boxY + 54, { width: boxW - 20 })
  doc.text(invoice.seller.phone, left + 10, boxY + 72, { width: boxW - 20 })

  const buyerX = left + boxW + 22
  doc.fillColor('#6b7280').font('Bold').fontSize(8).text('შემსყიდველი', buyerX, boxY + 10)
  doc.fillColor('#111827').font('Bold').fontSize(10).text(invoice.buyer.name, buyerX, boxY + 24, { width: boxW - 20 })
  doc.fillColor('#374151').font('Regular').fontSize(8)
  let buyerLine = boxY + 42
  if (invoice.buyer.taxId) {
    doc.text(`ს/კ: ${invoice.buyer.taxId}`, buyerX, buyerLine, { width: boxW - 20 })
    buyerLine += 12
  }
  doc.text(invoice.buyer.phone, buyerX, buyerLine, { width: boxW - 20 })
  buyerLine += 12
  doc.text(invoice.buyer.address, buyerX, buyerLine, { width: boxW - 20 })

  let y = boxY + boxH + 18
  const cols = {
    n: left,
    name: left + 28,
    qty: left + 300,
    price: left + 380,
    total: right,
  }

  doc.rect(left, y, width, 22).fill('#f3f4f6')
  doc.fillColor('#374151').font('Bold').fontSize(8)
  doc.text('№', cols.n + 6, y + 7)
  doc.text('დასახელება', cols.name, y + 7)
  doc.text('რაოდ.', cols.qty, y + 7, { width: 50, align: 'right' })
  doc.text('ფასი', cols.price, y + 7, { width: 55, align: 'right' })
  doc.text('ჯამი', cols.total - 70, y + 7, { width: 70, align: 'right' })

  y += 22
  invoice.items.forEach((item, index) => {
    const rowH = 24
    if (index % 2 === 1) {
      doc.rect(left, y, width, rowH).fill('#fafafa')
    }
    doc.fillColor('#6b7280').font('Regular').fontSize(8).text(String(index + 1), cols.n + 6, y + 8)
    doc.fillColor('#111827').font('Bold').text(item.description, cols.name, y + 8, { width: 250 })
    doc.font('Regular').fillColor('#111827')
    doc.text(String(item.quantity), cols.qty, y + 8, { width: 50, align: 'right' })
    doc.text(money(item.unitPrice), cols.price, y + 8, { width: 55, align: 'right' })
    doc.font('Bold').text(money(item.total), cols.total - 70, y + 8, { width: 70, align: 'right' })
    doc.moveTo(left, y + rowH).lineTo(right, y + rowH).strokeColor('#e5e7eb').stroke()
    y += rowH
  })

  y += 14
  const totalW = 190
  const totalX = right - totalW
  doc.roundedRect(totalX, y, totalW, 48, 4).fillAndStroke('#f9fafb', '#e5e7eb')
  doc.fillColor('#6b7280').font('Regular').fontSize(9).text('ქვეჯამი', totalX + 12, y + 10)
  doc.fillColor('#111827').text(money(invoice.subtotal), totalX + 12, y + 10, { width: totalW - 24, align: 'right' })
  doc.fillColor('#111827').font('Bold').fontSize(11).text('სულ', totalX + 12, y + 28)
  doc.fillColor('#db2777').text(money(invoice.total), totalX + 12, y + 28, { width: totalW - 24, align: 'right' })

  y += 64
  if (invoice.notes) {
    doc.fillColor('#111827').font('Bold').fontSize(8).text('შენიშვნა', left, y)
    doc.fillColor('#4b5563').font('Regular').fontSize(8).text(invoice.notes, left, y + 12, { width })
    y += 36
  }

  const signY = Math.max(y + 20, 700)
  doc.moveTo(left, signY).lineTo(left + 180, signY).strokeColor('#9ca3af').stroke()
  doc.moveTo(right - 180, signY).lineTo(right, signY).strokeColor('#9ca3af').stroke()
  doc.fillColor('#6b7280').font('Regular').fontSize(8)
  doc.text(`ჩააბარა: ${invoice.seller.name}`, left, signY + 6, { width: 180 })
  doc.text(`ჩაიბარა: ${invoice.buyer.name}`, right - 180, signY + 6, { width: 180, align: 'right' })

  doc.end()
  const buffer = await done
  if (!buffer.subarray(0, 5).toString().startsWith('%PDF') || !buffer.includes(Buffer.from('%%EOF'))) {
    throw new Error('PDF ფაილი არასწორად შეიქმნა')
  }
  return buffer
}
