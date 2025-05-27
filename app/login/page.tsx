"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // Basic validation
      if (!email || !password) {
        setError("Please fill in all fields")
        return
      }

      if (password.length < 6) {
        setError("Password must be at least 6 characters")
        return
      }

      // Demo login for testing
      if (email === "admin@coded.com" && password === "admin123") {
        // Simulate loading
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Store simple session in localStorage for demo
        localStorage.setItem(
          "coded_admin_session",
          JSON.stringify({
            email: email,
            role: "admin",
            loginTime: Date.now(),
          }),
        )

        router.push("/dashboard")
        return
      }

      // Try Supabase authentication if available
      try {
        const { createClientClient } = await import("@/lib/supabase/client")
        const supabase = createClientClient()

        if (supabase) {
          const { data, error: authError } = await supabase.auth.signInWithPassword({
            email,
            password,
          })

          if (authError) {
            setError(authError.message)
            return
          }

          if (data.user) {
            router.push("/dashboard")
            return
          }
        }
      } catch (supabaseError) {
        console.warn("Supabase not available, using demo mode")
      }

      setError("Invalid credentials. Try admin@coded.com / admin123")
    } catch (error) {
      console.error("Login error:", error)
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">C</span>
          </div>
          <CardTitle className="text-2xl font-bold">CODED Admin</CardTitle>
          <CardDescription>Sign in to access the management dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@coded.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800 font-medium">Demo Credentials:</p>
            <p className="text-sm text-blue-600">Email: admin@coded.com</p>
            <p className="text-sm text-blue-600">Password: admin123</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
