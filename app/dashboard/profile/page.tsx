import { Suspense } from "react"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { requireAuth } from "@/lib/auth"
import { createServerActionClient } from "@/lib/supabase/server"
import { Loading } from "@/components/ui/loading"

// Profile content component that fetches user data
async function ProfileContent() {
  const session = await requireAuth()
  const supabase = createServerActionClient()

  // Get user data
  const { data: userData } = await supabase.auth.getUser()
  const userId = userData.user?.id

  // You can fetch additional user profile data from your database here
  // const { data: profileData } = await supabase.from("admin_profiles").select("*").eq("user_id", userId).single()

  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Manage your account settings and profile information.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <div className="text-sm font-medium text-muted-foreground">Email</div>
                <div className="text-base">{session.user.email}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">User ID</div>
                <div className="text-base">{session.user.id}</div>
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Role</div>
              <div className="text-base">Administrator</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export const metadata = {
  title: "Profile",
  description: "Manage your profile settings.",
}

export default function ProfilePage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Profile" text="Manage your account settings and preferences" />
      <Suspense fallback={<Loading className="h-[400px]" text="Loading profile..." />}>
        <ProfileContent />
      </Suspense>
    </DashboardShell>
  )
}
