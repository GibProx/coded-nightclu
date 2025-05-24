import Link from "next/link"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Button } from "@/components/ui/button"

export default function EventNotFound() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Event Not Found"
        text="The event you're looking for doesn't exist or has been removed."
      />
      <div className="flex flex-col items-center justify-center py-12">
        <h2 className="text-2xl font-bold mb-4">404 - Event Not Found</h2>
        <p className="text-muted-foreground mb-8">The event you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link href="/dashboard/ticketing">Return to Events</Link>
        </Button>
      </div>
    </DashboardShell>
  )
}
