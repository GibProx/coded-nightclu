import type React from "react"
import { ClientNav } from "@/components/client/client-nav"
import { ClientFooter } from "@/components/client/client-footer"

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <ClientNav />
      <main className="flex-1">{children}</main>
      <ClientFooter />
    </>
  )
}
