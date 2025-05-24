import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { GuestForm } from "@/components/dashboard/guest-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function NewGuestPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Add Guest" text="Create a new guest profile in the system" />
      <Card>
        <CardHeader>
          <CardTitle>Guest Information</CardTitle>
          <CardDescription>Enter the details of the new guest. All fields marked with * are required.</CardDescription>
        </CardHeader>
        <CardContent>
          <GuestForm />
        </CardContent>
      </Card>
    </DashboardShell>
  )
}
