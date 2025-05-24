"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  BarChart3,
  Calendar,
  CreditCard,
  Home,
  Settings,
  ShieldAlert,
  ShoppingCart,
  Tag,
  Ticket,
  User,
  Users,
} from "lucide-react"

interface SideNavProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SideNav({ className, ...props }: SideNavProps) {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname?.startsWith(path)
  }

  return (
    <div className={cn("pb-12", className)} {...props}>
      <div className="space-y-4 py-4">
        <div className="px-4 py-2">
          <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">Management</h2>
          <div className="space-y-1">
            <Link
              href="/dashboard"
              className={cn(
                "flex items-center rounded-md px-2 py-2 hover:bg-accent hover:text-accent-foreground",
                isActive("/dashboard") && !isActive("/dashboard/") && "bg-accent text-accent-foreground",
              )}
            >
              <Home className="mr-2 h-4 w-4" />
              <span>Dashboard</span>
            </Link>
            <Link
              href="/dashboard/reservations"
              className={cn(
                "flex items-center rounded-md px-2 py-2 hover:bg-accent hover:text-accent-foreground",
                isActive("/dashboard/reservations") && "bg-accent text-accent-foreground",
              )}
            >
              <Calendar className="mr-2 h-4 w-4" />
              <span>Reservations</span>
            </Link>
            <Link
              href="/dashboard/ticketing"
              className={cn(
                "flex items-center rounded-md px-2 py-2 hover:bg-accent hover:text-accent-foreground",
                isActive("/dashboard/ticketing") && "bg-accent text-accent-foreground",
              )}
            >
              <Ticket className="mr-2 h-4 w-4" />
              <span>Ticketing</span>
            </Link>
            <Link
              href="/dashboard/guests"
              className={cn(
                "flex items-center rounded-md px-2 py-2 hover:bg-accent hover:text-accent-foreground",
                isActive("/dashboard/guests") && "bg-accent text-accent-foreground",
              )}
            >
              <Users className="mr-2 h-4 w-4" />
              <span>Guests</span>
            </Link>
            <Link
              href="/dashboard/staff"
              className={cn(
                "flex items-center rounded-md px-2 py-2 hover:bg-accent hover:text-accent-foreground",
                isActive("/dashboard/staff") && "bg-accent text-accent-foreground",
              )}
            >
              <User className="mr-2 h-4 w-4" />
              <span>Staff</span>
            </Link>
            <Link
              href="/dashboard/payments"
              className={cn(
                "flex items-center rounded-md px-2 py-2 hover:bg-accent hover:text-accent-foreground",
                isActive("/dashboard/payments") && "bg-accent text-accent-foreground",
              )}
            >
              <CreditCard className="mr-2 h-4 w-4" />
              <span>Payments</span>
            </Link>
            <Link
              href="/dashboard/orders"
              className={cn(
                "flex items-center rounded-md px-2 py-2 hover:bg-accent hover:text-accent-foreground",
                isActive("/dashboard/orders") && "bg-accent text-accent-foreground",
              )}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              <span>Orders</span>
            </Link>
            <Link
              href="/dashboard/inventory"
              className={cn(
                "flex items-center rounded-md px-2 py-2 hover:bg-accent hover:text-accent-foreground",
                isActive("/dashboard/inventory") && "bg-accent text-accent-foreground",
              )}
            >
              <Tag className="mr-2 h-4 w-4" />
              <span>Inventory</span>
            </Link>
            <Link
              href="/dashboard/security"
              className={cn(
                "flex items-center rounded-md px-2 py-2 hover:bg-accent hover:text-accent-foreground",
                isActive("/dashboard/security") && "bg-accent text-accent-foreground",
              )}
            >
              <ShieldAlert className="mr-2 h-4 w-4" />
              <span>Security</span>
            </Link>
            <Link
              href="/dashboard/analytics"
              className={cn(
                "flex items-center rounded-md px-2 py-2 hover:bg-accent hover:text-accent-foreground",
                isActive("/dashboard/analytics") && "bg-accent text-accent-foreground",
              )}
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              <span>Analytics</span>
            </Link>
            <Link
              href="/dashboard/settings"
              className={cn(
                "flex items-center rounded-md px-2 py-2 hover:bg-accent hover:text-accent-foreground",
                isActive("/dashboard/settings") && "bg-accent text-accent-foreground",
              )}
            >
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
