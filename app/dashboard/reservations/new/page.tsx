import { getGuestsForDropdown } from "@/app/actions/reservation-actions"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { ReservationForm } from "@/components/dashboard/reservation-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const dynamic = "force-dynamic"

export default async function NewReservationPage() {
  const guests = await getGuestsForDropdown()

  return (
    <DashboardShell>
      <DashboardHeader heading="Create Reservation" text="Add a new reservation to the system" />
      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Reservation Details</CardTitle>
            <CardDescription>Enter the details for the new reservation</CardDescription>
          </CardHeader>
          <CardContent>
            <ReservationForm guests={guests} />
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}
