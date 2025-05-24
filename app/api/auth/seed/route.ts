import { createServerActionClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

// Create initial admin user - should be run only in development or during initial setup
export async function GET(request: Request) {
  // Check for a secret key to prevent unauthorized access
  const { searchParams } = new URL(request.url)
  const secretKey = searchParams.get("key")

  if (secretKey !== process.env.ADMIN_SEED_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const supabase = createServerActionClient()

    // Check if admin user already exists
    const { data: existingUser } = await supabase.auth.admin.listUsers({
      filters: {
        email: "admin@nightclub.com",
      },
    })

    if (existingUser?.users && existingUser.users.length > 0) {
      return NextResponse.json({ message: "Admin user already exists" }, { status: 200 })
    }

    // Create admin user
    const { data, error } = await supabase.auth.admin.createUser({
      email: "admin@nightclub.com",
      password: "Admin123!",
      email_confirm: true,
      user_metadata: {
        role: "admin",
      },
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: "Admin user created successfully", userId: data.user.id }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
