"use server"

import { createServerActionClient } from "@/lib/supabase/server"
import { mockData } from "@/lib/mock-data"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import type { Guest } from "@/types/database"

// Schema for guest validation
const guestSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }).optional().nullable(),
  phone: z.string().optional().nullable(),
  status: z.string().default("Regular"),
  visits: z.coerce.number().int().default(0),
  last_visit: z.string().optional().nullable(),
  spend_total: z.coerce.number().default(0),
  notes: z.string().optional().nullable(),
})

// Helper to determine if we should use mock data
const useMockData = () => {
  try {
    const supabase = createServerActionClient()
    return !supabase
  } catch (error) {
    console.error("Error creating Supabase client:", error)
    return true
  }
}

// Get all guests
export async function getGuests() {
  const shouldUseMockData = useMockData()

  try {
    if (shouldUseMockData) {
      console.log("Using mock guest data")
      return mockData.guests
    }

    const supabase = createServerActionClient()
    if (!supabase) {
      console.log("Supabase client not available, using mock data")
      return mockData.guests
    }

    const { data, error } = await supabase.from("guests").select("*").order("name")

    if (error) {
      console.error("Error fetching guests:", error)
      return mockData.guests
    }

    return data || []
  } catch (error) {
    console.error("Failed to fetch guests:", error)
    return mockData.guests
  }
}

// Get guests by status
export async function getGuestsByStatus(status: string) {
  const shouldUseMockData = useMockData()

  try {
    if (shouldUseMockData) {
      console.log("Using mock guest data")
      return mockData.guests.filter((guest) => guest.status === status)
    }

    const supabase = createServerActionClient()
    if (!supabase) {
      console.log("Supabase client not available, using mock data")
      return mockData.guests.filter((guest) => guest.status === status)
    }

    const { data, error } = await supabase.from("guests").select("*").eq("status", status).order("name")

    if (error) {
      console.error(`Error fetching ${status} guests:`, error)
      return mockData.guests.filter((guest) => guest.status === status)
    }

    return data || []
  } catch (error) {
    console.error(`Failed to fetch ${status} guests:`, error)
    return mockData.guests.filter((guest) => guest.status === status)
  }
}

// Get a single guest by ID
export async function getGuestById(id: string): Promise<Guest | null> {
  const shouldUseMockData = useMockData()

  try {
    if (shouldUseMockData) {
      console.log("Using mock guest data")
      return mockData.guests.find((guest) => guest.id === id) || null
    }

    const supabase = createServerActionClient()
    if (!supabase) {
      console.log("Supabase client not available, using mock data")
      return mockData.guests.find((guest) => guest.id === id) || null
    }

    const { data, error } = await supabase.from("guests").select("*").eq("id", id).single()

    if (error) {
      console.error("Error fetching guest:", error)
      if (error.code === "PGRST116") {
        // Record not found
        return null
      }
      return mockData.guests.find((guest) => guest.id === id) || null
    }

    return data
  } catch (error) {
    console.error("Error fetching guest:", error)
    return mockData.guests.find((guest) => guest.id === id) || null
  }
}

