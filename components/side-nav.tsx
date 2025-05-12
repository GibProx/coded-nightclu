"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  Users,
  CalendarClock,
  UserCog,
  Package,
  CreditCard,
  Settings,
  ShieldAlert,
  TicketCheck,
  Menu,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

interface SideNavProps extends React.HTMLAttributes<HTMLElement> {
  className?: string
}

export function SideNav({ className }: SideNavProps) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const navItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: <BarChart3 className="h-5 w-5" />,
    },
    {
      title: "Guest Management",
      href: "/guests",
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: "Reservations",
      href: "/reservations",
      icon: <CalendarClock className="h-5 w-5" />,
    },
    {
      title: "Staff",
      href: "/staff",
      icon: <UserCog className="h-5 w-5" />,
    },
    {
      title: "Inventory",
      href: "/inventory",
      icon: <Package className="h-5 w-5" />,
    },
    {
      title: "Payments",
      href: "/payments",
      icon: <CreditCard className="h-5 w-5" />,
    },
    {
      title: "Ticketing",
      href: "/ticketing",
      icon: <TicketCheck className="h-5 w-5" />,
    },
    {
      title: "Security Log",
      href: "/security",
      icon: <ShieldAlert className="h-5 w-5" />,
    },
    {
      title: "Settings",
      href: "/settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ]

  // Desktop sidebar
  const DesktopSidebar = (
    <nav className={cn("hidden border-r bg-background lg:block lg:w-64", className)}>
      <div className="space-y-4 py-4">
        <div className="px-4 py-2">
          <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">Main Menu</h2>
          <div className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                  pathname === item.href ? "bg-accent text-accent-foreground" : "transparent",
                )}
              >
                {item.icon}
                <span className="ml-3">{item.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )

  // Mobile sidebar (using Sheet component)
  const MobileSidebar = (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[240px] sm:w-[300px]">
        <div className="px-2 py-6">
          <h2 className="mb-4 px-2 text-lg font-semibold tracking-tight">Main Menu</h2>
          <div className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                  pathname === item.href ? "bg-accent text-accent-foreground" : "transparent",
                )}
              >
                {item.icon}
                <span className="ml-3">{item.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )

  return (
    <>
      {DesktopSidebar}
      {MobileSidebar}
    </>
  )
}
