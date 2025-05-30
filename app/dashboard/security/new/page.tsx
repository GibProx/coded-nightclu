export const dynamic = "force-dynamic";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { SecurityLogForm } from "@/components/dashboard/security-log-form"
import { getStaffForDropdown } from "@/app/actions/security-actions"

export default async function NewSecurityLogPage() {
  // Fetch staff for dropdown
  const staffResult = await getStaffForDropdown()
  const staff = staffResult.success ? staffResult.data : []

  return (
    <DashboardShell>
      <DashboardHeader heading="New Security Incident" text="Create a new security incident report" />

      <Card>
        <CardHeader>
          <CardTitle>Incident Details</CardTitle>
          <CardDescription>Enter the details of the security incident</CardDescription>
        </CardHeader>
        <CardContent>
          <SecurityLogForm staff={staff} />
        </CardContent>
      </Card>
    </DashboardShell>
  )
}
