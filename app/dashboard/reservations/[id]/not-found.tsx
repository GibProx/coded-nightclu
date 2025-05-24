import Link from "next/link"

import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function ReservationNotFound() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Reservation Not Found"
        text="The reservation you're looking for doesn't exist or has been removed."
      />
      <Card>
        <CardHeader>
          <CardTitle>Not Found</CardTitle>
          <CardDescription>We couldn't find the reservation you were looking for.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center space-y-2">
          <div className="text-6xl font-bold">404</div>
          <p className="text-center text-muted-foreground">
            The reservation may have been deleted or you might have followed an invalid link.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button asChild>
            <Link href="/dashboard/reservations">Return to Reservations</Link>
          </Button>
        </CardFooter>
      </Card>
    </DashboardShell>
  )
}