// Create a new guest
export async function createGuest(formData: FormData) {
  const shouldUseMockData = useMockData()

  try {
    // Parse and validate form data
    const rawData = {
      name: formData.get("name") as string,
      email: (formData.get("email") as string) || null,
      phone: (formData.get("phone") as string) || null,
      status: formData.get("status") as string,
      visits: Number.parseInt((formData.get("visits") as string) || "0"),
      last_visit: (formData.get("last_visit") as string) || null,
      spend_total: Number.parseFloat((formData.get("spend_total") as string) || "0"),
      notes: (formData.get("notes") as string) || null,
    }

    // Validate the data
    const validatedData = guestSchema.parse(rawData)

    if (shouldUseMockData) {
      console.log("Using mock data for guest creation")
      // Simulate successful creation with mock data
      const newGuest = {
        id: crypto.randomUUID(),
        ...validatedData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      // Revalidate the guests page
      revalidatePath("/dashboard/guests")

      return { success: true, data: newGuest }
    }

    const supabase = createServerActionClient()
    if (!supabase) {
      console.log("Supabase client not available, using mock data")
      const newGuest = {
        id: crypto.randomUUID(),
        ...validatedData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      return { success: true, data: newGuest }
    }

    // Check if email is provided and if a guest with this email already exists
    if (validatedData.email) {
      const { data: existingGuest } = await supabase
        .from("guests")
        .select("id")
        .eq("email", validatedData.email)
        .maybeSingle()

      if (existingGuest) {
        return {
          success: false,
          error: "A guest with this email already exists",
        }
      }
    }

    // Insert the guest into the database
    const { data, error } = await supabase.from("guests").insert([validatedData]).select()

    if (error) {
      console.error("Error creating guest:", error)
      return { success: false, error: error.message }
    }

    // Revalidate the guests page to show the new guest
    revalidatePath("/dashboard/guests")

    // Return success instead of redirecting to allow for client-side error handling
    return { success: true, data: data[0] }
  } catch (error) {
    console.error("Error creating guest:", error)

    if (error instanceof z.ZodError) {
      const fieldErrors = error.flatten().fieldErrors
      const errorMessage = Object.entries(fieldErrors)
        .map(([key, errors]) => `${key}: ${errors?.join(", ")}`)
        .join("; ")

      return {
        success: false,
        error: `Validation error: ${errorMessage}`,
      }
    }

    return { success: false, error: "Failed to create guest" }
  }
}

// Update an existing guest
export async function updateGuest(formData: FormData) {
  const shouldUseMockData = useMockData()

  try {
    const id = formData.get("id") as string

    // Parse and validate form data
    const rawData = {
      id,
      name: formData.get("name") as string,
      email: (formData.get("email") as string) || null,
      phone: (formData.get("phone") as string) || null,
      status: formData.get("status") as string,
      visits: Number.parseInt((formData.get("visits") as string) || "0"),
      last_visit: (formData.get("last_visit") as string) || null,
      spend_total: Number.parseFloat((formData.get("spend_total") as string) || "0"),
      notes: (formData.get("notes") as string) || null,
    }

    // Validate the data
    const validatedData = guestSchema.parse(rawData)

    if (shouldUseMockData) {
      console.log("Using mock data for guest update")
      // Simulate successful update with mock data
      const updatedGuest = {
        id,
        ...validatedData,
        updated_at: new Date().toISOString(),
      }

      // Revalidate the guests page
      revalidatePath("/dashboard/guests")
      revalidatePath(`/dashboard/guests/${id}/edit`)

      return { success: true, data: updatedGuest }
    }

    const supabase = createServerActionClient()
    if (!supabase) {
      console.log("Supabase client not available, using mock data")
      const updatedGuest = {
        id,
        ...validatedData,
        updated_at: new Date().toISOString(),
      }
      return { success: true, data: updatedGuest }
    }

    // Check if email is provided and if a guest with this email already exists (excluding current guest)
    if (validatedData.email) {
      const { data: existingGuest } = await supabase
        .from("guests")
        .select("id")
        .eq("email", validatedData.email)
        .neq("id", id)
        .maybeSingle()

      if (existingGuest) {
        return {
          success: false,
          error: "Another guest with this email already exists",
        }
      }
    }

    // Update the guest in the database
    const { data, error } = await supabase.from("guests").update(validatedData).eq("id", id).select()

    if (error) {
      console.error("Error updating guest:", error)
      return { success: false, error: error.message }
    }

    // Revalidate the guests page to show the updated guest
    revalidatePath("/dashboard/guests")
    revalidatePath(`/dashboard/guests/${id}/edit`)

    // Return success instead of redirecting to allow for client-side error handling
    return { success: true, data: data[0] }
  } catch (error) {
    console.error("Error updating guest:", error)

    if (error instanceof z.ZodError) {
      const fieldErrors = error.flatten().fieldErrors
      const errorMessage = Object.entries(fieldErrors)
        .map(([key, errors]) => `${key}: ${errors?.join(", ")}`)
        .join("; ")

      return {
        success: false,
        error: `Validation error: ${errorMessage}`,
      }
    }

    return { success: false, error: "Failed to update guest" }
  }
}

// Delete a guest
export async function deleteGuest(id: string) {
  const shouldUseMockData = useMockData()

  try {
    if (shouldUseMockData) {
      console.log("Using mock data for guest deletion")
      // Simulate successful deletion

      // Revalidate the guests page
      revalidatePath("/dashboard/guests")

      return { success: true, message: "Guest deleted successfully" }
    }

    const supabase = createServerActionClient()
    if (!supabase) {
      console.log("Supabase client not available, using mock data")
      return { success: true, message: "Guest deleted successfully" }
    }

    // Check if guest has any reservations first
    const { data: reservations, error: reservationError } = await supabase
      .from("reservations")
      .select("id")
      .eq("guest_id", id)
      .limit(1)

    if (reservationError) {
      console.error("Error checking guest reservations:", reservationError)
      return { success: false, error: "Error checking if guest has reservations" }
    }

    if (reservations && reservations.length > 0) {
      return {
        success: false,
        error: "Cannot delete guest with existing reservations. Remove the reservations first.",
      }
    }

    // Check if guest has any payments
    const { data: payments, error: paymentsError } = await supabase
      .from("payments")
      .select("id")
      .eq("guest_id", id)
      .limit(1)

    if (paymentsError) {
      console.error("Error checking guest payments:", paymentsError)
      return { success: false, error: "Error checking if guest has payment records" }
    }

    if (payments && payments.length > 0) {
      return {
        success: false,
        error: "Cannot delete guest with payment records. Archive the guest instead.",
      }
    }

    // Delete the guest
    const { error } = await supabase.from("guests").delete().eq("id", id)

    if (error) {
      console.error("Error deleting guest:", error)
      return { success: false, error: error.message }
    }

    // Revalidate the guests page to remove the deleted guest
    revalidatePath("/dashboard/guests")

    return { success: true, message: "Guest deleted successfully" }
  } catch (error) {
    console.error("Error deleting guest:", error)
    return { success: false, error: "Failed to delete guest" }
  }
}

// Search for guests
export async function searchGuests(query: string) {
  const shouldUseMockData = useMockData()

  try {
    if (shouldUseMockData) {
      console.log("Using mock guest data for search")
      const filteredGuests = mockData.guests.filter(
        (guest) =>
          guest.name.toLowerCase().includes(query.toLowerCase()) ||
          (guest.email && guest.email.toLowerCase().includes(query.toLowerCase())) ||
          (guest.phone && guest.phone.toLowerCase().includes(query.toLowerCase())),
      )
      return { success: true, data: filteredGuests }
    }

    const supabase = createServerActionClient()
    if (!supabase) {
      console.log("Supabase client not available, using mock data")
      const filteredGuests = mockData.guests.filter(
        (guest) =>
          guest.name.toLowerCase().includes(query.toLowerCase()) ||
          (guest.email && guest.email.toLowerCase().includes(query.toLowerCase())) ||
          (guest.phone && guest.phone.toLowerCase().includes(query.toLowerCase())),
      )
      return { success: true, data: filteredGuests }
    }

    const { data, error } = await supabase
      .from("guests")
      .select("*")
      .or(`name.ilike.%${query}%,email.ilike.%${query}%,phone.ilike.%${query}%`)
      .order("name")
      .limit(20)

    if (error) {
      console.error("Error searching guests:", error)
      return { success: false, error: error.message, data: [] }
    }

    return { success: true, data: data || [] }
  } catch (error) {
    console.error("Error searching guests:", error)
    return { success: false, error: "Failed to search guests", data: [] }
  }
}
