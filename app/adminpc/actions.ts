'use server'

import { redirect } from 'next/navigation'
import { setAdminSession, clearAdminSession, verifyPassword } from '@/lib/auth'
import {
  clearLoginFailures,
  clientIp,
  createCaptcha,
  isLoginLimited,
  recordLoginFailure,
  verifyCaptcha,
  verifyTurnstile,
  type LoginCaptcha,
} from '@/lib/login-guard'

export type LoginState = { error?: string; captcha: LoginCaptcha } | null

async function rejected(ip: string, error: string): Promise<LoginState> {
  await recordLoginFailure(ip)
  return { error, captcha: createCaptcha() }
}

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const ip = await clientIp()
  const captcha = createCaptcha()

  if (await isLoginLimited(ip)) {
    return { error: 'ძალიან ბევრი მცდელობა. სცადეთ 15 წუთში.', captcha }
  }

  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY
  if (turnstileSecret) {
    const token = String(formData.get('cf-turnstile-response') || '')
    if (!(await verifyTurnstile(token, ip))) {
      return rejected(ip, 'გადამოწმება ვერ მოხერხდა')
    }
  } else {
    const token = String(formData.get('captchaToken') || '')
    const answer = String(formData.get('captchaAnswer') || '')
    if (!verifyCaptcha(token, answer)) {
      return rejected(ip, 'კაპჩა არასწორია')
    }
  }

  const password = String(formData.get('password') || '')
  if (!password || !verifyPassword(password)) {
    return rejected(ip, 'არასწორი პაროლი')
  }

  await clearLoginFailures(ip)
  await setAdminSession()
  redirect('/adminpc/dashboard')
}

export async function logout() {
  await clearAdminSession()
  redirect('/adminpc')
}
