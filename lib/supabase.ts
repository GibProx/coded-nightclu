import { createClient } from "@supabase/supabase-js"

// Create a single supabase client for the entire server-side application
export const createServerSupabaseClient = () => {
  try {
    const supabaseUrl = process.env.SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseKey) {
      console.warn("Missing Supabase server environment variables, returning mock client")
      // Return a mock client that won't throw errors
      return {
        from: () => ({
          select: () => ({ data: [], error: null }),
          insert: () => ({ data: null, error: null }),
          update: () => ({ data: null, error: null }),
          delete: () => ({ data: null, error: null }),
          eq: () => ({ data: null, error: null }),
          single: () => ({ data: null, error: null }),
        }),
      }
    }

    return createClient(supabaseUrl, supabaseKey)
  } catch (error) {
    console.error("Error creating server Supabase client:", error)
    // Return a mock client that won't throw errors
    return {
      from: () => ({
        select: () => ({ data: [], error: null }),
        insert: () => ({ data: null, error: null }),
        update: () => ({ data: null, error: null }),
        delete: () => ({ data: null, error: null }),
        eq: () => ({ data: null, error: null }),
        single: () => ({ data: null, error: null }),
      }),
    }
  }
}

// Create a singleton client for the client-side
let clientSupabaseClient: ReturnType<typeof createClient> | null = null

export const createClientSupabaseClient = () => {
  try {
    if (clientSupabaseClient) return clientSupabaseClient

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn("Missing Supabase client environment variables, returning mock client")
      // Return a mock client that won't throw errors
      return {
        from: () => ({
          select: () => ({ data: [], error: null }),
          insert: () => ({ data: null, error: null }),
          update: () => ({ data: null, error: null }),
          delete: () => ({ data: null, error: null }),
          eq: () => ({ data: null, error: null }),
          single: () => ({ data: null, error: null }),
        }),
      } as any
    }

    clientSupabaseClient = createClient(supabaseUrl, supabaseAnonKey)
    return clientSupabaseClient
  } catch (error) {
    console.error("Error creating client Supabase client:", error)
    // Return a mock client that won't throw errors
    return {
      from: () => ({
        select: () => ({ data: [], error: null }),
        insert: () => ({ data: null, error: null }),
        update: () => ({ data: null, error: null }),
        delete: () => ({ data: null, error: null }),
        eq: () => ({ data: null, error: null }),
        single: () => ({ data: null, error: null }),
      }),
    } as any
  }
}
