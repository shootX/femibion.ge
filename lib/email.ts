import nodemailer from 'nodemailer'
import { formatGeorgiaDateTime } from '@/lib/georgia-time'
import { getOrderProductLines } from '@/lib/order-display'
import { formatPhoneDisplay } from '@/lib/phone'
import type { Order } from './orders'

const ORDER_RECIPIENTS = [
  'sh.chkhvirkia@gmail.com',
  'levanbedenashvili@gmail.com',
]

export async function sendOrderEmail(order: Order): Promise<boolean> {
  const host = process.env.SMTP_HOST || 'mail.femibion.ge'
  const user = process.env.SMTP_USER || 'info@femibion.ge'
  const pass = process.env.SMTP_PASS
  const port = parseInt(process.env.SMTP_PORT || '587', 10)

  if (!pass) return false

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
    tls: { rejectUnauthorized: false },
  })

  const products = getOrderProductLines(order)

  const shippingLine =
    order.shippingFee == null
      ? ''
      : order.shippingFee === 0
        ? '<p><strong>მიწოდება:</strong> უფასო</p>'
        : `<p><strong>მიწოდება:</strong> ${order.shippingFee} ₾</p>`
  const totalLine =
    order.total != null ? `<p><strong>ჯამი:</strong> ${order.total} ₾</p>` : ''

  const html = `
    <h2>ახალი შეკვეთა #${order.id.slice(-7)}</h2>
    <p><strong>სახელი:</strong> ${order.name}</p>
    <p><strong>ტელეფონი:</strong> ${formatPhoneDisplay(order.phone)}</p>
    ${order.city ? `<p><strong>ქალაქი:</strong> ${order.city}</p>` : ''}
    <p><strong>მისამართი:</strong> ${order.address}</p>
    <h3>პროდუქცია:</h3>
    <ul>${products.map((p) => `<li>${p}</li>`).join('')}</ul>
    ${order.productsTotal != null ? `<p><strong>პროდუქტები:</strong> ${order.productsTotal} ₾</p>` : ''}
    ${shippingLine}
    ${totalLine}
    <p><em>${formatGeorgiaDateTime(order.createdAt)}</em></p>
  `

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || user,
      to: ORDER_RECIPIENTS.join(', '),
      subject: `Femibion - ახალი შეკვეთა: ${order.name}`,
      html,
    })
    return true
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('Email send error:', msg, err)
    return false
  }
}
