import { NextRequest, NextResponse } from 'next/server'
import { appendFile, mkdir } from 'fs/promises'
import { join } from 'path'

export const dynamic = 'force-dynamic'

/**
 * UBill SMS Delivery Report callback.
 * Docs: GET ?key=&smsID=&number=&statusID=&date=
 */
export async function GET(req: NextRequest) {
  const expectedKey = process.env.UBILL_CALLBACK_KEY?.trim()
  const key = req.nextUrl.searchParams.get('key')
  const smsID = req.nextUrl.searchParams.get('smsID')
  const number = req.nextUrl.searchParams.get('number')
  const statusID = req.nextUrl.searchParams.get('statusID')
  const date = req.nextUrl.searchParams.get('date')

  if (!expectedKey || key !== expectedKey) {
    return new NextResponse('Forbidden', { status: 403 })
  }

  const report = {
    smsID,
    number,
    statusID,
    date,
    receivedAt: new Date().toISOString(),
  }

  try {
    const dir = join(process.env.PWD || process.cwd(), 'data')
    await mkdir(dir, { recursive: true })
    await appendFile(join(dir, 'sms-reports.jsonl'), `${JSON.stringify(report)}\n`, 'utf8')
  } catch (err) {
    console.error('SMS callback write error:', err)
  }

  console.log('SMS delivery report:', report)
  return new NextResponse('OK', { status: 200 })
}
