"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Button } from "@/components/ui/button"
import { PlusIcon } from "lucide-react"
import { getStaffMembers } from "@/app/actions/staff-actions"
import { StaffTable } from "@/components/dashboard/staff-table"
import { Suspense } from "react"
import { ErrorBoundary } from "@/components/ui/error-boundary"

export default async function StaffPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Staff Management" text="Manage your staff and their schedules">
        <Button className="ml-auto" asChild>
          <a href="/dashboard/staff/new">
            <PlusIcon className="mr-2 h-4 w-4" />
            Add Staff
          </a>
        </Button>
      </DashboardHeader>

      <Tabs defaultValue="directory" className="space-y-4">
        <TabsList>
          <TabsTrigger value="directory">Directory</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="roles">Roles</TabsTrigger>
        </TabsList>

        <TabsContent value="directory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Staff Directory</CardTitle>
              <CardDescription>Complete list of all staff members and their contact information.</CardDescription>
            </CardHeader>
            <CardContent>
              <ErrorBoundary fallback={<StaffTableError />}>
                <Suspense fallback={<div>Loading staff members...</div>}>
                  <StaffTableWrapper />
                </Suspense>
              </ErrorBoundary>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Staff Schedule</CardTitle>
              <CardDescription>View and manage staff schedules and assignments.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <h3 className="text-lg font-medium">Schedule Management</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Staff schedule management will be implemented soon.
                </p>
              </div>
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
                <p className="text-sm text-muted-foreground mt-2">Staff role management will be implemented soon.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}

async function StaffTableWrapper() {
  const staffMembers = await getStaffMembers()
  return <StaffTable staff={staffMembers || []} />
}

function StaffTableError() {
  return (
    <div className="text-center py-8">
      <h3 className="text-lg font-medium text-destructive">Error Loading Staff</h3>
      <p className="text-sm text-muted-foreground mt-2">
        There was a problem loading the staff directory. Please try again later.
      </p>
      <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
        Try Again
      </Button>
    </div>
  )
}
