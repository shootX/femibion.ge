import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { isAdmin } from '@/lib/auth'
import { getBlogPosts } from '@/lib/blog'
import { BlogEditor } from './blog-editor'
import { DeletePostButton } from './delete-button'
import { Button } from '@/components/ui/button'
import { ChevronLeft, FileText, ExternalLink, Plus } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

export const dynamic = 'force-dynamic'

export default async function AdminBlogPage() {
  const authenticated = await isAdmin()
  if (!authenticated) redirect('/adminpc')

  const posts = await getBlogPosts()

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <Link
            href="/adminpc/dashboard"
            className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-2"
          >
            <ChevronLeft className="mr-1 h-4 w-4" /> დაფა
          </Link>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <FileText className="h-6 w-6" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">ბლოგის მართვა</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <BlogEditor mode="add" />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>ყველა პოსტი</CardTitle>
          <CardDescription>მართე შენი ბლოგის სტატიები</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {posts.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground flex flex-col items-center gap-2">
              <FileText className="h-8 w-8 opacity-20" />
              ბლოგ პოსტები არ არის
            </div>
          ) : (
            <div className="divide-y">
              {posts.map((post) => (
                <div
                  key={post.slug}
                  className="group flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:gap-6 hover:bg-muted/50 transition-colors"
                >
                  <div className="relative h-20 w-32 shrink-0 overflow-hidden rounded-xl bg-muted shadow-sm">
                    <Image
                      src={post.image}
                      alt=""
                      fill
                      unoptimized
                      className="object-cover transition-transform group-hover:scale-105"
                      sizes="128px"
                    />
                  </div>
                  <div className="min-w-0 flex-1 space-y-1">
                    <h3 className="truncate font-semibold text-lg">{post.title}</h3>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span className="bg-muted px-2 py-0.5 rounded text-xs font-mono">{post.slug}</span>
                      <span>{new Date(post.date).toLocaleDateString('ka-GE')}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <BlogEditor mode="edit" post={post} />
                    <DeletePostButton slug={post.slug} />
                    <Link href={`/blog/${post.slug}`} target="_blank">
                      <Button variant="outline" size="icon-sm" title="ნახვა">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </Link>
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
