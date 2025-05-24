import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { OrderDetails } from "@/components/dashboard/order-details"
import { createServerActionClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"

interface ViewOrderPageProps {
  params: {
    id: string
  }
}

export default async function ViewOrderPage({ params }: ViewOrderPageProps) {
  const { id } = params
  const supabase = createServerActionClient()

  if (!supabase) {
    throw new Error("Failed to create Supabase client")
  }

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
    console.error("Error fetching order:", error)
    notFound()
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading={`Order #${order.id.substring(0, 8)}`}
        description="View order details and manage status."
      />
      <OrderDetails order={order} />
    </DashboardShell>
  )
}
