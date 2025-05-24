import { NextResponse } from "next/server"
import { createServerActionClient } from "@/lib/supabase/server"

export async function GET() {
  const supabase = createServerActionClient()

  try {
    // First, check if the table exists
    const { error: tableCheckError } = await supabase.from("ticket_templates").select("id").limit(1)

    // If the table doesn't exist, create it
    if (tableCheckError && tableCheckError.message.includes("does not exist")) {
      // Execute the SQL to create the table
      const createTableSQL = `
        -- Create ticket_templates table if it doesn't exist
        CREATE TABLE IF NOT EXISTS ticket_templates (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          name VARCHAR(255) NOT NULL,
          categories TEXT NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        -- Insert default templates
        INSERT INTO ticket_templates (name, categories)
        VALUES (
          'Standard Nightclub', 
          '[{"name":"General Admission","description":"Regular entry tickets","tickets":[{"name":"Early Bird","price":15,"available":true},{"name":"Standard","price":25,"available":true},{"name":"Door Entry","price":30,"available":true}]},{"name":"VIP Experience","description":"Premium experience with special perks","tickets":[{"name":"VIP Entry","price":50,"available":true},{"name":"VIP + Drinks Package","price":75,"available":true}]},{"name":"Table Service","description":"Reserved tables with bottle service","tickets":[{"name":"Silver Table (4 people)","price":200,"available":true},{"name":"Gold Table (6 people)","price":350,"available":true},{"name":"Platinum Table (8 people)","price":500,"available":true}]}]'
        );
      `

      const { error: createError } = await supabase.rpc("execute_sql", { sql: createTableSQL })

      if (createError) {
        console.error("Error creating ticket_templates table:", createError)
        // Return empty array instead of error to prevent UI issues
        return NextResponse.json([])
      }

      // After creating the table, fetch the newly inserted data
      const { data: newData, error: newError } = await supabase
        .from("ticket_templates")
        .select("*")
        .order("name", { ascending: true })

      if (newError) {
        console.error("Error fetching new ticket templates:", newError)
        return NextResponse.json([])
      }

      return NextResponse.json(newData || [])
    }

    // If the table exists, fetch the data normally
    const { data, error } = await supabase.from("ticket_templates").select("*").order("name", { ascending: true })

    if (error) {
      console.error("Error fetching ticket templates:", error)
      return NextResponse.json([], { status: 200 }) // Return empty array instead of error
    }

    return NextResponse.json(data || [])
  } catch (error) {
    console.error("Error in ticket templates API:", error)
    return NextResponse.json([], { status: 200 }) // Return empty array instead of error
  }
}

export async function POST(request: Request) {
  const supabase = createServerActionClient()

  try {
    const body = await request.json()
    const { name, categories } = body

    if (!name || !categories) {
      return NextResponse.json({ error: "Name and categories are required" }, { status: 400 })
    }

    // Check if table exists first
    const { error: tableCheckError } = await supabase.from("ticket_templates").select("id").limit(1)

    // If the table doesn't exist, create it first
    if (tableCheckError && tableCheckError.message.includes("does not exist")) {
      const createTableSQL = `
        CREATE TABLE IF NOT EXISTS ticket_templates (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          name VARCHAR(255) NOT NULL,
          categories TEXT NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `

      const { error: createError } = await supabase.rpc("execute_sql", { sql: createTableSQL })

      if (createError) {
        console.error("Error creating ticket_templates table:", createError)
        return NextResponse.json({ error: "Failed to create ticket template table" }, { status: 500 })
      }
    }

    const { data, error } = await supabase
      .from("ticket_templates")
      .insert([
        {
          name,
          categories: typeof categories === "string" ? categories : JSON.stringify(categories),
        },
      ])
      .select()

    if (error) {
      console.error("Error creating ticket template:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data[0])
  } catch (error) {
    console.error("Error creating ticket template:", error)
    return NextResponse.json({ error: "Failed to create ticket template" }, { status: 500 })
  }
}
