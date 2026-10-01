import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { isAdmin } from '@/lib/auth'
import { getAllProducts } from '@/lib/products'
import { ProductEditor } from './product-editor'
import { DeleteProductButton } from './delete-button'
import { StockReceiveButton } from './stock-receive'
import { ChevronLeft, Package } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export const dynamic = 'force-dynamic'

export default async function AdminProductsPage() {
  const authenticated = await isAdmin()
  if (!authenticated) redirect('/adminpc')

  const products = await getAllProducts()

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <Link
            href="/adminpc/dashboard"
            className="mb-2 flex items-center text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            <ChevronLeft className="mr-1 h-4 w-4" /> დაფა
          </Link>
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-primary/10 p-2 text-primary">
              <Package className="h-6 w-6" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">პროდუქციის მართვა</h1>
          </div>
        </div>
        <ProductEditor mode="add" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>პროდუქტები</CardTitle>
          <CardDescription>სტოკის მართვა, რედაქტირება და საწყობში მიღება</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {products.length === 0 ? (
            <div className="flex flex-col items-center gap-2 p-12 text-center text-muted-foreground">
              <Package className="h-8 w-8 opacity-20" />
              პროდუქტები არ არის
            </div>
          ) : (
            <div className="divide-y">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="group flex flex-col gap-4 p-4 transition-colors hover:bg-muted/50 sm:flex-row sm:items-center sm:gap-6"
                >
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-muted">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      unoptimized
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-semibold">{product.name}</h3>
                      <Badge variant={product.active ? 'default' : 'secondary'}>
                        {product.active ? 'აქტიური' : 'არააქტიური'}
                      </Badge>
                      <Badge
                        variant={
                          product.stock <= 0
                            ? 'destructive'
                            : product.stock <= 5
                              ? 'outline'
                              : 'secondary'
                        }
                        className={product.stock > 0 && product.stock <= 5 ? 'border-amber-500 text-amber-700' : ''}
                      >
                        სტოკი: {product.stock} ცალი
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{product.subtitle}</p>
                    <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                      {product.price != null && <span className="font-medium text-primary">{product.price} ₾</span>}
                      <span className="font-mono text-xs">{product.id}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <StockReceiveButton
                      productId={product.id}
                      productName={product.name}
                      currentStock={product.stock}
                    />
                    <ProductEditor mode="edit" product={product} />
                    <DeleteProductButton id={product.id} name={product.name} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
