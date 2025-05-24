import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function OrdersSetupPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Orders Setup" description="Set up the orders module database tables and functions." />

      <Card>
        <CardHeader>
          <CardTitle>Orders Module Setup</CardTitle>
          <CardDescription>
            This will create the necessary database tables and functions for the orders module.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">The setup will create the following database objects:</p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>Orders table - Stores order information</li>
            <li>Order items table - Stores products included in each order</li>
            <li>Decrease inventory function - Updates inventory quantities when orders are paid</li>
            <li>Database indexes - Improves query performance</li>
          </ul>

          <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mt-6">
            <h3 className="text-amber-800 font-medium mb-2">Important Note</h3>
            <p className="text-amber-700">
              To set up the Orders module, please run the SQL script provided in the previous message directly in your
              database. Once you've run the script, you can return to the Orders page.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" asChild>
            <Link href="/dashboard/orders">Cancel</Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard/orders">Return to Orders</Link>
          </Button>
        </CardFooter>
      </Card>
    </DashboardShell>
  )
}
