import { getGuestById } from "@/app/actions/guest-actions"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, Edit, UserIcon, DollarSign, PhoneIcon, MailIcon, ClipboardList } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { formatDate } from "@/lib/utils"

interface ViewGuestPageProps {
  params: {
    id: string
  }
}

export default async function ViewGuestPage({ params }: ViewGuestPageProps) {
  const guest = await getGuestById(params.id)

  if (!guest) {
    notFound()
  }

  // Format the last visit date if it exists
  const formattedLastVisit = guest.last_visit ? formatDate(new Date(guest.last_visit)) : "Never"

  // Format the spend total
  const formattedSpendTotal = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(guest.spend_total)

  return (
    <DashboardShell>
      <DashboardHeader heading="Guest Details" text={`View information for ${guest.name}`}>
        <Button asChild>
          <Link href={`/dashboard/guests/${guest.id}/edit`}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Guest
          </Link>
        </Button>
      </DashboardHeader>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">{guest.name}</CardTitle>
                <CardDescription>Guest ID: {guest.id}</CardDescription>
              </div>
              <Badge variant={guest.status === "VIP" ? "default" : "secondary"} className="text-md px-3 py-1">
                {guest.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MailIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <h3 className="font-medium">Email</h3>
                    <p className="text-muted-foreground">{guest.email || "Not provided"}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <PhoneIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <h3 className="font-medium">Phone</h3>
                    <p className="text-muted-foreground">{guest.phone || "Not provided"}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <UserIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <h3 className="font-medium">Total Visits</h3>
                    <p className="text-muted-foreground">{guest.visits} visits</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CalendarIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <h3 className="font-medium">Last Visit</h3>
                    <p className="text-muted-foreground">{formattedLastVisit}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <DollarSign className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <h3 className="font-medium">Total Spend</h3>
                    <p className="text-muted-foreground">{formattedSpendTotal}</p>
                  </div>
                </div>
              </div>
            </div>

            {guest.notes && (
              <div className="pt-4">
                <div className="flex items-start space-x-3">
                  <ClipboardList className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <h3 className="font-medium">Notes</h3>
                    <p className="text-muted-foreground whitespace-pre-line">{guest.notes}</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" asChild>
              <Link href="/dashboard/guests">Back to Guests</Link>
            </Button>
            <div className="flex space-x-2">
              <Button variant="outline" asChild>
                <Link href={`/dashboard/reservations/new?guest=${guest.id}`}>Create Reservation</Link>
              </Button>
              <Button asChild>
                <Link href={`/dashboard/guests/${guest.id}/edit`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </Button>
            </div>
          </CardFooter>
        </Card>

        {/* We could add reservation history here in the future */}
      </div>
    </DashboardShell>
  )
}
