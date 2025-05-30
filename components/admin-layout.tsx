"use client"

import type React from "react"

import { SideNav } from "@/components/side-nav"
import { InterfaceSwitcher } from "@/components/interface-switcher"

export function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1">
        <SideNav />
        <main className="flex-1 p-3 md:p-6">{children}</main>
      </div>
      <InterfaceSwitcher />
    </div>
  )
}
