#!/usr/bin/env node
import 'dotenv/config'
import nodemailer from 'nodemailer'

const host = process.env.SMTP_HOST || 'mail.femibion.ge'
const user = process.env.SMTP_USER || 'info@femibion.ge'
const pass = process.env.SMTP_PASS
const port = parseInt(process.env.SMTP_PORT || '587', 10)

console.log('SMTP config:', { host, user, port, hasPass: !!pass })

if (!pass) {
  console.error('SMTP_PASS არ არის .env-ში')
  process.exit(1)
}

const transporter = nodemailer.createTransport({
  host,
  port,
  secure: port === 465,
  auth: { user, pass },
  tls: { rejectUnauthorized: false },
})

async function test() {
  try {
    console.log('ვერიფიკაცია...')
    await transporter.verify()
    console.log('SMTP კავშირი OK')

    console.log('ტესტ მეილის გაგზავნა...')
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || user,
      to: 'sh.chkhvirkia@gmail.com',
      subject: 'Femibion - ტესტ მეილი',
      html: '<p>ეს არის ტესტი</p>',
    })
    console.log('გაიგზავნა:', info.messageId)
  } catch (err) {
    console.error('შეცდომა:', err.message)
    console.error('სრული:', err)
    process.exit(1)
  }
}

test()
