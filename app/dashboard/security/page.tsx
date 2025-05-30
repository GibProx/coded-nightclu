import { Suspense } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Button } from "@/components/ui/button"
import { SecurityLogTable } from "@/components/dashboard/security-log-table"
import { getSecurityLogs, getSecurityLogsByStatus } from "@/app/actions/security-actions"
import { Plus } from "lucide-react"

// Force dynamic rendering
export const dynamic = "force-dynamic"

export default async function SecurityPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Security Log" text="Monitor and manage security incidents">
        <Link href="/dashboard/security/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Incident
          </Button>
        </Link>
      </DashboardHeader>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="w-full flex-wrap justify-start">
          <TabsTrigger value="all">All Incidents</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress</TabsTrigger>
          <TabsTrigger value="resolved">Resolved</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Incidents</CardTitle>
              <CardDescription>Complete log of all security incidents and their current status.</CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<div>Loading security logs...</div>}>
                <AllSecurityLogs />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Incidents</CardTitle>
              <CardDescription>Security incidents that require attention or follow-up.</CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<div>Loading pending incidents...</div>}>
                <StatusSecurityLogs status="pending" />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="in-progress" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>In Progress Incidents</CardTitle>
              <CardDescription>Security incidents that are currently being addressed.</CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<div>Loading in-progress incidents...</div>}>
                <StatusSecurityLogs status="in-progress" />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resolved" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Resolved Incidents</CardTitle>
              <CardDescription>Security incidents that have been addressed and resolved.</CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<div>Loading resolved incidents...</div>}>
                <StatusSecurityLogs status="resolved" />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}

async function AllSecurityLogs() {
  try {
    const result = await getSecurityLogs()
    const logs = result.success ? result.data : []
    return <SecurityLogTable data={logs} />
  } catch (error) {
    console.error("Error loading security logs:", error)
    return <div className="text-center py-4 text-muted-foreground">No security logs found.</div>
  }
}

async function StatusSecurityLogs({ status }: { status: string }) {
  try {
    const result = await getSecurityLogsByStatus(status)
    const logs = result.success ? result.data : []
    return <SecurityLogTable data={logs} />
  } catch (error) {
    console.error(`Error loading ${status} security logs:`, error)
    return <div className="text-center py-4 text-muted-foreground">No {status} incidents found.</div>
  }
}
