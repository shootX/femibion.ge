'use server'

import { redirect } from 'next/navigation'
import { setAdminSession, clearAdminSession, verifyPassword } from '@/lib/auth'

export async function login(formData: FormData) {
  const password = formData.get('password') as string
  if (!password || !verifyPassword(password)) {
    return { error: 'არასწორი პაროლი' }
  }
  await setAdminSession()
  redirect('/adminpc/dashboard')
}

export async function logout() {
  await clearAdminSession()
  redirect('/adminpc')
}
