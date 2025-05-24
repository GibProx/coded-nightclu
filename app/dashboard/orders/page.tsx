import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PlusCircle } from "lucide-react"
import { OrdersTable } from "@/components/dashboard/orders-table"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createServerActionClient } from "@/lib/supabase/server"

export default async function OrdersPage() {
  const supabase = createServerActionClient()

  try {
    // Check if orders table exists by trying to query it
    const { data: tableCheck, error: tableError } = await supabase.from("orders").select("id").limit(1).maybeSingle()

    // If we get a specific error about the relation not existing, the table doesn't exist
    const tableExists = !(tableError && tableError.code === "42P01")

    if (tableError && tableError.code !== "42P01") {
      // This is an unexpected error, not just the table missing
      throw new Error(`Error checking orders table: ${tableError.message}`)
    }

    if (!tableExists) {
      return (
        <DashboardShell>
          <DashboardHeader heading="Orders" description="Manage orders for products and services.">
            <Link href="/dashboard/orders/setup">
              <Button>Set Up Orders Module</Button>
            </Link>
          </DashboardHeader>

          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Setup Required</AlertTitle>
            <AlertDescription>
              The orders module needs to be set up before you can use it. Click the button above to set up the required
              database tables.
            </AlertDescription>
          </Alert>
        </DashboardShell>
      )
    }

    // Fetch orders
    const { data: orders, error: ordersError } = await supabase
      .from("orders")
      .select(`
        *,
        client:client_id(id, name),
        payment:payment_id(id, amount, payment_method)
      `)
      .order("order_date", { ascending: false })

    if (ordersError) {
      throw new Error(`Error fetching orders: ${ordersError.message}`)
    }

    return (
      <DashboardShell>
        <DashboardHeader heading="Orders" description="Manage orders for products and services.">
          <Link href="/dashboard/orders/new">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Order
            </Button>
          </Link>
        </DashboardHeader>

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Orders</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
            <TabsTrigger value="delivered">Delivered</TabsTrigger>
            <TabsTrigger value="paid">Paid</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="space-y-4">
            <OrdersTable initialOrders={orders || []} status="all" />
          </TabsContent>
          <TabsContent value="pending" className="space-y-4">
            <OrdersTable initialOrders={orders?.filter((order) => order.status === "pending") || []} status="pending" />
          </TabsContent>
          <TabsContent value="confirmed" className="space-y-4">
            <OrdersTable
              initialOrders={orders?.filter((order) => order.status === "confirmed") || []}
              status="confirmed"
            />
          </TabsContent>
          <TabsContent value="delivered" className="space-y-4">
            <OrdersTable
              initialOrders={orders?.filter((order) => order.status === "delivered") || []}
              status="delivered"
            />
          </TabsContent>
          <TabsContent value="paid" className="space-y-4">
            <OrdersTable initialOrders={orders?.filter((order) => order.status === "paid") || []} status="paid" />
          </TabsContent>
          <TabsContent value="cancelled" className="space-y-4">
            <OrdersTable
              initialOrders={orders?.filter((order) => order.status === "cancelled") || []}
              status="cancelled"
            />
          </TabsContent>
        </Tabs>
      </DashboardShell>
    )
  } catch (error: any) {
    console.error("Error in OrdersPage:", error)
    return (
      <DashboardShell>
        <DashboardHeader heading="Orders" description="Manage orders for products and services." />
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      </DashboardShell>
    )
  }
}
