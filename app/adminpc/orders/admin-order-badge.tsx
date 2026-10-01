'use client'

import { Badge } from '@/components/ui/badge'
import { Shield } from 'lucide-react'
import { cn } from '@/lib/utils'

export function AdminOrderBadge({ className }: { className?: string }) {
  return (
    <Badge
      className={cn(
        'gap-1 border-violet-300 bg-gradient-to-r from-violet-600 to-purple-600 font-semibold text-white hover:from-violet-600 hover:to-purple-600',
        className,
      )}
    >
      <Shield className="h-3 w-3" />
      ადმინის შეკვეთა
    </Badge>
  )
}
