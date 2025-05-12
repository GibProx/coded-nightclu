"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"

export function MainNav() {
  const pathname = usePathname()

  return (
    <div className="mr-4 flex">
      <Link href="/" className="mr-6 flex items-center space-x-2">
        <Icons.logo className="h-6 w-6" />
        <span className="font-bold">CODED</span>
      </Link>
      <nav className="hidden md:flex items-center space-x-4 lg:space-x-6 text-sm font-medium">
        <Link
          href="/"
          className={cn(
            "transition-colors hover:text-primary",
            pathname === "/" ? "text-primary" : "text-muted-foreground",
          )}
        >
          Dashboard
        </Link>
        <Link
          href="/guests"
          className={cn(
            "transition-colors hover:text-primary",
            pathname === "/guests" ? "text-primary" : "text-muted-foreground",
          )}
        >
          Guests
        </Link>
        <Link
          href="/reservations"
          className={cn(
            "transition-colors hover:text-primary",
            pathname === "/reservations" ? "text-primary" : "text-muted-foreground",
          )}
        >
          Reservations
        </Link>
        <Link
          href="/staff"
          className={cn(
            "transition-colors hover:text-primary",
            pathname === "/staff" ? "text-primary" : "text-muted-foreground",
          )}
        >
          Staff
        </Link>
        <Link
          href="/inventory"
          className={cn(
            "transition-colors hover:text-primary",
            pathname === "/inventory" ? "text-primary" : "text-muted-foreground",
          )}
        >
          Inventory
        </Link>
      </nav>
    </div>
  )
}
