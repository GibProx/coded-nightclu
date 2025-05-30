import { Suspense } from "react"
import { NewOrderForm } from "@/components/dashboard/new-order-form"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { createServerActionClient } from "@/lib/supabase/server"
import { Loading } from "@/components/ui/loading"

// Force dynamic rendering
export const dynamic = "force-dynamic"

export const metadata = {
  title: "New Order",
  description: "Create a new order",
}

async function getGuests() {
  try {
    const supabase = createServerActionClient()
    if (!supabase) {
      console.warn("Supabase client not available, using mock data")
      return []
    }

    const { data, error } = await supabase.from("guests").select("id, name").order("name")

    if (error) {
      console.error("Error fetching guests:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error in getGuests:", error)
    return []
  }
}

async function getInventory() {
  try {
    const supabase = createServerActionClient()
    if (!supabase) {
      console.warn("Supabase client not available, using mock data")
      return []
    }

    const { data, error } = await supabase.from("inventory").select("*").order("name")

    if (error) {
      console.error("Error fetching inventory:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error in getInventory:", error)
    return []
  }
}

export default async function NewOrderPage() {
  const guests = await getGuests()
  const inventory = await getInventory()

  return (
    <DashboardShell>
      <DashboardHeader heading="Create New Order" text="Create a new order for a customer or for internal use." />
      <Suspense fallback={<Loading />}>
        <NewOrderForm guests={guests} inventory={inventory} />
      </Suspense>
    </DashboardShell>
  )
}
