import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { EditOrderForm } from "@/components/dashboard/edit-order-form"
import { createServerClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"

interface EditOrderPageProps {
  params: {
    id: string
  }
}

export default async function EditOrderPage({ params }: EditOrderPageProps) {
  const { id } = params
  const supabase = createServerClient()

  // Fetch order with client, payment, and items information
  const { data: order, error } = await supabase
    .from("orders")
    .select(`
      *,
      client:client_id(id, name, email, phone),
      payment:payment_id(id, amount, payment_date, payment_method),
      items:order_items(
        id,
        inventory_id,
        quantity,
        unit_price,
        subtotal,
        inventory:inventory_id(id, name, category, unit)
      )
    `)
    .eq("id", id)
    .single()

  if (error || !order) {
    notFound()
  }

  // Fetch all clients for the dropdown
  const { data: clients } = await supabase.from("guests").select("id, name").order("name")

  // Fetch all inventory items for the dropdown
  const { data: inventory } = await supabase
    .from("inventory")
    .select("id, name, category, stock, unit, cost")
    .order("name")

  return (
    <DashboardShell>
      <DashboardHeader
        heading={`Edit Order #${order.id.substring(0, 8)}`}
        description="Modify order details and items."
      />
      <EditOrderForm order={order} clients={clients || []} inventory={inventory || []} />
    </DashboardShell>
  )
}
