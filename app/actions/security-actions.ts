"use server"

import { revalidatePath } from "next/cache"
import { createServerActionClient } from "@/lib/supabase/server"
import { z } from "zod"

// Schema for security log validation
const securityLogSchema = z.object({
  id: z.string().optional(),
  timestamp: z.string().optional(),
  type: z.string().min(1, "Type is required"),
  location: z.string().min(1, "Location is required"),
  description: z.string().min(1, "Description is required"),
  status: z.string().default("pending"),
  assigned_to: z.string().optional().nullable(),
  resolved_at: z.string().optional().nullable(),
})

// Get all security logs
export async function getSecurityLogs() {
  try {
    const supabase = createServerActionClient()

    const { data, error } = await supabase
      .from("security_logs")
      .select(`
        *,
        staff:assigned_to (
          id,
          name
        )
      `)
      .order("timestamp", { ascending: false })

    if (error) {
      console.error("Error fetching security logs:", error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error fetching security logs:", error)
    return { success: false, error: "Failed to fetch security logs" }
  }
}

// Get security logs by status
export async function getSecurityLogsByStatus(status: string) {
  try {
    const supabase = createServerActionClient()

    const { data, error } = await supabase
      .from("security_logs")
      .select(`
        *,
        staff:assigned_to (
          id,
          name
        )
      `)
      .eq("status", status)
      .order("timestamp", { ascending: false })

    if (error) {
      console.error(`Error fetching ${status} security logs:`, error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error(`Error fetching ${status} security logs:`, error)
    return { success: false, error: `Failed to fetch ${status} security logs` }
  }
}

// Get a single security log by ID
export async function getSecurityLogById(id: string) {
  try {
    const supabase = createServerActionClient()

    const { data, error } = await supabase
      .from("security_logs")
      .select(`
        *,
        staff:assigned_to (
          id,
          name
        )
      `)
      .eq("id", id)
      .single()

    if (error) {
      console.error("Error fetching security log:", error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error fetching security log:", error)
    return { success: false, error: "Failed to fetch security log" }
  }
}

// Get staff for dropdown
export async function getStaffForDropdown() {
  try {
    const supabase = createServerActionClient()

    const { data, error } = await supabase.from("staff").select("id, name").eq("active", true).order("name")

    if (error) {
      console.error("Error fetching staff:", error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error fetching staff:", error)
    return { success: false, error: "Failed to fetch staff" }
  }
}

// Create a new security log
export async function createSecurityLog(formData: FormData) {
  try {
    const supabase = createServerActionClient()

    // Parse and validate form data
    const rawData = {
      type: formData.get("type") as string,
      location: formData.get("location") as string,
      description: formData.get("description") as string,
      status: formData.get("status") as string,
      assigned_to: (formData.get("assigned_to") as string) || null,
    }

    // If assigned_to is "none", set it to null
    if (rawData.assigned_to === "none") {
      rawData.assigned_to = null
    }

    // Validate data
    const validatedData = securityLogSchema.parse({
      ...rawData,
      timestamp: new Date().toISOString(),
    })

    // Insert into database
    const { data, error } = await supabase.from("security_logs").insert(validatedData).select()

    if (error) {
      console.error("Error creating security log:", error)
      return { success: false, error: error.message }
    }

    revalidatePath("/dashboard/security")
    return { success: true, data: data[0], message: "Security log created successfully" }
  } catch (error) {
    console.error("Error creating security log:", error)
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message }
    }
    return { success: false, error: "Failed to create security log" }
  }
}

// Update an existing security log
export async function updateSecurityLog(formData: FormData) {
  try {
    const supabase = createServerActionClient()

    const id = formData.get("id") as string

    // Parse and validate form data
    const rawData = {
      id,
      type: formData.get("type") as string,
      location: formData.get("location") as string,
      description: formData.get("description") as string,
      status: formData.get("status") as string,
      assigned_to: (formData.get("assigned_to") as string) || null,
    }

    // If assigned_to is "none", set it to null
    if (rawData.assigned_to === "none") {
      rawData.assigned_to = null
    }

    // If status changed to resolved, set resolved_at
    const currentStatus = formData.get("current_status") as string
    let resolved_at = null

    if (currentStatus !== "resolved" && rawData.status === "resolved") {
      resolved_at = new Date().toISOString()
    }

    // Validate data
    const validatedData = securityLogSchema.parse({
      ...rawData,
      resolved_at,
    })

    // Update in database
    const { data, error } = await supabase.from("security_logs").update(validatedData).eq("id", id).select()

    if (error) {
      console.error("Error updating security log:", error)
      return { success: false, error: error.message }
    }

    revalidatePath("/dashboard/security")
    return { success: true, data: data[0], message: "Security log updated successfully" }
  } catch (error) {
    console.error("Error updating security log:", error)
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message }
    }
    return { success: false, error: "Failed to update security log" }
  }
}

// Delete a security log
export async function deleteSecurityLog(id: string) {
  try {
    const supabase = createServerActionClient()

    const { error } = await supabase.from("security_logs").delete().eq("id", id)

    if (error) {
      console.error("Error deleting security log:", error)
      return { success: false, error: error.message }
    }

    revalidatePath("/dashboard/security")
    return { success: true, message: "Security log deleted successfully" }
  } catch (error) {
    console.error("Error deleting security log:", error)
    return { success: false, error: "Failed to delete security log" }
  }
}
