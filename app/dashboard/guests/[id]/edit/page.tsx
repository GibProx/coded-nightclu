import { getGuestById } from "@/app/actions/guest-actions"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { GuestForm } from "@/components/dashboard/guest-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { notFound } from "next/navigation"

interface EditGuestPageProps {
  params: {
    id: string
  }
}

export default async function EditGuestPage({ params }: EditGuestPageProps) {
  const guest = await getGuestById(params.id)

  if (!guest) {
    notFound()
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Edit Guest" text={`Update information for ${guest.name}`} />
      <Card>
        <CardHeader>
          <CardTitle>Guest Information</CardTitle>
          <CardDescription>Update the details of this guest. All fields marked with * are required.</CardDescription>
        </CardHeader>
        <CardContent>
          <GuestForm guest={guest} />
        </CardContent>
      </Card>
    </DashboardShell>
  )
}
