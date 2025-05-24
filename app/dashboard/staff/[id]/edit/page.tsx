import { notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { StaffForm } from "@/components/dashboard/staff-form"
import { getStaffMember } from "@/app/actions/staff-actions"

interface StaffEditPageProps {
  params: {
    id: string
  }
}

export default async function StaffEditPage({ params }: StaffEditPageProps) {
  const staffMember = await getStaffMember(params.id)

  if (!staffMember) {
    notFound()
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Edit Staff Member" text="Update staff member information and settings." />
      <Card>
        <CardHeader>
          <CardTitle>Staff Details</CardTitle>
          <CardDescription>Edit the staff member's information below.</CardDescription>
        </CardHeader>
        <CardContent>
          <StaffForm initialData={staffMember} />
        </CardContent>
      </Card>
    </DashboardShell>
  )
}
