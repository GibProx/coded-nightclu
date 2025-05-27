"use server"

import { revalidatePath } from "next/cache"
import { createServerActionClient } from "@/lib/supabase/server"
import { z } from "zod"

// Schema for event validation
const eventSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Event name is required"),
  description: z.string().min(1, "Event description is required"),
  long_description: z.string().optional(),
  date: z.string().min(1, "Date is required"),
  start_time: z.string().min(1, "Start time is required"),
  end_time: z.string().min(1, "End time is required"),
  location: z.string().min(1, "Location is required"),
  capacity: z.coerce.number().min(1, "Capacity must be at least 1"),
  ticket_price: z.coerce.number().min(0, "Ticket price cannot be negative"),
  status: z.string().min(1, "Status is required"),
  dj: z.string().optional(),
  main_image: z.string().optional(),
  gallery_images: z.string().optional(),
  // Fatsoma integration fields
  external_ticketing: z.coerce.boolean().default(true),
  ticketing_provider: z.string().default("fatsoma"),
  fatsoma_event_id: z.string().optional(),
  fatsoma_url: z.string().optional(),
})

export type EventFormData = z.infer<typeof eventSchema>

// Get all events
export async function getEvents() {
  const supabase = createServerActionClient()

  try {
    const { data, error } = await supabase.from("events").select("*").order("date", { ascending: true })

    if (error) {
      console.error("Error fetching events:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error fetching events:", error)
    return []
  }
}

// Get upcoming events
export async function getUpcomingEvents() {
  const supabase = createServerActionClient()
  const today = new Date().toISOString().split("T")[0]

  try {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .gte("date", today)
      .order("date", { ascending: true })

    if (error) {
      console.error("Error fetching upcoming events:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error fetching upcoming events:", error)
    return []
  }
}

// Get past events
export async function getPastEvents() {
  const supabase = createServerActionClient()
  const today = new Date().toISOString().split("T")[0]

  try {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .lt("date", today)
      .order("date", { ascending: false })

    if (error) {
      console.error("Error fetching past events:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error fetching past events:", error)
    return []
  }
}

// Get events by status
export async function getEventsByStatus(status: string) {
  const supabase = createServerActionClient()

  try {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("status", status)
      .order("date", { ascending: true })

    if (error) {
      console.error(`Error fetching ${status} events:`, error)
      return []
    }

    return data || []
  } catch (error) {
    console.error(`Error fetching ${status} events:`, error)
    return []
  }
}

// Get event by ID
export async function getEventById(id: string) {
  const supabase = createServerActionClient()

  try {
    const { data, error } = await supabase.from("events").select("*").eq("id", id).single()

    if (error) {
      console.error("Error fetching event:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Error fetching event:", error)
    return null
  }
}

// Create a new event
export async function createEvent(formData: FormData) {
  const supabase = createServerActionClient()

  // Parse and validate form data
  const rawData = {
    name: formData.get("name") as string,
    description: formData.get("description") as string,
    long_description: (formData.get("long_description") as string) || "",
    date: formData.get("date") as string,
    start_time: formData.get("start_time") as string,
    end_time: formData.get("end_time") as string,
    location: formData.get("location") as string,
    capacity: Number(formData.get("capacity")),
    ticket_price: Number(formData.get("ticket_price")),
    status: formData.get("status") as string,
    dj: (formData.get("dj") as string) || "",
    main_image: (formData.get("main_image") as string) || "",
    gallery_images: (formData.get("gallery_images") as string) || "[]",
    external_ticketing: formData.get("external_ticketing") === "true",
    ticketing_provider: (formData.get("ticketing_provider") as string) || "fatsoma",
    fatsoma_event_id: (formData.get("fatsoma_event_id") as string) || "",
    fatsoma_url: (formData.get("fatsoma_url") as string) || "",
  }

  try {
    // Validate the data
    const validatedData = eventSchema.parse(rawData)

    // Create a clean object with only the fields that exist in the database
    const dataToInsert: Record<string, any> = {
      name: validatedData.name,
      description: validatedData.description,
      date: validatedData.date,
      start_time: validatedData.start_time,
      end_time: validatedData.end_time,
      location: validatedData.location,
      capacity: validatedData.capacity,
      ticket_price: validatedData.ticket_price,
      status: validatedData.status,
      external_ticketing: validatedData.external_ticketing,
      ticketing_provider: validatedData.ticketing_provider,
    }

    // Only add optional fields if they have values
    if (validatedData.dj) dataToInsert.dj = validatedData.dj
    if (validatedData.main_image) dataToInsert.main_image = validatedData.main_image
    if (validatedData.long_description) dataToInsert.long_description = validatedData.long_description
    if (validatedData.gallery_images) dataToInsert.gallery_images = validatedData.gallery_images
    if (validatedData.fatsoma_event_id) dataToInsert.fatsoma_event_id = validatedData.fatsoma_event_id
    if (validatedData.fatsoma_url) dataToInsert.fatsoma_url = validatedData.fatsoma_url

    // Insert into database
    try {
      const { data, error } = await supabase.from("events").insert([dataToInsert]).select()

      if (error) {
        // Check if the error is related to missing columns
        if (
          error.message.includes("external_ticketing") ||
          error.message.includes("fatsoma_") ||
          error.message.includes("ticketing_provider")
        ) {
          return {
            success: false,
            error: "Database schema needs to be updated. Please run the Fatsoma integration setup first.",
            needsSetup: true,
          }
        }
        console.error("Error creating event:", error)
        return { success: false, error: error.message }
      }

      // Revalidate the path but don't redirect here
      revalidatePath("/dashboard/ticketing")
      revalidatePath("/events")

      // Return success with the created event data
      return {
        success: true,
        data: data[0],
        message: "Event created successfully",
      }
    } catch (dbError: any) {
      console.error("Database error:", dbError)
      if (
        dbError.message &&
        (dbError.message.includes("external_ticketing") ||
          dbError.message.includes("fatsoma_") ||
          dbError.message.includes("ticketing_provider"))
      ) {
        return {
          success: false,
          error: "Database schema needs to be updated. Please run the Fatsoma integration setup first.",
          needsSetup: true,
        }
      }
      throw dbError
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const fieldErrors = error.flatten().fieldErrors
      const errorMessage = Object.entries(fieldErrors)
        .map(([key, errors]) => `${key}: ${errors?.join(", ")}`)
        .join("; ")
      return { success: false, error: errorMessage }
    }

    console.error("Error creating event:", error)
    return { success: false, error: "Failed to create event" }
  }
}

// Update an existing event
export async function updateEvent(formData: FormData) {
  const supabase = createServerActionClient()

  // Parse and validate form data
  const rawData = {
    id: formData.get("id") as string,
    name: formData.get("name") as string,
    description: formData.get("description") as string,
    long_description: (formData.get("long_description") as string) || "",
    date: formData.get("date") as string,
    start_time: formData.get("start_time") as string,
    end_time: formData.get("end_time") as string,
    location: formData.get("location") as string,
    capacity: Number(formData.get("capacity")),
    ticket_price: Number(formData.get("ticket_price")),
    status: formData.get("status") as string,
    dj: (formData.get("dj") as string) || "",
    main_image: (formData.get("main_image") as string) || "",
    gallery_images: (formData.get("gallery_images") as string) || "[]",
    external_ticketing: formData.get("external_ticketing") === "true",
    ticketing_provider: (formData.get("ticketing_provider") as string) || "fatsoma",
    fatsoma_event_id: (formData.get("fatsoma_event_id") as string) || "",
    fatsoma_url: (formData.get("fatsoma_url") as string) || "",
  }

  try {
    // Validate the data
    const validatedData = eventSchema.parse(rawData)
    const { id, ...rest } = validatedData

    if (!id) {
      return { success: false, error: "Event ID is required for updates" }
    }

    // Create a clean object with only the fields that exist in the database
    const dataToUpdate: Record<string, any> = {
      name: rest.name,
      description: rest.description,
      date: rest.date,
      start_time: rest.start_time,
      end_time: rest.end_time,
      location: rest.location,
      capacity: rest.capacity,
      ticket_price: rest.ticket_price,
      status: rest.status,
      external_ticketing: rest.external_ticketing,
      ticketing_provider: rest.ticketing_provider,
    }

    // Only add optional fields if they have values
    if (rest.dj) dataToUpdate.dj = rest.dj
    if (rest.main_image) dataToUpdate.main_image = rest.main_image
    if (rest.long_description) dataToUpdate.long_description = rest.long_description
    if (rest.gallery_images) dataToUpdate.gallery_images = rest.gallery_images
    if (rest.fatsoma_event_id) dataToUpdate.fatsoma_event_id = rest.fatsoma_event_id
    if (rest.fatsoma_url) dataToUpdate.fatsoma_url = rest.fatsoma_url

    // Update in database
    try {
      const { data, error } = await supabase.from("events").update(dataToUpdate).eq("id", id).select()

      if (error) {
        // Check if the error is related to missing columns
        if (
          error.message.includes("external_ticketing") ||
          error.message.includes("fatsoma_") ||
          error.message.includes("ticketing_provider")
        ) {
          return {
            success: false,
            error: "Database schema needs to be updated. Please run the Fatsoma integration setup first.",
            needsSetup: true,
          }
        }
        console.error("Error updating event:", error)
        return { success: false, error: error.message }
      }

      // Revalidate the path but don't redirect here
      revalidatePath("/dashboard/ticketing")
      revalidatePath("/events")
      revalidatePath(`/events/${id}`)

      // Return success with the updated event data
      return {
        success: true,
        data: data[0],
        message: "Event updated successfully",
      }
    } catch (dbError: any) {
      console.error("Database error:", dbError)
      if (
        dbError.message &&
        (dbError.message.includes("external_ticketing") ||
          dbError.message.includes("fatsoma_") ||
          dbError.message.includes("ticketing_provider"))
      ) {
        return {
          success: false,
          error: "Database schema needs to be updated. Please run the Fatsoma integration setup first.",
          needsSetup: true,
        }
      }
      throw dbError
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const fieldErrors = error.flatten().fieldErrors
      const errorMessage = Object.entries(fieldErrors)
        .map(([key, errors]) => `${key}: ${errors?.join(", ")}`)
        .join("; ")
      return { success: false, error: errorMessage }
    }

    console.error("Error updating event:", error)
    return { success: false, error: "Failed to update event" }
  }
}

// Delete an event
export async function deleteEvent(id: string) {
  const supabase = createServerActionClient()

  try {
    // Check if there are any tickets associated with this event
    const { data: tickets, error: ticketsError } = await supabase
      .from("tickets")
      .select("id")
      .eq("event_id", id)
      .limit(1)

    if (ticketsError) {
      console.error("Error checking tickets:", ticketsError)
      return { success: false, error: "Failed to check associated tickets" }
    }

    if (tickets && tickets.length > 0) {
      return {
        success: false,
        error:
          "Cannot delete event with associated tickets. Delete the tickets first or change the event status to cancelled.",
      }
    }

    // Delete the event
    const { error } = await supabase.from("events").delete().eq("id", id)

    if (error) {
      console.error("Error deleting event:", error)
      return { success: false, error: error.message }
    }

    revalidatePath("/dashboard/ticketing")
    revalidatePath("/events")
    return { success: true, message: "Event deleted successfully" }
  } catch (error) {
    console.error("Error deleting event:", error)
    return { success: false, error: "Failed to delete event" }
  }
}
