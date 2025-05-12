import type React from "react"
import { cn } from "@/lib/utils"

interface DashboardHeaderProps {
  heading: string
  text?: string
  children?: React.ReactNode
  className?: string
}

export function DashboardHeader({ heading, text, children, className }: DashboardHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between px-1", className)}>
      <div className="grid gap-1">
        <h1 className="font-heading text-2xl md:text-3xl lg:text-4xl">{heading}</h1>
        {text && <p className="text-sm md:text-base text-muted-foreground">{text}</p>}
      </div>
      {children && <div className="flex items-center gap-2 mt-2 sm:mt-0">{children}</div>}
    </div>
  )
}
