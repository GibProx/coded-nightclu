"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export function DebugInfo() {
  const [info, setInfo] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isOpen, setIsOpen] = useState(false)

  const fetchDebugInfo = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch("/api/debug")
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setInfo(data)
    } catch (err) {
      console.error("Error fetching debug info:", err)
      setError(err instanceof Error ? err.message : "Unknown error occurred")
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsOpen(true)}
          className="bg-background/80 backdrop-blur-sm"
        >
          Debug
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 p-4 bg-background border rounded-lg shadow-lg max-w-md w-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">Debug Information</h3>
        <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
          Close
        </Button>
      </div>

      <Button onClick={fetchDebugInfo} disabled={loading} className="mb-4" size="sm">
        {loading ? "Loading..." : "Check Environment Variables"}
      </Button>

      {error && <div className="p-2 mb-4 bg-destructive/10 text-destructive rounded text-sm">Error: {error}</div>}

      {info && (
        <div className="text-xs overflow-auto max-h-60 p-2 bg-muted rounded">
          <pre>{JSON.stringify(info, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}
