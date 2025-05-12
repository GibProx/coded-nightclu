"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Store } from "lucide-react"

export function InterfaceSwitcher() {
  const pathname = usePathname()
  const isAdmin =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/guests") ||
    pathname.startsWith("/staff") ||
    pathname.startsWith("/inventory") ||
    pathname.startsWith("/payments") ||
    pathname.startsWith("/ticketing") ||
    pathname.startsWith("/security") ||
    pathname.startsWith("/settings") ||
    (pathname.startsWith("/reservations") && pathname.includes("admin"))

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isAdmin ? (
        <Button asChild size="sm" className="rounded-full">
          <Link href="/">
            <Store className="mr-2 h-4 w-4" />
            View Website
          </Link>
        </Button>
      ) : (
        <Button asChild size="sm" className="rounded-full">
          <Link href="/dashboard">
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Admin Dashboard
          </Link>
        </Button>
      )}
    </div>
  )
}
