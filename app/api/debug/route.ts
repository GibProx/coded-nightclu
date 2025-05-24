import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json(
    {
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? "Defined" : "Not defined",
      supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Defined" : "Not defined",
      supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ? "Defined" : "Not defined",
      postgresUrl: process.env.POSTGRES_URL ? "Defined" : "Not defined",
      postgresPrismaUrl: process.env.POSTGRES_PRISMA_URL ? "Defined" : "Not defined",
      postgresUrlNonPooling: process.env.POSTGRES_URL_NON_POOLING ? "Defined" : "Not defined",
      postgresUser: process.env.POSTGRES_USER ? "Defined" : "Not defined",
      postgresPassword: process.env.POSTGRES_PASSWORD ? "Defined" : "Not defined",
      postgresDatabase: process.env.POSTGRES_DATABASE ? "Defined" : "Not defined",
      postgresHost: process.env.POSTGRES_HOST ? "Defined" : "Not defined",
    },
    { status: 200 },
  )
}
