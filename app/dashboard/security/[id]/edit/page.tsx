import { notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { SecurityLogForm } from "@/components/dashboard/security-log-form"
import { getSecurityLogById, getStaffForDropdown } from "@/app/actions/security-actions"

interface EditSecurityLogPageProps {
  params: {
    id: string
  }
}

export default async function EditSecurityLogPage({ params }: EditSecurityLogPageProps) {
  // Fetch security log
  const securityLogResult = await getSecurityLogById(params.id)

  if (!securityLogResult.success || !securityLogResult.data) {
    notFound()
  }

  const securityLog = securityLogResult.data

  // Fetch staff for dropdown
  const staffResult = await getStaffForDropdown()
  const staff = staffResult.success ? staffResult.data : []

  return (
    <DashboardShell>
      <DashboardHeader heading="Edit Security Incident" text="Update the details of a security incident" />

      <Card>
        <CardHeader>
          <CardTitle>Incident Details</CardTitle>
          <CardDescription>Update the details of the security incident</CardDescription>
        </CardHeader>
        <CardContent>
          <SecurityLogForm securityLog={securityLog} staff={staff} />
        </CardContent>
      </Card>
    </DashboardShell>
  )
}
