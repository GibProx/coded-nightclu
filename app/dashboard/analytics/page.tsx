import { Suspense } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { RevenueAnalytics } from "@/components/analytics/revenue-analytics"
import { GuestAnalytics } from "@/components/analytics/guest-analytics"
import { EventAnalytics } from "@/components/analytics/event-analytics"
import { InventoryAnalytics } from "@/components/analytics/inventory-analytics"
import { StaffAnalytics } from "@/components/analytics/staff-analytics"
import { AnalyticsOverview } from "@/components/analytics/analytics-overview"
import { Skeleton } from "@/components/ui/skeleton"

export const metadata = {
  title: "Analytics",
  description: "Business intelligence and analytics for your nightclub",
}

function AnalyticsSkeleton() {
  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-[120px] mb-1" />
            <Skeleton className="h-4 w-[80px]" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default function AnalyticsPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Analytics" text="Business intelligence and performance metrics for your nightclub" />

      <Suspense fallback={<AnalyticsSkeleton />}>
        <AnalyticsOverview />
      </Suspense>

      <Tabs defaultValue="revenue" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="guests">Guests</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="staff">Staff</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-4">
          <Suspense fallback={<div>Loading revenue analytics...</div>}>
            <RevenueAnalytics />
          </Suspense>
        </TabsContent>

        <TabsContent value="guests" className="space-y-4">
          <Suspense fallback={<div>Loading guest analytics...</div>}>
            <GuestAnalytics />
          </Suspense>
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          <Suspense fallback={<div>Loading event analytics...</div>}>
            <EventAnalytics />
          </Suspense>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-4">
          <Suspense fallback={<div>Loading inventory analytics...</div>}>
            <InventoryAnalytics />
          </Suspense>
        </TabsContent>

        <TabsContent value="staff" className="space-y-4">
          <Suspense fallback={<div>Loading staff analytics...</div>}>
            <StaffAnalytics />
          </Suspense>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}
