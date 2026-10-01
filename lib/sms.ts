import dns from 'node:dns'
import https from 'node:https'
import { toUbillNumber } from '@/lib/phone'
import { getOrderProductLines } from '@/lib/order-display'
import type { Order } from '@/lib/orders'

// UBill whitelist-ზე მხოლოდ IPv4ა — IPv6 იბლოკება (403 IP not allowed)
dns.setDefaultResultOrder('ipv4first')

const ORDER_SMS_TEXT =
  'გამარჯობა, შეკვეთა მიღებული. კურიერი დაგიკავშირდებათ. მიწოდების დრო 3 სამუშაო დღე თბილისი, რეგიონები 7 სამუშაო დღე.'

const ADMIN_NOTIFY_PHONES = ['595947450', '591926727']

const UBILL_HOST = 'api.ubill.dev'
const UBILL_PATH = '/v1/sms/send'

export { toUbillNumber }

function postUbillSms(key: string, payload: unknown): Promise<{ status: number; body: string }> {
  const body = JSON.stringify(payload)
  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        hostname: UBILL_HOST,
        path: UBILL_PATH,
        method: 'POST',
        family: 4,
        headers: {
          'Content-Type': 'application/json',
          key,
          'Content-Length': Buffer.byteLength(body),
        },
      },
      (res) => {
        const chunks: Buffer[] = []
        res.on('data', (c) => chunks.push(c))
        res.on('end', () => {
          resolve({
            status: res.statusCode || 0,
            body: Buffer.concat(chunks).toString('utf8'),
          })
        })
      }
    )
    req.on('error', reject)
    req.write(body)
    req.end()
  })
}

async function sendSms(numbers: string[], text: string): Promise<boolean> {
  const key = process.env.UBILL_API_KEY?.trim()
  const brandID = parseInt(process.env.UBILL_BRAND_ID || '', 10)

  if (!key || !Number.isFinite(brandID)) {
    console.error('SMS skip: UBILL_API_KEY or UBILL_BRAND_ID missing')
    return false
  }

  const normalized = numbers
    .map((n) => toUbillNumber(n))
    .filter((n): n is string => !!n)

  if (normalized.length === 0) {
    console.error('SMS skip: no valid numbers', numbers)
    return false
  }

  const callbackKey = process.env.UBILL_CALLBACK_KEY?.trim()
  const callbackUrl = callbackKey
    ? `https://femibion.ge/api/sms/callback?key=${encodeURIComponent(callbackKey)}`
    : undefined

  try {
    const res = await postUbillSms(key, {
      brandID,
      numbers: normalized,
      text,
      stopList: false,
      ...(callbackUrl ? { callbackUrl } : {}),
    })

    if (res.status < 200 || res.status >= 300) {
      console.error('SMS send error:', res.status, res.body)
      return false
    }

    try {
      const data = JSON.parse(res.body) as { statusID?: number; message?: string }
      if (typeof data.statusID === 'number' && data.statusID !== 0) {
        console.error('SMS API error:', data.statusID, data.message || res.body)
        return false
      }
    } catch {
      // non-JSON success body is fine
    }

    return true
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('SMS send error:', msg, err)
    return false
  }
}

function buildAdminOrderSms(order: Order): string {
  const products = getOrderProductLines(order).join(', ') || '—'
  const total = order.total != null ? `${order.total}₾` : ''
  const parts = [
    `ახალი შეკვეთა #${order.id.slice(-7)}`,
    order.name,
    order.phone,
    order.address,
    products,
  ]
  if (total) parts.push(`ჯამი: ${total}`)
  return parts.join(' | ')
}

/** შემკვეთს + ადმინ ნომრებს (595947450, 551938382) */
export async function sendOrderSms(order: Order): Promise<boolean> {
  const customerOk = await sendSms([order.phone], ORDER_SMS_TEXT)
  const adminOk = await sendSms(ADMIN_NOTIFY_PHONES, buildAdminOrderSms(order))
  return customerOk && adminOk
}
