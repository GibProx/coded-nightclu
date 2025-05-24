"use server"

import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { createServerActionClient } from "@/lib/supabase/server"

// Schema for reservation validation
const reservationSchema = z.object({
  id: z.string().optional(),
  guest_id: z.string().uuid().optional().nullable(),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  party_size: z.coerce.number().min(1, "Party size must be at least 1"),
  table_number: z.string().optional().nullable(),
  type: z.string().min(1, "Reservation type is required"),
  status: z.string().min(1, "Status is required"),
  special_requests: z.string().optional().nullable(),
})

export type ReservationFormData = z.infer<typeof reservationSchema>

// Get all reservations
export async function getReservations() {
  const cookieStore = cookies()
  const supabase = createServerActionClient(cookieStore)

  const { data, error } = await supabase
    .from("reservations")
    .select(`
      *,
      guests:guest_id (
        id,
        name,
        email,
        phone
      )
    `)
    .order("date", { ascending: false })

  if (error) {
    console.error("Error fetching reservations:", error)
    return []
  }

  return data
}

// Get reservations by date range
export async function getReservationsByDateRange(startDate: string, endDate: string) {
  const cookieStore = cookies()
  const supabase = createServerActionClient(cookieStore)

  const { data, error } = await supabase
    .from("reservations")
    .select(`
      *,
      guests:guest_id (
        id,
        name,
        email,
        phone
      )
    `)
    .gte("date", startDate)
    .lte("date", endDate)
    .order("date", { ascending: true })
    .order("time", { ascending: true })

  if (error) {
    console.error("Error fetching reservations by date range:", error)
    return []
  }

  return data
}

// Get reservations for today
export async function getTodayReservations() {
  const today = new Date().toISOString().split("T")[0]
  return getReservationsByDateRange(today, today)
}

// Get upcoming reservations (from today onwards)
export async function getUpcomingReservations() {
  const today = new Date().toISOString().split("T")[0]
  const futureDate = new Date()
  futureDate.setDate(futureDate.getDate() + 30) // Next 30 days
  const future = futureDate.toISOString().split("T")[0]

  return getReservationsByDateRange(today, future)
}

// Get past reservations (before today)
export async function getPastReservations() {
  const cookieStore = cookies()
  const supabase = createServerActionClient(cookieStore)

  const today = new Date().toISOString().split("T")[0]

  const { data, error } = await supabase
    .from("reservations")
    .select(`
      *,
      guests:guest_id (
        id,
        name,
        email,
        phone
      )
    `)
    .lt("date", today)
    .order("date", { ascending: false })
    .limit(50)

  if (error) {
    console.error("Error fetching past reservations:", error)
    return []
  }

  return data
}

// Get reservation by ID
export async function getReservationById(id: string) {
  const cookieStore = cookies()
  const supabase = createServerActionClient(cookieStore)

  const { data, error } = await supabase
    .from("reservations")
    .select(`
      *,
      guests:guest_id (
        id,
        name,
        email,
        phone
      )
    `)
    .eq("id", id)
    .single()

  if (error) {
    console.error("Error fetching reservation:", error)
    return null
  }

  return data
}

// Create a new reservation
export async function createReservation(formData: FormData) {
  const cookieStore = cookies()
  const supabase = createServerActionClient(cookieStore)

  // Parse and validate form data
  const validatedFields = reservationSchema.safeParse({
    guest_id: formData.get("guest_id"),
    date: formData.get("date"),
    time: formData.get("time"),
    party_size: formData.get("party_size"),
    table_number: formData.get("table_number"),
    type: formData.get("type"),
    status: formData.get("status"),
    special_requests: formData.get("special_requests"),
  })

  // If validation fails, return errors
  if (!validatedFields.success) {
    return {
      success: false,
      message: "Invalid form data. Please check the fields and try again.",
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const reservationData = validatedFields.data

  // Check for table availability if table number is provided
  if (reservationData.table_number) {
    const { data: existingReservation, error: checkError } = await supabase
      .from("reservations")
      .select("id")
      .eq("date", reservationData.date)
      .eq("table_number", reservationData.table_number)
      .not("status", "eq", "cancelled")
      .maybeSingle()

    if (checkError) {
      console.error("Error checking table availability:", checkError)
      return {
        success: false,
        message: "Error checking table availability. Please try again.",
      }
    }

    if (existingReservation) {
      return {
        success: false,
        message: `Table ${reservationData.table_number} is already reserved for this date.`,
      }
    }
  }

  // Insert the new reservation
  const { data, error } = await supabase.from("reservations").insert([reservationData]).select()

  if (error) {
    console.error("Error creating reservation:", error)
    return {
      success: false,
      message: `Error creating reservation: ${error.message}`,
    }
  }

  revalidatePath("/dashboard/reservations")
  return {
    success: true,
    message: "Reservation created successfully",
    data: data[0],
  }
}

// Update an existing reservation
export async function updateReservation(formData: FormData) {
  const cookieStore = cookies()
  const supabase = createServerActionClient(cookieStore)

  // Parse and validate form data
  const validatedFields = reservationSchema.safeParse({
    id: formData.get("id"),
    guest_id: formData.get("guest_id"),
    date: formData.get("date"),
    time: formData.get("time"),
    party_size: formData.get("party_size"),
    table_number: formData.get("table_number"),
    type: formData.get("type"),
    status: formData.get("status"),
    special_requests: formData.get("special_requests"),
  })

  // If validation fails, return errors
  if (!validatedFields.success) {
    return {
      success: false,
      message: "Invalid form data. Please check the fields and try again.",
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { id, ...reservationData } = validatedFields.data

  if (!id) {
    return {
      success: false,
      message: "Reservation ID is required for updates",
    }
  }

  // Check for table availability if table number is provided (excluding this reservation)
  if (reservationData.table_number) {
    const { data: existingReservation, error: checkError } = await supabase
      .from("reservations")
      .select("id")
      .eq("date", reservationData.date)
      .eq("table_number", reservationData.table_number)
      .neq("id", id)
      .not("status", "eq", "cancelled")
      .maybeSingle()

    if (checkError) {
      console.error("Error checking table availability:", checkError)
      return {
        success: false,
        message: "Error checking table availability. Please try again.",
      }
    }

    if (existingReservation) {
      return {
        success: false,
        message: `Table ${reservationData.table_number} is already reserved for this date.`,
      }
    }
  }

  // Update the reservation
  const { data, error } = await supabase.from("reservations").update(reservationData).eq("id", id).select()

  if (error) {
    console.error("Error updating reservation:", error)
    return {
      success: false,
      message: `Error updating reservation: ${error.message}`,
    }
  }

  revalidatePath("/dashboard/reservations")
  return {
    success: true,
    message: "Reservation updated successfully",
    data: data[0],
  }
}

// Delete a reservation
export async function deleteReservation(id: string) {
  const cookieStore = cookies()
  const supabase = createServerActionClient(cookieStore)

  const { error } = await supabase.from("reservations").delete().eq("id", id)

  if (error) {
    console.error("Error deleting reservation:", error)
    return {
      success: false,
      message: `Error deleting reservation: ${error.message}`,
    }
  }

  revalidatePath("/dashboard/reservations")
  return {
    success: true,
    message: "Reservation deleted successfully",
  }
}

// Get all guests for the dropdown
export async function getGuestsForDropdown() {
  const cookieStore = cookies()
  const supabase = createServerActionClient(cookieStore)

  const { data, error } = await supabase.from("guests").select("id, name, email, phone").order("name")

  if (error) {
    console.error("Error fetching guests for dropdown:", error)
    return []
  }

  return data
}
