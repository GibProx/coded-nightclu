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
          <TabsTrigger value="all">All Events</TabsTrigger>
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
