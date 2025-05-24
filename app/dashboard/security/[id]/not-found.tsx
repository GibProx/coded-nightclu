import Link from "next/link"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

export default function SecurityLogNotFound() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Security Incident Not Found"
        text="The requested security incident could not be found"
      />

      <div className="flex flex-col items-center justify-center py-12">
        <div className="rounded-full bg-yellow-100 p-4 mb-4">
          <AlertTriangle className="h-8 w-8 text-yellow-600" />
        </div>
        <h2 className="text-xl font-semibold mb-2">Security Incident Not Found</h2>
        <p className="text-muted-foreground mb-6 text-center max-w-md">
          The security incident you are looking for does not exist or has been removed.
        </p>
        <Link href="/dashboard/security">
          <Button>Return to Security Log</Button>
        </Link>
      </div>
    </DashboardShell>
  )
}
