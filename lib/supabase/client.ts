import { createBrowserClient } from "@supabase/ssr"

// Fallback values for development
const FALLBACK_SUPABASE_URL = "https://your-project-id.supabase.co"
const FALLBACK_SUPABASE_ANON_KEY = "your-anon-key"

export function createClientClient() {
  try {
    // Use environment variables if available, otherwise use fallbacks
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || FALLBACK_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || FALLBACK_SUPABASE_ANON_KEY

    // Check if we have valid environment variables
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.warn("Missing Supabase environment variables. Authentication may not work properly.")
      return null
    }

    return createBrowserClient(supabaseUrl, supabaseAnonKey)
  } catch (error) {
    console.error("Failed to create Supabase client:", error)
    return null
  }
}
