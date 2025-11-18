"use client"

import * as React from "react"
import {
  BookOpen,
  Bot,
  Coffee,
  Command,
  Frame,
  LayoutDashboard,
  LifeBuoy,
  List,
  Map,
  PieChart,
  Send,
  Settings2,
  ShoppingCart,
  SquareTerminal,
  Package,
  Table2,
  ClipboardList,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { title } from "process"
import { url } from "inspector"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Product Management",
      url: "#",
      icon: Package,
      isActive: true,
      items: [
        {
          title: "Categories",
          url: "/category",
        },
        {
          title: "Products",
          url: "/product",
        },
        {
          title: "Table",
          url: "/table"
        }
      ],
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "#",
      icon: Send,
    },
  ],
  projects: [
    {
      name: "Dashboard",
      url: "/",
      icon: LayoutDashboard,
    },
    {
      name: "Orders",
      url: "/order",
      icon: ShoppingCart,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Coffee className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Order Coffee</span>
                  <span className="truncate text-xs">Version 1.2</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
