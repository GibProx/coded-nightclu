import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { InterfaceSwitcher } from "@/components/interface-switcher"
import { ClientNav } from "@/components/client/client-nav"
import { ClientFooter } from "@/components/client/client-footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Coded - Nightclub & Events Venue",
  description: "Experience the ultimate nightlife at Coded - Birmingham's premier nightclub and events venue",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark">
          <div className="flex min-h-screen flex-col">
            <ClientNav />
            <main className="flex-1">{children}</main>
            <ClientFooter />
            <InterfaceSwitcher />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
