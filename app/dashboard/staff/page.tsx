"use client"

import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { StaffTable } from "@/components/dashboard/staff-table"
import { getStaffMembers } from "@/app/actions/staff-actions"
import { Users, UserPlus, Shield, Eye, Settings, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

async function StaffContent() {
  try {
    const staff = await getStaffMembers()

    // Calculate user statistics
    const totalUsers = staff.length
    const activeUsers = staff.filter((s) => s.active).length
    const systemUsers = staff.filter((s) => s.system_access).length || 0
    const adminUsers = staff.filter((s) => s.system_role === "admin").length || 0
    const managerUsers = staff.filter((s) => s.system_role === "manager").length || 0
    const staffUsers = staff.filter((s) => s.system_role === "staff").length || 0
    const viewerUsers = staff.filter((s) => s.system_role === "viewer").length || 0

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6" />
            <h1 className="text-3xl font-bold">User Management</h1>
          </div>
          <Button asChild>
            <Link href="/dashboard/staff/new">
              <UserPlus className="mr-2 h-4 w-4" />
              Add User
            </Link>
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsers}</div>
              <p className="text-xs text-muted-foreground">All staff members</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeUsers}</div>
              <p className="text-xs text-muted-foreground">Currently active</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Access</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{systemUsers}</div>
              <p className="text-xs text-muted-foreground">Can log in</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Administrators</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{adminUsers}</div>
              <p className="text-xs text-muted-foreground">Full access</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Managers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{managerUsers}</div>
              <p className="text-xs text-muted-foreground">Management role</p>
            </CardContent>
          </Card>
        </div>

        {/* Role Overview */}
        <Card>
          <CardHeader>
            <CardTitle>User Role Distribution</CardTitle>
            <CardDescription>Overview of user roles and system access</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-2">
                  <Badge variant="destructive">Admin</Badge>
                  <span className="text-sm">Full Access</span>
                </div>
                <span className="font-bold">{adminUsers}</span>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Manager</Badge>
                  <span className="text-sm">Management</span>
                </div>
                <span className="font-bold">{managerUsers}</span>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Staff</Badge>
                  <span className="text-sm">Basic Access</span>
                </div>
                <span className="font-bold">{staffUsers}</span>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Viewer</Badge>
                  <span className="text-sm">Read Only</span>
                </div>
                <span className="font-bold">{viewerUsers}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Users</CardTitle>
            <CardDescription>Manage staff members and their system access</CardDescription>
          </CardHeader>
          <CardContent>
            <StaffTable staff={staff} />
          </CardContent>
        </Card>
      </div>
    )
  } catch (error) {
    console.error("Error in staff content:", error)
    return (
      <div className="space-y-6">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error loading staff data</AlertTitle>
          <AlertDescription>
            There was a problem loading the staff data. This could be due to a database connection issue or missing
            tables.
          </AlertDescription>
        </Alert>

        <Card>
          <CardHeader>
            <CardTitle>Staff Management</CardTitle>
            <CardDescription>
              Staff management requires database setup. Please ensure your database is properly configured.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              If this is your first time setting up the system, you may need to run the database migrations to create
              the necessary tables.
            </p>
            <div className="flex gap-4">
              <Button asChild>
                <Link href="/dashboard/setup">Run Database Setup</Link>
              </Button>
              <Button variant="outline" onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }
}

export default function StaffPage() {
  return (
    <Suspense fallback={<div>Loading user management...</div>}>
      <StaffContent />
    </Suspense>
  )
}
