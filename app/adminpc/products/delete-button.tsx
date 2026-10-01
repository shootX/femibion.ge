'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { removeProduct } from './actions'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

export function DeleteProductButton({ id, name }: { id: string; name: string }) {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    const fd = new FormData()
    fd.set('id', id)
    await removeProduct(fd)
    setOpen(false)
    router.refresh()
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/10">
          წაშლა
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>პროდუქტის წაშლა</AlertDialogTitle>
          <AlertDialogDescription>
            „{name}" წაიშლება. დარწმუნებული ხართ?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>გაუქმება</AlertDialogCancel>
          <Button variant="destructive" onClick={handleDelete}>
            წაშლა
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
