import { Suspense } from "react"
import { NewOrderForm } from "@/components/dashboard/new-order-form"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { createServerActionClient } from "@/lib/supabase/server"
import { Loading } from "@/components/ui/loading"

export const metadata = {
  title: "New Order",
  description: "Create a new order",
}

async function getGuests() {
  const supabase = createServerActionClient()
  const { data, error } = await supabase.from("guests").select("id, name").order("name")

  if (error) {
    console.error("Error fetching guests:", error)
    return []
  }

  return data || []
}

async function getInventory() {
  const supabase = createServerActionClient()
  const { data, error } = await supabase.from("inventory").select("*").order("name")

  if (error) {
    console.error("Error fetching inventory:", error)
    return []
  }

  return data || []
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
