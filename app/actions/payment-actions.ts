"use server"

import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"

// Get all payments
export async function getPayments() {
  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)

  try {
    const { data, error } = await supabase
      .from("payments")
      .select("*, guest:guests(name)")
      .order("payment_date", { ascending: false })

    if (error) {
      console.error("Error fetching payments:", error)
      return { error: error.message, data: [] }
    }

    return { data, error: null }
  } catch (error) {
    console.error("Error in getPayments:", error)
    return { error: "Failed to fetch payments", data: [] }
  }
}

// Get a single payment by ID
export async function getPaymentById(id: string) {
  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)

  try {
    const { data, error } = await supabase.from("payments").select("*, guest:guests(id, name)").eq("id", id).single()

    if (error) {
      console.error("Error fetching payment:", error)
      return { error: error.message, data: null }
    }

    return { data, error: null }
  } catch (error) {
    console.error("Error in getPaymentById:", error)
    return { error: "Failed to fetch payment", data: null }
  }
}

// Create a new payment
export async function createPayment(formData: FormData) {
  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)

  try {
    // Extract form data
    const guestId = formData.get("guest_id") as string
    const amount = Number.parseFloat(formData.get("amount") as string)
    const paymentDate = formData.get("payment_date") as string
    const paymentMethod = formData.get("payment_method") as string
    const status = formData.get("status") as string
    const items = formData.get("items") as string

    // Validate data
    if (isNaN(amount) || amount <= 0) {
      return { error: "Amount must be a positive number", data: null }
    }

    if (!paymentDate || !paymentMethod || !status) {
      return { error: "Missing required fields", data: null }
    }

    // Create payment in database
    const { data, error } = await supabase
      .from("payments")
      .insert({
        guest_id: guestId === "none" ? null : guestId,
        amount,
        payment_date: paymentDate,
        payment_method: paymentMethod,
        status,
        items: items || null,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating payment:", error)
      return { error: error.message, data: null }
    }

    revalidatePath("/dashboard/payments")
    return { data, error: null }
  } catch (error) {
    console.error("Error in createPayment:", error)
    return { error: "Failed to create payment", data: null }
  }
}

// Update an existing payment
export async function updatePayment(formData: FormData) {
  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)

  try {
    // Extract form data
    const id = formData.get("id") as string
    const guestId = formData.get("guest_id") as string
    const amount = Number.parseFloat(formData.get("amount") as string)
    const paymentDate = formData.get("payment_date") as string
    const paymentMethod = formData.get("payment_method") as string
    const status = formData.get("status") as string
    const items = formData.get("items") as string

    // Validate data
    if (!id) {
      return { error: "Payment ID is required", data: null }
    }

    if (isNaN(amount) || amount <= 0) {
      return { error: "Amount must be a positive number", data: null }
    }

    if (!paymentDate || !paymentMethod || !status) {
      return { error: "Missing required fields", data: null }
    }

    // Update payment in database
    const { data, error } = await supabase
      .from("payments")
      .update({
        guest_id: guestId === "none" ? null : guestId,
        amount,
        payment_date: paymentDate,
        payment_method: paymentMethod,
        status,
        items: items || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Error updating payment:", error)
      return { error: error.message, data: null }
    }

    revalidatePath("/dashboard/payments")
    return { data, error: null }
  } catch (error) {
    console.error("Error in updatePayment:", error)
    return { error: "Failed to update payment", data: null }
  }
}

// Delete a payment
export async function deletePayment(id: string) {
  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)

  try {
    const { error } = await supabase.from("payments").delete().eq("id", id)

    if (error) {
      console.error("Error deleting payment:", error)
      return { error: error.message, success: false }
    }

    revalidatePath("/dashboard/payments")
    return { success: true, error: null }
  } catch (error) {
    console.error("Error in deletePayment:", error)
    return { error: "Failed to delete payment", success: false }
  }
}

// Get all guests for dropdown selection
export async function getGuestsForSelect() {
  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)

  try {
    const { data, error } = await supabase.from("guests").select("id, name").order("name")

    if (error) {
      console.error("Error fetching guests:", error)
      return { error: error.message, data: [] }
    }

    return { data, error: null }
  } catch (error) {
    console.error("Error in getGuestsForSelect:", error)
    return { error: "Failed to fetch guests", data: [] }
  }
}
