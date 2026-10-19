'use client'

import { useActionState } from 'react'
import Script from 'next/script'
import { login, type LoginState } from './actions'
import type { LoginCaptcha } from '@/lib/login-guard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function LoginForm({
  initialCaptcha,
  turnstileSiteKey,
}: {
  initialCaptcha: LoginCaptcha
  turnstileSiteKey?: string
}) {
  const [state, formAction] = useActionState(login, null as LoginState)
  const captcha = state?.captcha ?? initialCaptcha

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="password">პაროლი</Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="შეიყვანეთ პაროლი"
          required
          autoComplete="current-password"
          className="min-h-11 sm:min-h-9"
        />
      </div>
      {turnstileSiteKey ? (
        <>
          <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="afterInteractive" />
          <div className="cf-turnstile" data-sitekey={turnstileSiteKey} />
        </>
      ) : (
        <div className="space-y-2">
          <Label htmlFor="captchaAnswer">დადასტურება: რამდენია {captcha.question}?</Label>
          <Input
            id="captchaAnswer"
            name="captchaAnswer"
            inputMode="numeric"
            autoComplete="off"
            required
            className="min-h-11 sm:min-h-9"
          />
          <input type="hidden" name="captchaToken" value={captcha.token} />
        </div>
      )}
      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
      <Button type="submit" className="h-11 w-full sm:h-9">
        შესვლა
      </Button>
    </form>
  )
}
