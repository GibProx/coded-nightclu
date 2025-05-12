import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GuestTable } from "@/components/dashboard/guest-table"

export default function GuestsPage() {
  // Sample guest data
  const guests = [
    {
      id: "G001",
      name: "Alex Johnson",
      email: "alex@example.com",
      phone: "+1 (555) 123-4567",
      status: "VIP",
      visits: 12,
      lastVisit: "2023-11-10",
      spendTotal: "$2,450",
    },
    // Other guest data...
  ]

  return (
    <DashboardShell>
      <DashboardHeader heading="Guest Management" text="View and manage guest information" />

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
              <GuestTable guests={guests} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Other tabs content... */}
      </Tabs>
    </DashboardShell>
  )
}
