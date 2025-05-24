import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { EventForm } from "@/components/dashboard/event-form"

export default function NewEventPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Create Event" text="Add a new event to your calendar" />
      <Card>
        <CardHeader>
          <CardTitle>Event Details</CardTitle>
          <CardDescription>Enter the details for your new event</CardDescription>
        </CardHeader>
        <CardContent>
          <EventForm />
        </CardContent>
      </Card>
    </DashboardShell>
  )
}
