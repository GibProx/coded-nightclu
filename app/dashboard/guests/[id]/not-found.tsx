import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { UserX } from "lucide-react"
import Link from "next/link"

export default function GuestNotFound() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Guest Not Found"
        text="The guest you're looking for doesn't exist or has been removed"
      />
      <Card className="mx-auto max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <UserX className="h-12 w-12 text-muted-foreground" />
          </div>
          <CardTitle>Guest Not Found</CardTitle>
          <CardDescription>
            We couldn't find the guest you're looking for. They may have been removed from the system.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center text-muted-foreground">
          Please check the guest ID and try again, or return to the guest management page.
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button asChild>
            <Link href="/dashboard/guests">Return to Guest Management</Link>
          </Button>
        </CardFooter>
      </Card>
    </DashboardShell>
  )
}
