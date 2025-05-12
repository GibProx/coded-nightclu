import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default function TicketingPage() {
  // Sample event data
  const events = [
    {
      id: "E001",
      name: "Friday Night Live",
      date: "2023-11-17",
      time: "10:00 PM - 4:00 AM",
      ticketsSold: 342,
      ticketsAvailable: 158,
      status: "on-sale",
    },
    {
      id: "E002",
      name: "Saturday Night Fever",
      date: "2023-11-18",
      time: "10:00 PM - 4:00 AM",
      ticketsSold: 425,
      ticketsAvailable: 75,
      status: "on-sale",
    },
    {
      id: "E003",
      name: "DJ Maxwell Showcase",
      date: "2023-11-24",
      time: "10:00 PM - 4:00 AM",
      ticketsSold: 280,
      ticketsAvailable: 220,
      status: "on-sale",
    },
    {
      id: "E004",
      name: "Electronic Music Festival",
      date: "2023-12-01",
      time: "8:00 PM - 6:00 AM",
      ticketsSold: 150,
      ticketsAvailable: 350,
      status: "on-sale",
    },
    {
      id: "E005",
      name: "New Year's Eve Celebration",
      date: "2023-12-31",
      time: "9:00 PM - 6:00 AM",
      ticketsSold: 420,
      ticketsAvailable: 80,
      status: "on-sale",
    },
  ]

  return (
    <DashboardShell>
      <DashboardHeader heading="Ticketing" text="Manage events and ticket sales">
        <Button className="ml-auto">Create Event</Button>
      </DashboardHeader>

      <Tabs defaultValue="events" className="space-y-4">
        <TabsList>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="sales">Ticket Sales</TabsTrigger>
          <TabsTrigger value="scanner">Ticket Scanner</TabsTrigger>
        </TabsList>

        <TabsContent value="events" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
              <CardDescription>Manage upcoming events and ticket availability.</CardDescription>
            </CardHeader>
            <CardContent>
              <EventTable events={events} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sales" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Ticket Sales</CardTitle>
              <CardDescription>Track ticket sales and revenue for all events.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Tickets Sold</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Average Price</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {events.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell className="font-medium">{event.name}</TableCell>
                      <TableCell>{event.date}</TableCell>
                      <TableCell>{event.ticketsSold}</TableCell>
                      <TableCell>${(event.ticketsSold * 25).toLocaleString()}</TableCell>
                      <TableCell>$25.00</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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

function EventTable({ events }: { events: any[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Event Name</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Time</TableHead>
          <TableHead>Tickets Sold</TableHead>
          <TableHead>Available</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {events.map((event) => (
          <TableRow key={event.id}>
            <TableCell className="font-medium">{event.name}</TableCell>
            <TableCell>{event.date}</TableCell>
            <TableCell>{event.time}</TableCell>
            <TableCell>{event.ticketsSold}</TableCell>
            <TableCell>{event.ticketsAvailable}</TableCell>
            <TableCell>
              <Badge variant="outline">{event.status}</Badge>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  Edit
                </Button>
                <Button variant="ghost" size="sm">
                  Manage
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
