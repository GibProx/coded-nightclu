import { NextResponse } from "next/server"
import { createServerActionClient } from "@/lib/supabase/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const supabase = createServerActionClient()
  const id = params.id

  try {
    // Check if table exists first
    const { error: tableCheckError } = await supabase.from("ticket_templates").select("id").limit(1)

    // If the table doesn't exist, return empty data
    if (tableCheckError && tableCheckError.message.includes("does not exist")) {
      return NextResponse.json({
        id: "default",
        name: "Default Template",
        categories: [
          {
            name: "Standard Tickets",
            description: "Regular admission tickets",
            tickets: [
              { name: "General Admission", price: 25, available: true },
              { name: "VIP Entry", price: 50, available: true },
              { name: "Table Reservation", price: 300, available: true },
            ],
          },
        ],
      })
    }

    const { data, error } = await supabase.from("ticket_templates").select("*").eq("id", id).single()

    if (error) {
      console.error("Error fetching ticket template:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Parse the categories if it's a string
    if (data && typeof data.categories === "string") {
      data.categories = JSON.parse(data.categories)
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching ticket template:", error)
    return NextResponse.json({ error: "Failed to fetch ticket template" }, { status: 500 })
  }
}
