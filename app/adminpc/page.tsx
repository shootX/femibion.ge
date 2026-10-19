import { redirect } from 'next/navigation'
import { isAdmin } from '@/lib/auth'
import { createCaptcha } from '@/lib/login-guard'
import { LoginForm } from './login-form'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

export default async function AdminLoginPage() {
  const authenticated = await isAdmin()
  if (authenticated) {
    redirect('/adminpc/dashboard')
  }

  return (
    <div className="w-full max-w-md animate-in fade-in duration-500">
      <div className="mb-8 text-center">
        <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-6">
          <ChevronLeft className="mr-1 h-4 w-4" /> საიტზე დაბრუნება
        </Link>
        <div className="mx-auto h-12 w-12 rounded-xl bg-primary flex items-center justify-center text-primary-foreground text-2xl font-bold mb-4 shadow-lg shadow-primary/20">
          F
        </div>
        <h1 className="text-2xl font-bold tracking-tight">ადმინ პანელი</h1>
        <p className="text-muted-foreground mt-2">გთხოვთ შეიყვანოთ პაროლი გასაგრძელებლად</p>
      </div>
      
      <div className="rounded-2xl border bg-card p-6 shadow-xl shadow-foreground/5 sm:p-8">
        <LoginForm
          initialCaptcha={createCaptcha()}
          turnstileSiteKey={
            process.env.TURNSTILE_SECRET_KEY && process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
              ? process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
              : undefined
          }
        />
      </div>
      
      <p className="mt-8 text-center text-xs text-muted-foreground">
        &copy; {new Date().getFullYear()} Femibion Georgia. ყველა უფლება დაცულია.
      </p>
    </div>
  )
}
