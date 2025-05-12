import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

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
    {
      id: "G002",
      name: "Samantha Lee",
      email: "sam@example.com",
      phone: "+1 (555) 987-6543",
      status: "Regular",
      visits: 8,
      lastVisit: "2023-11-12",
      spendTotal: "$1,280",
    },
    {
      id: "G003",
      name: "Michael Chen",
      email: "michael@example.com",
      phone: "+1 (555) 456-7890",
      status: "VIP",
      visits: 15,
      lastVisit: "2023-11-14",
      spendTotal: "$3,750",
    },
    {
      id: "G004",
      name: "Jessica Taylor",
      email: "jessica@example.com",
      phone: "+1 (555) 234-5678",
      status: "Regular",
      visits: 5,
      lastVisit: "2023-11-08",
      spendTotal: "$820",
    },
    {
      id: "G005",
      name: "David Wilson",
      email: "david@example.com",
      phone: "+1 (555) 876-5432",
      status: "VIP",
      visits: 20,
      lastVisit: "2023-11-15",
      spendTotal: "$4,200",
    },
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

        <TabsContent value="vip" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>VIP Guests</CardTitle>
              <CardDescription>List of VIP guests and their special preferences.</CardDescription>
            </CardHeader>
            <CardContent>
              <GuestTable guests={guests.filter((guest) => guest.status === "VIP")} />
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
              <GuestTable guests={guests.filter((guest) => guest.status === "Regular")} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}

function GuestTable({ guests }: { guests: any[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Guest</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Visits</TableHead>
          <TableHead>Last Visit</TableHead>
          <TableHead>Total Spend</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {guests.map((guest) => (
          <TableRow key={guest.id}>
            <TableCell>
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarImage alt={guest.name} />
                  <AvatarFallback>{guest.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="grid gap-0.5">
                  <div className="font-medium">{guest.name}</div>
                  <div className="text-xs text-muted-foreground">{guest.email}</div>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <Badge variant={guest.status === "VIP" ? "destructive" : "outline"}>{guest.status}</Badge>
            </TableCell>
            <TableCell>{guest.visits}</TableCell>
            <TableCell>{guest.lastVisit}</TableCell>
            <TableCell>{guest.spendTotal}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  View
                </Button>
                <Button variant="ghost" size="sm">
                  Edit
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
