import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { StaffForm } from "@/components/dashboard/staff-form"

export default function StaffNewPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Add Staff Member" text="Add a new staff member to your team." />
      <Card>
        <CardHeader>
          <CardTitle>Staff Details</CardTitle>
          <CardDescription>Enter the staff member's information below.</CardDescription>
        </CardHeader>
        <CardContent>
          <StaffForm />
        </CardContent>
      </Card>
    </DashboardShell>
  )
}
