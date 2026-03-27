'use server'

import { redirect } from 'next/navigation'
import { isAdmin } from '@/lib/auth'
import { savePrivacyPolicy, type PrivacyPolicyData } from '@/lib/privacy-policy'

export async function savePrivacyPolicyAction(data: { title: string; contentHtml: string }) {
  const auth = await isAdmin()
  if (!auth) redirect('/adminpc')
  const payload: PrivacyPolicyData = {
    title: data.title,
    contentHtml: data.contentHtml,
    updatedAt: new Date().toISOString(),
  }
  await savePrivacyPolicy(payload)
}
