import { NextResponse } from "next/server"
import { createServerActionClient } from "@/lib/supabase/server"

export async function GET() {
  const supabase = createServerActionClient()

  try {
    // Create the ticket_templates table
    const createTableSQL = `
      -- Create ticket_templates table if it doesn't exist
      CREATE TABLE IF NOT EXISTS ticket_templates (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(255) NOT NULL,
        categories TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      
      -- Create trigger to update updated_at timestamp
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_trigger WHERE tgname = 'update_ticket_templates_modtime'
        ) THEN
          CREATE OR REPLACE FUNCTION update_modified_column()
          RETURNS TRIGGER AS $$
          BEGIN
              NEW.updated_at = NOW();
              RETURN NEW;
          END;
          $$ LANGUAGE plpgsql;
          
          CREATE TRIGGER update_ticket_templates_modtime
          BEFORE UPDATE ON ticket_templates
          FOR EACH ROW
          EXECUTE FUNCTION update_modified_column();
        END IF;
      END
      $$;
      
      -- Insert default templates if none exist
      INSERT INTO ticket_templates (name, categories)
      SELECT 
        'Standard Nightclub', 
        '[{"name":"General Admission","description":"Regular entry tickets","tickets":[{"name":"Early Bird","price":15,"available":true},{"name":"Standard","price":25,"available":true},{"name":"Door Entry","price":30,"available":true}]},{"name":"VIP Experience","description":"Premium experience with special perks","tickets":[{"name":"VIP Entry","price":50,"available":true},{"name":"VIP + Drinks Package","price":75,"available":true}]},{"name":"Table Service","description":"Reserved tables with bottle service","tickets":[{"name":"Silver Table (4 people)","price":200,"available":true},{"name":"Gold Table (6 people)","price":350,"available":true},{"name":"Platinum Table (8 people)","price":500,"available":true}]}]'
      WHERE NOT EXISTS (SELECT 1 FROM ticket_templates LIMIT 1);
    `

    const { error } = await supabase.rpc("execute_sql", { sql: createTableSQL })

    if (error) {
      console.error("Error setting up ticket_templates table:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "Ticket templates table created successfully" })
  } catch (error) {
    console.error("Error setting up ticket templates:", error)
    return NextResponse.json({ error: "Failed to set up ticket templates" }, { status: 500 })
  }
}
