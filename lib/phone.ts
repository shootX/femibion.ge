/**
 * UBill SMS API format: international digits without + or 00.
 * Example: 995595947450
 */
export function toUbillNumber(phone: string): string | null {
  const digits = phone.replace(/\D/g, '')
  if (!digits) return null

  if (digits.startsWith('995') && digits.length === 12 && digits[3] === '5') {
    return digits
  }
  if (digits.startsWith('5') && digits.length === 9) {
    return `995${digits}`
  }
  // local 9 digits typed without leading 5 somehow — reject
  return null
}

/** Display: +995 5XX XXX XXX */
export function formatPhoneDisplay(phone: string): string {
  const n = toUbillNumber(phone)
  if (!n) return phone
  const local = n.slice(3) // 5XXXXXXXX
  return `+995 ${local.slice(0, 3)} ${local.slice(3, 6)} ${local.slice(6)}`
}
