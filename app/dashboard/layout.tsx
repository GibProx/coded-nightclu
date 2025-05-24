import type React from "react"
import { AdminHeader } from "@/components/admin-header"
import { SideNav } from "@/components/side-nav"
import { Toaster } from "@/components/ui/toaster"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <AdminHeader />
      <div className="flex flex-1">
        <SideNav />
        <main className="flex-1 p-3 md:p-6">{children}</main>
      </div>
      <Toaster />
    </>
  )
}
