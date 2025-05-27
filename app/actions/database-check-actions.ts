"use server"

import { cookies } from "next/headers"
import { createServerActionClient } from "@/lib/supabase/server"

export async function checkReservationTables() {
  const cookieStore = cookies()
  const supabase = createServerActionClient(cookieStore)

  try {
    // Check if guests table exists and has required columns
    const { data: guestsCheck, error: guestsError } = await supabase
      .from("guests")
      .select("id, name, email, phone")
      .limit(1)

    if (guestsError) {
      return {
        success: false,
        message: "Guests table not found or missing columns",
        error: guestsError.message,
        tables: { guests: false, reservations: false },
      }
    }

    // Check if reservations table exists and has required columns
    const { data: reservationsCheck, error: reservationsError } = await supabase
      .from("reservations")
      .select("id, guest_id, date, time, party_size, type, status")
      .limit(1)

    if (reservationsError) {
      return {
        success: false,
        message: "Reservations table not found or missing columns",
        error: reservationsError.message,
        tables: { guests: true, reservations: false },
      }
    }

    return {
      success: true,
      message: "All required tables are available",
      tables: { guests: true, reservations: true },
    }
  } catch (error) {
    console.error("Database check error:", error)
    return {
      success: false,
      message: "Database connection error",
      error: error instanceof Error ? error.message : "Unknown error",
      tables: { guests: false, reservations: false },
    }
  }
}
