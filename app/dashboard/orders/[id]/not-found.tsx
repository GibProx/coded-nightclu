import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function OrderNotFound() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Order Not Found"
        description="The order you're looking for doesn't exist or has been deleted."
      />
      <div className="flex flex-col items-center justify-center space-y-4 py-12">
        <p className="text-center text-muted-foreground">
          Please check the order ID and try again, or create a new order.
        </p>
        <Button asChild>
          <Link href="/dashboard/orders">Back to Orders</Link>
        </Button>
      </div>
    </DashboardShell>
  )
}
