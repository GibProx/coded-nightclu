"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Bell, Menu, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { UserNav } from "@/components/user-nav"
import { Icons } from "@/components/icons"
import { cn } from "@/lib/utils"
import { useState } from "react"

export function AdminHeader() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const navItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      active: pathname === "/dashboard",
    },
    {
      title: "Guests",
      href: "/guests",
      active: pathname === "/guests",
    },
    {
      title: "Reservations",
      href: "/reservations",
      active: pathname === "/reservations",
    },
    {
      title: "Staff",
      href: "/staff",
      active: pathname === "/staff",
    },
    {
      title: "Inventory",
      href: "/inventory",
      active: pathname === "/inventory",
    },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="lg:hidden">
            <Button variant="ghost" size="icon" className="mr-2">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[240px] sm:w-[300px]">
            <div className="flex items-center space-x-2 mb-6">
              <Icons.logo className="h-6 w-6" />
              <span className="font-bold">CODED ADMIN</span>
            </div>
            <nav className="flex flex-col space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                    item.active ? "bg-accent text-accent-foreground" : "transparent",
                  )}
                >
                  {item.title}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>

        <Link href="/dashboard" className="flex items-center space-x-2 mr-6">
          <Icons.logo className="h-6 w-6" />
          <span className="hidden font-bold sm:inline-block">CODED ADMIN</span>
        </Link>

        <nav className="hidden lg:flex items-center space-x-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                item.active ? "text-primary" : "text-muted-foreground",
              )}
            >
              {item.title}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center space-x-4">
          <div className="hidden md:flex relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search..." className="w-[200px] lg:w-[300px] pl-8" />
          </div>

          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary"></span>
            <span className="sr-only">Notifications</span>
          </Button>

          <UserNav />
        </div>
      </div>
    </header>
  )
}
