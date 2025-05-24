import { notFound } from "next/navigation"

import { getGuestsForDropdown, getReservationById } from "@/app/actions/reservation-actions"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { ReservationForm } from "@/components/dashboard/reservation-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const dynamic = "force-dynamic"

interface EditReservationPageProps {
  params: {
    id: string
  }
}

export default async function EditReservationPage({ params }: EditReservationPageProps) {
  const reservation = await getReservationById(params.id)
  const guests = await getGuestsForDropdown()

  if (!reservation) {
    notFound()
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Edit Reservation" text="Update reservation details" />
      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Reservation Details</CardTitle>
            <CardDescription>Make changes to the reservation information</CardDescription>
          </CardHeader>
          <CardContent>
            <ReservationForm reservation={reservation} guests={guests} />
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}
