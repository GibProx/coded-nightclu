import { createServerActionClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export async function requireAuth() {
  const supabase = createServerActionClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  return session
}

export async function requireAdminAuth() {
  const session = await requireAuth()
  const supabase = createServerActionClient()

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", session.user.id).single()

  if (profile?.role !== "admin") {
    redirect("/unauthorized")
  }

  return { session, profile }
}

export async function getCurrentUser() {
  const supabase = createServerActionClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return null
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", session.user.id).single()

  return { user: session.user, profile }
}
