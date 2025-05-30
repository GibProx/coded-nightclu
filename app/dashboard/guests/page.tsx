import { getGuests, getGuestsByStatus } from "@/app/actions/guest-actions"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { GuestTable } from "@/components/dashboard/guest-table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusCircle } from "lucide-react"
import Link from "next/link"
import { Suspense } from "react"
import { Loading } from "@/components/ui/loading"

// Force dynamic rendering
export const dynamic = "force-dynamic"

export const metadata = {
  title: "Guest Management",
  description: "Manage guest information and preferences",
}

export default function GuestsPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Guest Management" text="View and manage guest information">
        <Button asChild>
          <Link href="/dashboard/guests/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Guest
          </Link>
        </Button>
      </DashboardHeader>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Guests</TabsTrigger>
          <TabsTrigger value="vip">VIP</TabsTrigger>
          <TabsTrigger value="regular">Regular</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Guest Directory</CardTitle>
              <CardDescription>Complete list of all registered guests and their details.</CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<Loading text="Loading guests..." />}>
                <AllGuestsTable />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vip" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>VIP Guests</CardTitle>
              <CardDescription>List of VIP guests and their special preferences.</CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<Loading text="Loading VIP guests..." />}>
                <VipGuestsTable />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="regular" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Regular Guests</CardTitle>
              <CardDescription>List of regular guests and their visit history.</CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<Loading text="Loading regular guests..." />}>
                <RegularGuestsTable />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}

async function AllGuestsTable() {
  try {
    const guests = await getGuests()
    return <GuestTable guests={Array.isArray(guests) ? guests : []} />
  } catch (error) {
    console.error("Error loading all guests:", error)
    return <GuestTable guests={[]} />
  }
}

async function VipGuestsTable() {
  try {
    const guests = await getGuestsByStatus("VIP")
    return <GuestTable guests={Array.isArray(guests) ? guests : []} />
  } catch (error) {
    console.error("Error loading VIP guests:", error)
    return <GuestTable guests={[]} />
  }
}

async function RegularGuestsTable() {
  try {
    const guests = await getGuestsByStatus("Regular")
    return <GuestTable guests={Array.isArray(guests) ? guests : []} />
  } catch (error) {
    console.error("Error loading regular guests:", error)
    return <GuestTable guests={[]} />
  }
}
