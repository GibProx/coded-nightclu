"use client"

import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { InterfaceSwitcher } from "@/components/interface-switcher"
import { ClientNav } from "@/components/client/client-nav"
import { ClientFooter } from "@/components/client/client-footer"
import { usePathname } from "next/navigation"

const inter = Inter({ subsets: ["latin"] })

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  // Check if we're on an admin page
  const isAdminPage =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/guests") ||
    pathname.startsWith("/staff") ||
    pathname.startsWith("/inventory") ||
    pathname.startsWith("/payments") ||
    pathname.startsWith("/ticketing") ||
    pathname.startsWith("/security") ||
    pathname.startsWith("/settings") ||
    (pathname.startsWith("/reservations") && pathname.includes("admin"))

  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark">
          <div className="flex min-h-screen flex-col">
            {!isAdminPage && <ClientNav />}
            <main className="flex-1">{children}</main>
            {!isAdminPage && <ClientFooter />}
            <InterfaceSwitcher />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
