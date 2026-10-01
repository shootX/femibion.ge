import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ShoppingBag } from 'lucide-react'

export default function OrderNotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
      <ShoppingBag className="h-12 w-12 text-muted-foreground/30" />
      <div className="space-y-1">
        <h1 className="text-xl font-semibold">შეკვეთა ვერ მოიძებნა</h1>
        <p className="text-sm text-muted-foreground">
          შესაძლოა შეკვეთა წაშლილია ან არასწორი ბმული გაქვთ.
        </p>
      </div>
      <Button asChild>
        <Link href="/adminpc/orders">შეკვეთების სიაზე დაბრუნება</Link>
      </Button>
    </div>
  )
}
