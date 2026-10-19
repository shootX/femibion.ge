'use client'

import { useState, useTransition } from 'react'
import { Mail, Check, AlertCircle, Send, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { sendInvoiceEmailAction } from '@/app/adminpc/invoices/actions'
import type { Invoice } from '@/lib/invoice-types'

type Props = {
  invoice: Invoice
  trigger?: React.ReactNode
}

export function SendInvoiceDialog({ invoice, trigger }: Props) {
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState(invoice.buyer.email || '')
  const [subject, setSubject] = useState(
    `ინვოისი #${invoice.number} - Femibion Georgia (${invoice.seller.name})`
  )
  const [message, setMessage] = useState(
    `გამარჯობა, გიგზავნით ინვოისს #${invoice.number}. გადასახდელი თანხა შეადგენს ${invoice.total.toFixed(2)} ლარს.`
  )
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [pending, startTransition] = useTransition()

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen)
    if (isOpen) {
      setEmail(invoice.buyer.email || '')
      setStatus('idle')
      setErrorMessage('')
    }
  }

  const handleSend = () => {
    if (!email.trim() || !email.includes('@')) {
      setStatus('error')
      setErrorMessage('შეიყვანეთ ვალიდური ელ-ფოსტის მისამართი')
      return
    }

    setStatus('idle')
    setErrorMessage('')

    startTransition(async () => {
      const res = await sendInvoiceEmailAction({
        invoiceId: invoice.id,
        recipientEmail: email.trim(),
        subject: subject.trim(),
        message: message.trim(),
      })

      if (res.success) {
        setStatus('success')
        setTimeout(() => {
          setOpen(false)
          setStatus('idle')
        }, 1800)
      } else {
        setStatus('error')
        setErrorMessage(res.error || 'მეილის გაგზავნა ვერ მოხერხდა')
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="gap-1.5 shadow-sm">
            <Mail className="h-4 w-4 text-primary" />
            მეილზე გაგზავნა
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" />
            ინვოისის გაგზავნა ელ-ფოსტაზე
          </DialogTitle>
          <DialogDescription>
            ინვოისი #{invoice.number} ({invoice.total.toFixed(2)} ₾) და თანდართული ოფიციალური PDF დოკუმენტი გაიგზავნება მითითებულ მისამართზე.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {status === 'success' && (
            <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 p-3 text-sm font-medium text-emerald-800">
              <Check className="h-4 w-4 shrink-0 text-emerald-600" />
              ინვოისი წარმატებით გაიგზავნა მეილზე!
            </div>
          )}

          {status === 'error' && (
            <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {errorMessage}
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="send-email-to">
              მიმღების ელ-ფოსტა <span className="text-destructive">*</span>
            </Label>
            <Input
              id="send-email-to"
              type="email"
              placeholder="client@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={pending || status === 'success'}
            />
            {invoice.buyer.name && (
              <p className="text-xs text-muted-foreground">
                შემსყიდველი: <strong className="text-foreground">{invoice.buyer.name}</strong>
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="send-email-subject">თემა (Subject)</Label>
            <Input
              id="send-email-subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              disabled={pending || status === 'success'}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="send-email-msg">თანმხლები შეტყობინება</Label>
            <Textarea
              id="send-email-msg"
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={pending || status === 'success'}
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={pending}
          >
            დახურვა
          </Button>
          <Button
            type="button"
            onClick={handleSend}
            disabled={pending || status === 'success'}
            className="gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {pending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                იგზავნება...
              </>
            ) : status === 'success' ? (
              <>
                <Check className="h-4 w-4 text-emerald-400" />
                გაგზავნილია
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                გაგზავნა
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
