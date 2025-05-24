"use server"

import { createServerActionClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

// Type definitions
export interface TicketType {
  name: string
  price: number
  available: boolean
}

export interface TicketCategory {
  name: string
  description?: string
  tickets: TicketType[]
}

export interface TicketTemplate {
  id: string
  name: string
  description?: string
  categories: TicketCategory[]
  is_default: boolean
  created_at: string
  updated_at: string
}

// Get all ticket templates
export async function getTicketTemplates() {
  const supabase = createServerActionClient()

  try {
    const { data, error } = await supabase.from("ticket_templates").select("*").order("name", { ascending: true })

    if (error) {
      console.error("Error fetching ticket templates:", error)
      return []
    }

    // Parse the categories JSON if it's a string
    return (data || []).map((template) => ({
      ...template,
      categories: typeof template.categories === "string" ? JSON.parse(template.categories) : template.categories,
    }))
  } catch (error) {
    console.error("Error fetching ticket templates:", error)
    return []
  }
}

// Get a specific ticket template by ID
export async function getTicketTemplateById(id: string) {
  const supabase = createServerActionClient()

  try {
    const { data, error } = await supabase.from("ticket_templates").select("*").eq("id", id).single()

    if (error) {
      console.error("Error fetching ticket template:", error)
      return null
    }

    // Parse the categories JSON if it's a string
    return {
      ...data,
      categories: typeof data.categories === "string" ? JSON.parse(data.categories) : data.categories,
    }
  } catch (error) {
    console.error("Error fetching ticket template:", error)
    return null
  }
}

// Create a new ticket template
export async function createTicketTemplate(
  name: string,
  categories: TicketCategory[],
  description?: string,
  is_default = false,
) {
  const supabase = createServerActionClient()

  try {
    // If this is being set as default, unset any existing defaults
    if (is_default) {
      await supabase.from("ticket_templates").update({ is_default: false }).eq("is_default", true)
    }

    // Insert the new template
    const { data, error } = await supabase
      .from("ticket_templates")
      .insert([
        {
          name,
          description,
          categories: JSON.stringify(categories),
          is_default,
        },
      ])
      .select()

    if (error) {
      console.error("Error creating ticket template:", error)
      return { success: false, error: error.message }
    }

    revalidatePath("/dashboard/ticketing")
    return { success: true, data: data[0] }
  } catch (error) {
    console.error("Error creating ticket template:", error)
    return { success: false, error: "Failed to create ticket template" }
  }
}

// Update an existing ticket template
export async function updateTicketTemplate(
  id: string,
  name: string,
  categories: TicketCategory[],
  description?: string,
  is_default = false,
) {
  const supabase = createServerActionClient()

  try {
    // If this is being set as default, unset any existing defaults
    if (is_default) {
      await supabase.from("ticket_templates").update({ is_default: false }).eq("is_default", true)
    }

    // Update the template
    const { data, error } = await supabase
      .from("ticket_templates")
      .update({
        name,
        description,
        categories: JSON.stringify(categories),
        is_default,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()

    if (error) {
      console.error("Error updating ticket template:", error)
      return { success: false, error: error.message }
    }

    revalidatePath("/dashboard/ticketing")
    return { success: true, data: data[0] }
  } catch (error) {
    console.error("Error updating ticket template:", error)
    return { success: false, error: "Failed to update ticket template" }
  }
}

// Delete a ticket template
export async function deleteTicketTemplate(id: string) {
  const supabase = createServerActionClient()

  try {
    // Check if this was the default template
    const { data: template } = await supabase.from("ticket_templates").select("is_default").eq("id", id).single()

    // Delete the template
    const { error } = await supabase.from("ticket_templates").delete().eq("id", id)

    if (error) {
      console.error("Error deleting ticket template:", error)
      return { success: false, error: error.message }
    }

    // If this was the default template, set another one as default
    if (template && template.is_default) {
      const { data: templates } = await supabase.from("ticket_templates").select("id").limit(1)
      if (templates && templates.length > 0) {
        await supabase.from("ticket_templates").update({ is_default: true }).eq("id", templates[0].id)
      }
    }

    revalidatePath("/dashboard/ticketing")
    return { success: true }
  } catch (error) {
    console.error("Error deleting ticket template:", error)
    return { success: false, error: "Failed to delete ticket template" }
  }
}

// Initialize ticket templates with default data
export async function initializeTicketTemplates() {
  const supabase = createServerActionClient()

  try {
    // Check if any templates already exist
    const { data: existingTemplates, error: checkError } = await supabase.from("ticket_templates").select("id").limit(1)

    if (checkError) {
      // Table might not exist, create it
      const createTableSQL = `
        CREATE TABLE IF NOT EXISTS ticket_templates (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          name VARCHAR(255) NOT NULL,
          description TEXT,
          categories JSONB NOT NULL,
          is_default BOOLEAN DEFAULT false,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `

      const { error: createError } = await supabase.rpc("execute_sql", { sql: createTableSQL })

      if (createError) {
        // If execute_sql doesn't exist, try direct SQL
        const { error: directError } = await supabase.from("ticket_templates").insert([
          {
            name: "Standard Nightclub",
            description: "Standard ticket categories for nightclub events",
            categories: JSON.stringify([
              {
                name: "General Admission",
                description: "Regular entry tickets",
                tickets: [
                  { name: "Early Bird", price: 15, available: true },
                  { name: "Standard", price: 25, available: true },
                  { name: "Door Entry", price: 30, available: true },
                ],
              },
              {
                name: "VIP Experience",
                description: "Premium experience with special perks",
                tickets: [
                  { name: "VIP Entry", price: 50, available: true },
                  { name: "VIP + Drinks Package", price: 75, available: true },
                ],
              },
              {
                name: "Table Service",
                description: "Reserved tables with bottle service",
                tickets: [
                  { name: "Silver Table (4 people)", price: 200, available: true },
                  { name: "Gold Table (6 people)", price: 350, available: true },
                  { name: "Platinum Table (8 people)", price: 500, available: true },
                ],
              },
            ]),
            is_default: true,
          },
        ])

        if (directError) {
          console.error("Error creating ticket templates table:", directError)
          return { success: false, error: directError.message }
        }
      }
    } else if (!existingTemplates || existingTemplates.length === 0) {
      // Table exists but no templates, insert default templates
      const { error: insertError } = await supabase.from("ticket_templates").insert([
        {
          name: "Standard Nightclub",
          description: "Standard ticket categories for nightclub events",
          categories: JSON.stringify([
            {
              name: "General Admission",
              description: "Regular entry tickets",
              tickets: [
                { name: "Early Bird", price: 15, available: true },
                { name: "Standard", price: 25, available: true },
                { name: "Door Entry", price: 30, available: true },
              ],
            },
            {
              name: "VIP Experience",
              description: "Premium experience with special perks",
              tickets: [
                { name: "VIP Entry", price: 50, available: true },
                { name: "VIP + Drinks Package", price: 75, available: true },
              ],
            },
            {
              name: "Table Service",
              description: "Reserved tables with bottle service",
              tickets: [
                { name: "Silver Table (4 people)", price: 200, available: true },
                { name: "Gold Table (6 people)", price: 350, available: true },
                { name: "Platinum Table (8 people)", price: 500, available: true },
              ],
            },
          ]),
          is_default: true,
        },
        {
          name: "Special Event",
          description: "Ticket categories for special events and concerts",
          categories: JSON.stringify([
            {
              name: "General Admission",
              description: "Regular entry tickets",
              tickets: [
                { name: "Super Early Bird", price: 20, available: true },
                { name: "Early Bird", price: 30, available: true },
                { name: "Standard", price: 40, available: true },
                { name: "Last Minute", price: 50, available: true },
              ],
            },
            {
              name: "VIP Access",
              description: "Premium access with meet & greet",
              tickets: [
                { name: "VIP", price: 75, available: true },
                { name: "VIP + Meet & Greet", price: 120, available: true },
              ],
            },
            {
              name: "Premium Tables",
              description: "Premium tables with bottle service",
              tickets: [
                { name: "Stage View Table (4 people)", price: 300, available: true },
                { name: "Premium Table (6 people)", price: 500, available: true },
                { name: "Ultimate VIP Table (8 people)", price: 800, available: true },
              ],
            },
          ]),
          is_default: false,
        },
      ])

      if (insertError) {
        console.error("Error inserting default ticket templates:", insertError)
        return { success: false, error: insertError.message }
      }
    }

    revalidatePath("/dashboard/ticketing")
    return { success: true }
  } catch (error) {
    console.error("Error initializing ticket templates:", error)
    return { success: false, error: "Failed to initialize ticket templates" }
  }
}
