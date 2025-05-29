import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, Shield, Users, Settings, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function UserManagementSetupPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Shield className="h-6 w-6" />
        <h1 className="text-3xl font-bold">User Management Setup Complete</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Setup Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Database Migration Complete
            </CardTitle>
            <CardDescription>All user management features are now available</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">User ID Field</span>
                <Badge variant="default">✓ Added</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">System Access Control</span>
                <Badge variant="default">✓ Added</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Role Management</span>
                <Badge variant="default">✓ Added</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Permissions System</span>
                <Badge variant="default">✓ Added</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Available Features */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Available Features
            </CardTitle>
            <CardDescription>What you can now do with user management</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">Create user accounts for staff</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">Assign roles (Admin, Manager, Staff, Viewer)</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">Configure granular permissions</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">Password management and resets</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">System access control</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Role Hierarchy */}
      <Card>
        <CardHeader>
          <CardTitle>User Role Hierarchy</CardTitle>
          <CardDescription>Understanding the different user roles and their capabilities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Badge variant="destructive" className="w-full justify-center">
                Admin
              </Badge>
              <ul className="text-xs space-y-1 text-muted-foreground">
                <li>• Full system access</li>
                <li>• Manage all users</li>
                <li>• All permissions</li>
                <li>• System configuration</li>
              </ul>
            </div>
            <div className="space-y-2">
              <Badge variant="secondary" className="w-full justify-center">
                Manager
              </Badge>
              <ul className="text-xs space-y-1 text-muted-foreground">
                <li>• Most features</li>
                <li>• Cannot manage users</li>
                <li>• Business operations</li>
                <li>• Analytics access</li>
              </ul>
            </div>
            <div className="space-y-2">
              <Badge variant="outline" className="w-full justify-center">
                Staff
              </Badge>
              <ul className="text-xs space-y-1 text-muted-foreground">
                <li>• Basic operations</li>
                <li>• Guest management</li>
                <li>• Reservations</li>
                <li>• Limited access</li>
              </ul>
            </div>
            <div className="space-y-2">
              <Badge variant="outline" className="w-full justify-center">
                Viewer
              </Badge>
              <ul className="text-xs space-y-1 text-muted-foreground">
                <li>• Read-only access</li>
                <li>• Dashboard viewing</li>
                <li>• Analytics only</li>
                <li>• No modifications</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Next Steps
          </CardTitle>
          <CardDescription>Get started with user management</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Button asChild className="h-auto p-4 flex-col items-start">
              <Link href="/dashboard/staff/new">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-4 w-4" />
                  <span className="font-medium">Create Your First User</span>
                </div>
                <p className="text-xs text-muted-foreground text-left">
                  Add a staff member with system access and configure their permissions
                </p>
              </Link>
            </Button>

            <Button variant="outline" asChild className="h-auto p-4 flex-col items-start">
              <Link href="/dashboard/staff">
                <div className="flex items-center gap-2 mb-2">
                  <Settings className="h-4 w-4" />
                  <span className="font-medium">Manage Existing Staff</span>
                </div>
                <p className="text-xs text-muted-foreground text-left">
                  Update existing staff members to enable system access
                </p>
              </Link>
            </Button>
          </div>

          <div className="pt-4 border-t">
            <Button variant="ghost" asChild className="w-full justify-between">
              <Link href="/dashboard/staff">
                Go to User Management
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
