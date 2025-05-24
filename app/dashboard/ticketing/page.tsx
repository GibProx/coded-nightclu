import { Suspense } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Button } from "@/components/ui/button"
import { EventTable } from "@/components/dashboard/event-table"
import { getEvents, getUpcomingEvents, getPastEvents, getEventsByStatus } from "@/app/actions/event-actions"

export default async function TicketingPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Ticketing" text="Manage events and ticket sales">
        <Button asChild className="ml-auto">
          <Link href="/dashboard/ticketing/new">Create Event</Link>
        </Button>
      </DashboardHeader>

      <Tabs defaultValue="events" className="space-y-4">
        <TabsList>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="sales">Ticket Sales</TabsTrigger>
          <TabsTrigger value="scanner">Ticket Scanner</TabsTrigger>
        </TabsList>

        <TabsContent value="events" className="space-y-4">
          <Tabs defaultValue="upcoming">
            <TabsList>
              <TabsTrigger value="all">All Events</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="past">Past</TabsTrigger>
              <TabsTrigger value="draft">Draft</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>All Events</CardTitle>
                  <CardDescription>View and manage all events.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Suspense fallback={<div>Loading events...</div>}>
                    <EventTableWrapper type="all" />
                  </Suspense>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="upcoming" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Events</CardTitle>
                  <CardDescription>View and manage upcoming events.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Suspense fallback={<div>Loading events...</div>}>
                    <EventTableWrapper type="upcoming" />
                  </Suspense>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="past" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Past Events</CardTitle>
                  <CardDescription>View past events.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Suspense fallback={<div>Loading events...</div>}>
                    <EventTableWrapper type="past" />
                  </Suspense>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="draft" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Draft Events</CardTitle>
                  <CardDescription>View and manage draft events.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Suspense fallback={<div>Loading events...</div>}>
                    <EventTableWrapper type="draft" />
                  </Suspense>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </TabsContent>

        <TabsContent value="sales" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Ticket Sales</CardTitle>
              <CardDescription>Track ticket sales and revenue for all events.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-8 text-muted-foreground">Ticket sales functionality coming soon.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scanner" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Ticket Scanner</CardTitle>
              <CardDescription>Scan and validate tickets at entry points.</CardDescription>
            </CardHeader>
            <CardContent className="flex h-[400px] items-center justify-center">
              <div className="flex flex-col items-center text-center">
                <div className="rounded-lg border border-dashed border-muted-foreground p-8">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-16 w-16 text-muted-foreground"
                  >
                    <rect width="18" height="18" x="3" y="3" rx="2" />
                    <path d="M8 7v10" />
                    <path d="M12 7v10" />
                    <path d="M16 7v10" />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-medium">Scan QR Code</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Use a camera to scan ticket QR codes for validation.
                </p>
                <Button className="mt-4">Enable Camera</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}

async function EventTableWrapper({ type }: { type: "all" | "upcoming" | "past" | "draft" }) {
  let events = []

  switch (type) {
    case "all":
      events = await getEvents()
      break
    case "upcoming":
      events = await getUpcomingEvents()
      break
    case "past":
      events = await getPastEvents()
      break
    case "draft":
      events = await getEventsByStatus("draft")
      break
  }

  return <EventTable events={events} />
}
