import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

// Default values for development (these will be overridden by actual env vars when available)
const FALLBACK_SUPABASE_URL = "https://your-project-id.supabase.co"
const FALLBACK_SUPABASE_SERVICE_KEY = "your-service-role-key"

export function createServerActionClient() {
  const cookieStore = cookies()

  // Use environment variables if available, otherwise use fallbacks
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || FALLBACK_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || FALLBACK_SUPABASE_SERVICE_KEY

  try {
    return createServerClient(supabaseUrl, supabaseServiceKey, {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: any) {
          cookieStore.set({ name, value: "", ...options })
        },
      },
    })
  } catch (error) {
    console.error("Failed to create Supabase server client:", error)
    return null
  }
}
