import { createHmac, timingSafeEqual } from 'crypto'
import { readFile, writeFile } from 'fs/promises'
import { join } from 'path'
import { headers } from 'next/headers'

const WINDOW_MS = 15 * 60 * 1000
const MAX_ATTEMPTS = 5
const CAPTCHA_TTL_MS = 10 * 60 * 1000

type Store = Record<string, number[]>

function attemptsPath() {
  return join(process.cwd(), 'data', 'admin-login-attempts.json')
}

function secret() {
  return process.env.ADMIN_PASSWORD || 'femibion-login'
}

function sign(payload: string) {
  return createHmac('sha256', secret()).update(payload).digest('hex')
}

async function readStore(): Promise<Store> {
  try {
    const raw = await readFile(attemptsPath(), 'utf-8')
    const parsed = JSON.parse(raw) as Store
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

async function writeStore(store: Store) {
  await writeFile(attemptsPath(), JSON.stringify(store), 'utf-8')
}

function recent(times: number[] | undefined, now: number) {
  return (times ?? []).filter((ts) => now - ts < WINDOW_MS)
}

export async function clientIp(): Promise<string> {
  const h = await headers()
  const forwarded = h.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0]?.trim() || 'unknown'
  return h.get('x-real-ip') || 'unknown'
}

export async function isLoginLimited(ip: string): Promise<boolean> {
  const store = await readStore()
  return recent(store[ip], Date.now()).length >= MAX_ATTEMPTS
}

export async function recordLoginFailure(ip: string) {
  const now = Date.now()
  const store = await readStore()
  store[ip] = [...recent(store[ip], now), now]
  await writeStore(store)
}

export async function clearLoginFailures(ip: string) {
  const store = await readStore()
  if (!store[ip]) return
  delete store[ip]
  await writeStore(store)
}

export type LoginCaptcha = { question: string; token: string }

export function createCaptcha(): LoginCaptcha {
  const a = Math.floor(Math.random() * 8) + 2
  const b = Math.floor(Math.random() * 8) + 2
  const payload = `${a}+${b}:${Date.now() + CAPTCHA_TTL_MS}`
  return { question: `${a} + ${b}`, token: `${Buffer.from(payload).toString('base64url')}.${sign(payload)}` }
}

export function verifyCaptcha(token: string, answer: string): boolean {
  const dot = token.lastIndexOf('.')
  if (dot <= 0) return false
  const encoded = token.slice(0, dot)
  const sig = token.slice(dot + 1)
  let payload = ''
  try {
    payload = Buffer.from(encoded, 'base64url').toString('utf-8')
  } catch {
    return false
  }
  const expected = sign(payload)
  const left = Buffer.from(expected)
  const right = Buffer.from(sig)
  if (left.length !== right.length || !timingSafeEqual(left, right)) return false
  const [expr, exp] = payload.split(':')
  if (!expr || Date.now() > Number(exp)) return false
  const [a, b] = expr.split('+').map(Number)
  if (!Number.isFinite(a) || !Number.isFinite(b)) return false
  return Number(answer) === a + b
}

export async function verifyTurnstile(token: string, ip: string): Promise<boolean> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY
  if (!secretKey) return false
  const body = new URLSearchParams({ secret: secretKey, response: token, remoteip: ip })
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body,
  })
  if (!res.ok) return false
  const data = (await res.json()) as { success?: boolean }
  return data.success === true
}
