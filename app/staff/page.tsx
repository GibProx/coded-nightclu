import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { StaffSchedule } from "@/components/dashboard/staff-schedule"
import { Button } from "@/components/ui/button"
import { PlusIcon } from "lucide-react"

export default function StaffPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Staff Management" text="Manage your staff and their schedules">
        <Button className="ml-auto">
          <PlusIcon className="mr-2 h-4 w-4" />
          Add Staff
        </Button>
      </DashboardHeader>

      <Tabs defaultValue="schedule" className="space-y-4">
        <TabsList>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="directory">Directory</TabsTrigger>
          <TabsTrigger value="roles">Roles</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="schedule" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Staff Schedule</CardTitle>
              <CardDescription>View and manage staff schedules and assignments.</CardDescription>
            </CardHeader>
            <CardContent>
              <StaffSchedule />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="directory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Staff Directory</CardTitle>
              <CardDescription>Complete list of all staff members and their contact information.</CardDescription>
            </CardHeader>
            <CardContent>
              <StaffSchedule />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Staff Roles & Permissions</CardTitle>
              <CardDescription>Manage staff roles, responsibilities, and system access.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <h3 className="text-lg font-medium">Role Management</h3>
                <p className="text-sm text-muted-foreground mt-2">Configure staff roles and access permissions.</p>
                <Button className="mt-4">Manage Roles</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Staff Performance</CardTitle>
              <CardDescription>Track staff performance metrics and evaluations.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <h3 className="text-lg font-medium">Performance Metrics</h3>
                <p className="text-sm text-muted-foreground mt-2">Staff performance tracking will be available soon.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}
