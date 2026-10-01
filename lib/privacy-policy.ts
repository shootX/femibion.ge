import { readFile, writeFile } from 'fs/promises'
import { join } from 'path'

export type PrivacyPolicyData = {
  title: string
  contentHtml: string
  updatedAt: string
}

const DEFAULT_POLICY: PrivacyPolicyData = {
  title: 'კონფიდენციალურობის პოლიტიკა',
  contentHtml: '<p></p>',
  updatedAt: new Date().toISOString(),
}

function getPath() {
  const base = process.env.PWD || process.cwd()
  return join(base, 'data', 'privacy-policy.json')
}

export async function getPrivacyPolicy(): Promise<PrivacyPolicyData> {
  try {
    const raw = await readFile(getPath(), 'utf-8')
    const parsed = JSON.parse(raw) as Partial<PrivacyPolicyData>
    return {
      title: typeof parsed.title === 'string' ? parsed.title : DEFAULT_POLICY.title,
      contentHtml: typeof parsed.contentHtml === 'string' ? parsed.contentHtml : DEFAULT_POLICY.contentHtml,
      updatedAt: typeof parsed.updatedAt === 'string' ? parsed.updatedAt : DEFAULT_POLICY.updatedAt,
    }
  } catch {
    return { ...DEFAULT_POLICY }
  }
}

export async function savePrivacyPolicy(data: PrivacyPolicyData): Promise<void> {
  const { mkdir } = await import('fs/promises')
  const base = process.env.PWD || process.cwd()
  const dir = join(base, 'data')
  await mkdir(dir, { recursive: true })
  const payload: PrivacyPolicyData = {
    title: data.title.trim(),
    contentHtml: data.contentHtml,
    updatedAt: new Date().toISOString(),
  }
  await writeFile(getPath(), JSON.stringify(payload, null, 2), 'utf-8')
}
