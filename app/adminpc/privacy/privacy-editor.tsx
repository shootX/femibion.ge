'use client'

import { useState } from 'react'
import { savePrivacyPolicyAction } from './actions'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

type Props = {
  initialTitle: string
  initialContentHtml: string
}

export function PrivacyEditor({ initialTitle, initialContentHtml }: Props) {
  const [title, setTitle] = useState(initialTitle)
  const [contentHtml, setContentHtml] = useState(initialContentHtml)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage(null)
    try {
      await savePrivacyPolicyAction({ title, contentHtml })
      setMessage('შენახულია.')
    } catch {
      setMessage('შეცდომა.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border bg-card p-4 sm:p-6">
      <div>
        <label htmlFor="pp-title" className="mb-2 block text-sm font-medium">
          სათაური
        </label>
        <input
          id="pp-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          required
        />
      </div>
      <div>
        <label htmlFor="pp-html" className="mb-2 block text-sm font-medium">
          შინაარსი (HTML)
        </label>
        <textarea
          id="pp-html"
          value={contentHtml}
          onChange={(e) => setContentHtml(e.target.value)}
          rows={18}
          className="w-full rounded-md border border-input bg-background px-3 py-2 font-mono text-sm"
          spellCheck={false}
        />
        <p className="mt-1 text-xs text-muted-foreground">
          დაშვებულია ტეგები: &lt;p&gt;, &lt;h2&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;strong&gt; და სხვა.
        </p>
      </div>
      {message && <p className="text-sm text-muted-foreground">{message}</p>}
      <Button type="submit" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ინახება...
          </>
        ) : (
          'შენახვა'
        )}
      </Button>
    </form>
  )
}
