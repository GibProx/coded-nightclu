import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Overview } from "@/components/dashboard/overview"
import { RecentBookings } from "@/components/dashboard/recent-bookings"
import { InventoryStatus } from "@/components/dashboard/inventory-status"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { RevenueCard } from "@/components/dashboard/revenue-card"
import { TablesBookedCard } from "@/components/dashboard/tables-booked-card"
import { GuestsTonightCard } from "@/components/dashboard/guests-tonight-card"

export const metadata = {
  title: "Dashboard",
  description: "Overview of your nightclub operations",
}

export default function DashboardPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Dashboard" text="Welcome to Coded Nightclub Management System" />
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <RevenueCard />
        <GuestsTonightCard />
        <TablesBookedCard />
      </div>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="w-full flex-wrap justify-start">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <Overview />
          <div className="grid gap-4 grid-cols-1 lg:grid-cols-7">
            <Card className="col-span-1 lg:col-span-4">
              <CardHeader>
                <CardTitle>Recent Bookings</CardTitle>
                <CardDescription>
                  {/* Update this to use real data */}
                  Recent reservations and bookings
                </CardDescription>
              </CardHeader>
              <CardContent className="overflow-auto">
                <RecentBookings />
              </CardContent>
            </Card>
            <Card className="col-span-1 lg:col-span-3">
              <CardHeader>
                <CardTitle>Inventory Status</CardTitle>
                <CardDescription>Current stock levels for top items.</CardDescription>
              </CardHeader>
              <CardContent>
                <InventoryStatus />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="bookings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Reservations & Bookings</CardTitle>
              <CardDescription>Manage all guest reservations and table bookings.</CardDescription>
            </CardHeader>
            <CardContent className="overflow-auto">
              <RecentBookings fullList={true} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="inventory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Management</CardTitle>
              <CardDescription>Track stock levels and manage supplier orders.</CardDescription>
            </CardHeader>
            <CardContent className="overflow-auto">
              <InventoryStatus fullList={true} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}
