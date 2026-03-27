'use client'

import { useState, useTransition, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { saveTexts } from './actions'
import type { FlatTextEntry } from '@/lib/texts-flat'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Save, Search, AlertCircle, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export function TextsEditor({
  initialEntries,
  mode = 'full',
}: {
  initialEntries: FlatTextEntry[]
  mode?: 'full' | 'seo-only'
}) {
  const [entries, setEntries] = useState(initialEntries)
  const [searchQuery, setSearchQuery] = useState('')
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const router = useRouter()

  const categories = useMemo(() => {
    const groups: Record<string, FlatTextEntry[]> = {
      'Header': [],
      'Hero': [],
      'Products': [],
      'Pregnancy': [],
      'Order': [],
      'Blog': [],
      'SEO': [],
      'Footer': [],
      'Cookies': [],
      'Other': []
    }

    entries.forEach(entry => {
      const key = entry.key.toLowerCase()
      if (key.startsWith('header')) groups['Header'].push(entry)
      else if (key.startsWith('hero')) groups['Hero'].push(entry)
      else if (key.startsWith('products')) groups['Products'].push(entry)
      else if (key.startsWith('pregnancy')) groups['Pregnancy'].push(entry)
      else if (key.startsWith('order')) groups['Order'].push(entry)
      else if (key.startsWith('blog')) groups['Blog'].push(entry)
      else if (key.startsWith('seocontent')) groups['SEO'].push(entry)
      else if (key.startsWith('footer.cookies')) groups['Cookies'].push(entry)
      else if (key.startsWith('footer')) groups['Footer'].push(entry)
      else groups['Other'].push(entry)
    })

    return Object.fromEntries(Object.entries(groups).filter(([_, items]) => items.length > 0))
  }, [entries])

  const filteredEntries = useMemo(() => {
    if (!searchQuery) return null
    const query = searchQuery.toLowerCase()
    return entries.filter(e => 
      e.label.toLowerCase().includes(query) || 
      e.value.toLowerCase().includes(query) ||
      e.key.toLowerCase().includes(query)
    )
  }, [entries, searchQuery])

  const handleChange = (key: string, value: string) => {
    setEntries((prev) =>
      prev.map((e) => (e.key === key ? { ...e, value } : e))
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)
    startTransition(async () => {
      try {
        await saveTexts(entries)
        setMessage({ type: 'success', text: 'ყველა ცვლილება წარმატებით შენახულია' })
        router.refresh()
        setTimeout(() => setMessage(null), 3000)
      } catch {
        setMessage({ type: 'error', text: 'შენახვისას დაფიქსირდა შეცდომა' })
      }
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between sticky top-16 bg-background/95 backdrop-blur-sm z-20 py-4 border-b -mx-4 px-4 sm:-mx-8 sm:px-8">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="ძებნა..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-4 w-full sm:w-auto">
          {message && (
            <div className={cn(
              "flex items-center gap-2 text-sm font-medium animate-in fade-in slide-in-from-right-4",
              message.type === 'success' ? "text-green-600" : "text-destructive"
            )}>
              {message.type === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
              {message.text}
            </div>
          )}
          <Button 
            onClick={handleSubmit} 
            disabled={isPending} 
            className="w-full sm:w-auto shadow-lg shadow-primary/20"
          >
            {isPending ? (
              <>შენახვა...</>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" /> შენახვა
              </>
            )}
          </Button>
        </div>
      </div>

      {searchQuery ? (
        <Card>
          <CardHeader>
            <CardTitle>ძებნის შედეგები: {filteredEntries?.length}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {filteredEntries?.map((entry) => (
              <TextItem key={entry.key} entry={entry} onChange={handleChange} />
            ))}
            {filteredEntries?.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                შედეგი ვერ მოიძებნა
              </div>
            )}
          </CardContent>
        </Card>
      ) : mode === 'seo-only' ? (
        <Card>
          <CardHeader>
            <CardTitle>SEO ბლოკი</CardTitle>
            <CardDescription>
              მთავარი გვერდის ორკოლონიანი ინფორმაციული სექცია (bg-secondary/20)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {(categories['SEO'] ?? []).map((entry) => (
              <TextItem key={entry.key} entry={entry} onChange={handleChange} />
            ))}
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue={Object.keys(categories)[0]} className="w-full">
          <div className="overflow-x-auto pb-2">
            <TabsList className="w-full justify-start h-auto p-1 bg-muted/50">
              {Object.keys(categories).map(cat => (
                <TabsTrigger key={cat} value={cat} className="px-4 py-2 capitalize">
                  {cat === 'Header' ? 'მენიუ' : 
                   cat === 'Hero' ? 'მთავარი' : 
                   cat === 'Products' ? 'პროდუქტები' : 
                   cat === 'Pregnancy' ? 'სლაიდერი' : 
                   cat === 'Order' ? 'ფორმა' : 
                   cat === 'Blog' ? 'ბლოგი' : 
                   cat === 'SEO' ? 'SEO ბლოკი' : 
                   cat === 'Cookies' ? 'ქუქიები' : 
                   cat === 'Footer' ? 'ფუტერი' : cat}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          {Object.entries(categories).map(([cat, items]) => (
            <TabsContent key={cat} value={cat} className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="capitalize">
                    {cat === 'Header' ? 'ზედა მენიუ' : 
                     cat === 'Hero' ? 'მთავარი სექცია' : 
                     cat === 'Products' ? 'პროდუქტების სექცია' : 
                     cat === 'Pregnancy' ? 'ორსულობის სლაიდერი' : 
                     cat === 'Order' ? 'შეკვეთის ფორმა' : 
                     cat === 'Blog' ? 'ბლოგის ტექსტები' : 
                     cat === 'SEO' ? 'SEO ბლოკი (მთავარი გვერდი)' : 
                     cat === 'Cookies' ? 'ქუქი-ფაილების ბანერი' : 
                     cat === 'Footer' ? 'ქვედა მენიუ (Footer)' : cat}
                  </CardTitle>
                  <CardDescription>მართეთ ამ სექციის ყველა ტექსტი ერთ ადგილას</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  {items.map((entry) => (
                    <TextItem key={entry.key} entry={entry} onChange={handleChange} />
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  )
}

function TextItem({ entry, onChange }: { entry: FlatTextEntry; onChange: (key: string, value: string) => void }) {
  const isLong = entry.value.length > 100 || entry.value.includes('\n')
  
  return (
    <div className="group space-y-2 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-bold text-foreground/80 group-hover:text-primary transition-colors">
          {entry.label}
        </Label>
        <code className="text-[10px] bg-muted px-1.5 py-0.5 rounded opacity-50 group-hover:opacity-100 transition-opacity">
          {entry.key}
        </code>
      </div>
      <div className="relative">
        {isLong ? (
          <Textarea
            value={entry.value}
            onChange={(e) => onChange(entry.key, e.target.value)}
            rows={4}
            className="resize-y min-h-[100px] focus-visible:ring-primary/30 transition-shadow"
          />
        ) : (
          <Input
            value={entry.value}
            onChange={(e) => onChange(entry.key, e.target.value)}
            className="focus-visible:ring-primary/30 transition-shadow"
          />
        )}
      </div>
    </div>
  )
}
