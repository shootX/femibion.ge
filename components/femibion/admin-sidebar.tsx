'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  ShoppingBag,
  FileText,
  Image as ImageIcon,
  ShieldCheck,
  LogOut,
  ExternalLink,
  Settings,
  LayoutTemplate,
  Package,
} from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from '@/components/ui/sidebar'
import { logout } from '@/app/adminpc/actions'

const navItems = [
  {
    title: 'დაფა',
    href: '/adminpc/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'შეკვეთები',
    href: '/adminpc/orders',
    icon: ShoppingBag,
  },
  {
    title: 'პროდუქცია',
    href: '/adminpc/products',
    icon: Package,
  },
  {
    title: 'ბლოგი',
    href: '/adminpc/blog',
    icon: FileText,
  },
  {
    title: 'ტექსტები',
    href: '/adminpc/texts',
    icon: Settings,
  },
  {
    title: 'SEO ბლოკი',
    href: '/adminpc/seo',
    icon: LayoutTemplate,
  },
  {
    title: 'ფოტოები',
    href: '/adminpc/images',
    icon: ImageIcon,
  },
  {
    title: 'კონფიდენციალურობა',
    href: '/adminpc/privacy',
    icon: ShieldCheck,
  },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader className="h-16 flex items-center justify-center border-b">
        <Link href="/adminpc/dashboard" className="flex items-center gap-2 font-bold text-xl">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
            F
          </div>
          <span className="group-data-[collapsible=icon]:hidden">Admin</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>მართვა</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    tooltip={item.title}
                  >
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="საიტზე გადასვლა">
                  <Link href="/" target="_blank">
                    <ExternalLink />
                    <span>საიტზე გადასვლა</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t p-4">
        <form action={logout}>
          <SidebarMenuButton className="w-full text-destructive hover:text-destructive hover:bg-destructive/10">
            <LogOut />
            <span>გასვლა</span>
          </SidebarMenuButton>
        </form>
      </SidebarFooter>
    </Sidebar>
  )
}
