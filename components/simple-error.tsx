"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

export function SimpleError() {
  const [hasError, setHasError] = useState(false)
  const [errorInfo, setErrorInfo] = useState("")

  useEffect(() => {
    window.addEventListener("error", (event) => {
      setHasError(true)
      setErrorInfo(event.message)
    })
  }, [])

  if (!hasError) return null

  return (
    <div className="fixed bottom-4 left-4 z-50 p-4 bg-destructive text-destructive-foreground rounded-lg shadow-lg max-w-md">
      <h3 className="font-semibold mb-2">Error Detected</h3>
      <p className="text-sm mb-2">{errorInfo || "An unknown error occurred"}</p>
      <Button size="sm" onClick={() => window.location.reload()}>
        Reload Page
      </Button>
    </div>
  )
}
