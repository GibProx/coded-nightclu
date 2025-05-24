import { createBrowserClient } from "@supabase/ssr"

// Default values for development (these will be overridden by actual env vars when available)
const FALLBACK_SUPABASE_URL = "https://your-project-id.supabase.co"
const FALLBACK_SUPABASE_ANON_KEY = "your-anon-key"

let supabaseClient: ReturnType<typeof createBrowserClient> | null = null

export function createClientClient() {
  // Use environment variables if available, otherwise use fallbacks
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || FALLBACK_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || FALLBACK_SUPABASE_ANON_KEY

  if (supabaseClient === null) {
    try {
      supabaseClient = createBrowserClient(supabaseUrl, supabaseAnonKey)
    } catch (error) {
      console.error("Failed to create Supabase client:", error)
      return null
    }
  }

  return supabaseClient
}
