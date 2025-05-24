import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"
import Link from "next/link"

export default function PaymentNotFound() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Payment Not Found" text="The requested payment could not be found." />
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          The payment you are looking for does not exist or you do not have permission to view it.
        </AlertDescription>
      </Alert>
      <div className="mt-4">
        <Button asChild>
          <Link href="/dashboard/payments">Back to Payments</Link>
        </Button>
      </div>
    </DashboardShell>
  )
}
