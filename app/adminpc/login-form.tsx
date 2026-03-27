'use client'

import { useActionState } from 'react'
import { login } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function LoginForm() {
  const [state, formAction] = useActionState(
    async (_: unknown, formData: FormData) => {
      return await login(formData)
    },
    null as { error?: string } | null
  )

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
      {state?.error && (
        <p className="text-sm text-destructive">{state.error}</p>
      )}
      <Button type="submit" className="h-11 w-full sm:h-9">
        შესვლა
      </Button>
    </form>
  )
}
