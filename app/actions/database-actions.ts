"use server"

import { createServerActionClient } from "@/lib/supabase/server"

export async function executeSql(sqlString: string) {
  try {
    const supabase = createServerActionClient()

    // Execute the SQL directly using the PostgreSQL extension
    const { data, error } = await supabase.rpc("execute_sql", {
      query: sqlString,
    })

    if (error) {
      console.error("Error executing SQL:", error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error: any) {
    console.error("Error executing SQL:", error)
    return { success: false, error: error.message }
  }
}

// Add the missing setupDatabase export
export async function setupDatabase(sqlString: string) {
  return executeSql(sqlString)
}
