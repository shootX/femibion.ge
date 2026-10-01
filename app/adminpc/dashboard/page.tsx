import { redirect } from 'next/navigation'
import Link from 'next/link'
import { isAdmin } from '@/lib/auth'
import { formatGeorgiaDate } from '@/lib/georgia-time'
import { getOrders } from '@/lib/orders'
import { getBlogPosts } from '@/lib/blog'
import { getOrderStatusMeta, isActiveOrderStatus } from '@/lib/order-status'
import { getOrderTotalQty } from '@/lib/order-display'
import {
  ShoppingBag,
  FileText,
  Settings,
  Image as ImageIcon,
  ShieldCheck,
  ArrowRight,
  Clock,
  CheckCircle2,
  LayoutTemplate,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default async function AdminDashboardPage() {
  const authenticated = await isAdmin()
  if (!authenticated) {
    redirect('/adminpc')
  }

  const [orders, posts] = await Promise.all([getOrders(), getBlogPosts()])

  const activeOrders = orders.filter((o) => isActiveOrderStatus(o.status)).length
  const completedOrders = orders.filter((o) => o.status === 'completed').length

  const stats = [
    {
      title: 'სულ შეკვეთები',
      value: orders.length,
      icon: ShoppingBag,
      description: 'ყველა დროის შეკვეთა',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'აქტიური',
      value: activeOrders,
      icon: Clock,
      description: 'მუშავდება ან მოლოდინში',
      color: 'text-amber-600',
      bgColor: 'bg-amber-100',
    },
    {
      title: 'დასრულებული',
      value: completedOrders,
      icon: CheckCircle2,
      description: 'მიწოდებული შეკვეთები',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'ბლოგ პოსტები',
      value: posts.length,
      icon: FileText,
      description: 'გამოქვეყნებული სტატიები',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ]

  const quickLinks = [
    {
      title: 'შეკვეთების მართვა',
      href: '/adminpc/orders',
      icon: ShoppingBag,
      description: 'ნახე და შეცვალე შეკვეთების სტატუსი',
    },
    {
      title: 'ბლოგის მართვა',
      href: '/adminpc/blog',
      icon: FileText,
      description: 'დაამატე ან წაშალე სტატიები',
    },
    {
      title: 'ტექსტების მართვა',
      href: '/adminpc/texts',
      icon: Settings,
      description: 'შეცვალე საიტის ტექსტები',
    },
    {
      title: 'SEO ბლოკი',
      href: '/adminpc/seo',
      icon: LayoutTemplate,
      description: 'მთავარი გვერდის ორკოლონიანი ინფორმაციული სექცია',
    },
    {
      title: 'ფოტოების მართვა',
      href: '/adminpc/images',
      icon: ImageIcon,
      description: 'განაახლე საიტის ფოტოები',
    },
    {
      title: 'კონფიდენციალურობა',
      href: '/adminpc/privacy',
      icon: ShieldCheck,
      description: 'პოლიტიკის რედაქტირება',
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">დაფა</h1>
        <p className="text-muted-foreground">
          კეთილი იყოს თქვენი მობრძანება Femibion-ის ადმინ პანელში.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={`${stat.bgColor} p-2 rounded-lg`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="md:col-span-2 lg:col-span-2">
          <CardHeader>
            <CardTitle>სწრაფი ლინკები</CardTitle>
            <CardDescription>გადადი სასურველ სექციაზე სამართავად</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            {quickLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <div className="group flex items-center gap-4 rounded-xl border p-4 transition-all hover:bg-muted hover:border-primary/50">
                  <div className="rounded-lg bg-primary/10 p-2 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <link.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold truncate">{link.title}</div>
                    <div className="text-xs text-muted-foreground truncate">
                      {link.description}
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>ბოლო შეკვეთები</CardTitle>
            <CardDescription>ბოლო 5 შეკვეთის სტატუსი</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {orders.slice(0, 5).map((order) => (
                <div key={order.id} className="flex items-center gap-3">
                  <div className={`h-2 w-2 rounded-full ${getOrderStatusMeta(order.status).dotClass}`} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{order.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {formatGeorgiaDate(order.createdAt, true)} · {getOrderStatusMeta(order.status).label}
                    </div>
                  </div>
                  <div className="text-xs font-semibold">
                    {getOrderTotalQty(order)} ცალი
                  </div>
                </div>
              ))}
              {orders.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  შეკვეთები არ არის
                </p>
              )}
              <Button asChild variant="ghost" className="w-full mt-2" size="sm">
                <Link href="/adminpc/orders">
                  ყველა შეკვეთა <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
