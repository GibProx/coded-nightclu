import { Suspense } from "react"
import { getStaffMembers } from "@/app/actions/staff-actions"
import { StaffTable } from "@/components/dashboard/staff-table"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Button } from "@/components/ui/button"
import { UserPlus, Users, Shield, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"

async function StaffContent() {
  const staff = await getStaffMembers()

  // Check if user management fields exist
  const hasUserManagementFields = staff.some(
    (s) => s.hasOwnProperty("system_access") || s.hasOwnProperty("system_role") || s.hasOwnProperty("permissions"),
  )

  // Calculate user statistics (with fallbacks for missing fields)
  const totalUsers = staff.length
  const activeUsers = staff.filter((s) => s.active && (s.system_access ?? false)).length
  const adminUsers = staff.filter((s) => s.system_role === "admin").length
  const managerUsers = staff.filter((s) => s.system_role === "manager").length

  return (
    <div className="space-y-6">
      {/* Show setup alert if user management fields are missing */}
      {!hasUserManagementFields && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            User management features require database setup.
            <Button variant="link" className="p-0 h-auto ml-1" asChild>
              <a href="/dashboard/setup">Run database migration</a>
            </Button>
            to enable full user management capabilities.
          </AlertDescription>
        </Alert>
      )}

      {/* User Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">All staff members in system</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeUsers}</div>
            <p className="text-xs text-muted-foreground">Users with system access</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Administrators</CardTitle>
            <Badge variant="destructive" className="h-4 w-4 p-0 text-xs">
              A
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adminUsers}</div>
            <p className="text-xs text-muted-foreground">Full system access</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Managers</CardTitle>
            <Badge variant="secondary" className="h-4 w-4 p-0 text-xs">
              M
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{managerUsers}</div>
            <p className="text-xs text-muted-foreground">Management access</p>
          </CardContent>
        </Card>
      </div>

      {/* User Management Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage staff members and their system access permissions</CardDescription>
            </div>
            <Button asChild>
              <a href="/dashboard/staff/new">
                <UserPlus className="mr-2 h-4 w-4" />
                Add User
              </a>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <StaffTable staff={staff} />
        </CardContent>
      </Card>
    </div>
  )
}

export default function StaffPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="User Management" text="Manage staff members, user accounts, and system permissions." />
      <Suspense fallback={<div>Loading users...</div>}>
        <StaffContent />
      </Suspense>
    </DashboardShell>
  )
}
