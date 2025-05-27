"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"

interface TicketButtonProps {
  fatsoma_url?: string
  external_ticketing?: boolean
  className?: string
  children?: React.ReactNode
}

export function TicketButton({ fatsoma_url, external_ticketing, className, children }: TicketButtonProps) {
  const handleTicketClick = () => {
    if (external_ticketing && fatsoma_url) {
      window.open(fatsoma_url, "_blank", "noopener,noreferrer")
    } else {
      // Handle internal ticketing or show message
      alert("Tickets coming soon!")
    }
  }

  if (external_ticketing && fatsoma_url) {
    return (
      <Button className={cn("", className)} onClick={handleTicketClick}>
        {children || (
          <>
            Buy Tickets on Fatsoma <ExternalLink className="ml-2 h-4 w-4" />
          </>
        )}
      </Button>
    )
  }

  return (
    <Button className={cn("", className)} disabled>
      {children || "Tickets Coming Soon"}
    </Button>
  )
}
