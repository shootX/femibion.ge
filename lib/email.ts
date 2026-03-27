import nodemailer from 'nodemailer'
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

  const products: string[] = []
  if (order.product1Qty > 0) products.push(`${order.product1Label}: ${order.product1Qty} ცალი`)
  if (order.product2Qty > 0) products.push(`${order.product2Label}: ${order.product2Qty} ცალი`)

  const html = `
    <h2>ახალი შეკვეთა #${order.id.slice(-7)}</h2>
    <p><strong>სახელი:</strong> ${order.name}</p>
    <p><strong>ტელეფონი:</strong> +995 ${order.phone}</p>
    <p><strong>მისამართი:</strong> ${order.address}</p>
    <h3>პროდუქცია:</h3>
    <ul>${products.map((p) => `<li>${p}</li>`).join('')}</ul>
    <p><em>${new Date(order.createdAt).toLocaleString('ka-GE')}</em></p>
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
