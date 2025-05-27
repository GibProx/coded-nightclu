"use server"

import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { createServerActionClient } from "@/lib/supabase/server"

// Schema for client reservation validation
const clientReservationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(1, "Phone number is required"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  party_size: z.coerce.number().min(1, "Party size must be at least 1"),
  type: z.string().min(1, "Table type is required"),
  special_requests: z.string().optional(),
})

export type ClientReservationFormData = z.infer<typeof clientReservationSchema>

// Create a new client reservation
export async function createClientReservation(formData: FormData) {
  const cookieStore = cookies()
  const supabase = createServerActionClient(cookieStore)

  // Check if required tables exist
  try {
    const { data: tablesCheck } = await supabase
      .from("information_schema.tables")
      .select("table_name")
      .in("table_name", ["guests", "reservations"])

    console.log("Available tables:", tablesCheck)
  } catch (error) {
    console.error("Database connection error:", error)
    return {
      success: false,
      message: "Database connection error. Please contact support.",
    }
  }

  // Parse and validate form data
  const validatedFields = clientReservationSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    date: formData.get("date"),
    time: formData.get("time"),
    party_size: formData.get("party_size"),
    type: formData.get("type"),
    special_requests: formData.get("special_requests"),
  })

  // If validation fails, return errors
  if (!validatedFields.success) {
    console.error("Validation errors:", validatedFields.error.flatten().fieldErrors)
    return {
      success: false,
      message: "Invalid form data. Please check the fields and try again.",
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const reservationData = validatedFields.data
  console.log("Processing reservation data:", reservationData)

  try {
    // Step 1: Check if guest already exists by email
    let guestId = null

    console.log(`Checking if guest exists with email: ${reservationData.email}`)

    const { data: existingGuest, error: guestCheckError } = await supabase
      .from("guests")
      .select("id, name, email, phone")
      .eq("email", reservationData.email)
      .maybeSingle()

    if (guestCheckError && guestCheckError.code !== "PGRST116") {
      // PGRST116 is "not found" which is expected, other errors are problems
      console.error("Error checking existing guest:", guestCheckError)
      return {
        success: false,
        message: `Error checking guest information: ${guestCheckError.message}`,
      }
    }

    if (existingGuest) {
      // Guest exists - use existing guest ID
      guestId = existingGuest.id
      console.log(`Found existing guest with ID: ${guestId}`)

      // Optionally update guest info if it has changed
      const { error: updateError } = await supabase
        .from("guests")
        .update({
          name: reservationData.name,
          phone: reservationData.phone,
          updated_at: new Date().toISOString(),
        })
        .eq("id", guestId)

      if (updateError) {
        console.warn("Could not update guest info:", updateError)
        // Continue anyway - this is not critical
      }
    } else {
      // Guest doesn't exist - create new guest
      console.log(`Creating new guest for email: ${reservationData.email}`)

      const { data: newGuest, error: guestError } = await supabase
        .from("guests")
        .insert([
          {
            name: reservationData.name,
            email: reservationData.email,
            phone: reservationData.phone,
            source: "website_reservation",
            created_at: new Date().toISOString(),
          },
        ])
        .select("id")
        .single()

      if (guestError) {
        console.error("Error creating new guest:", guestError)
        return {
          success: false,
          message: `Error creating guest profile: ${guestError.message}. Please try again or contact support.`,
        }
      }

      guestId = newGuest.id
      console.log(`Successfully created new guest with ID: ${guestId}`)
    }

    // Step 2: Create the reservation linked to the guest
    console.log(`Creating reservation for guest ID: ${guestId}`)

    const { data: reservation, error: reservationError } = await supabase
      .from("reservations")
      .insert([
        {
          guest_id: guestId,
          date: reservationData.date,
          time: reservationData.time,
          party_size: reservationData.party_size,
          type: reservationData.type,
          status: "pending", // Always pending for client submissions
          special_requests: reservationData.special_requests || null,
          table_number: null, // Will be assigned by staff
          created_at: new Date().toISOString(),
        },
      ])
      .select(`
      *,
      guests:guest_id (
        id,
        name,
        email,
        phone
      )
    `)
      .single()

    if (reservationError) {
      console.error("Error creating reservation:", reservationError)
      return {
        success: false,
        message: `Error creating reservation: ${reservationError.message}`,
      }
    }

    console.log("Reservation created successfully:", reservation)

    // Step 3: Return success with guest and reservation info
    revalidatePath("/dashboard/reservations")
    return {
      success: true,
      message: "Reservation request submitted successfully! We'll contact you within 24 hours to confirm.",
      data: {
        reservation: reservation,
        guest: reservation.guests,
        isNewGuest: !existingGuest,
      },
    }
  } catch (error) {
    console.error("Unexpected error in reservation process:", error)
    return {
      success: false,
      message: "An unexpected error occurred. Please try again or contact support.",
    }
  }
}

// Get reservation status for client (optional - for future use)
export async function getClientReservationStatus(email: string) {
  const cookieStore = cookies()
  const supabase = createServerActionClient(cookieStore)

  const { data, error } = await supabase
    .from("reservations")
    .select(`
      *,
      guests:guest_id (
        name,
        email,
        phone
      )
    `)
    .eq("guests.email", email)
    .order("created_at", { ascending: false })
    .limit(5)

  if (error) {
    console.error("Error fetching client reservations:", error)
    return []
  }

  return data
}
