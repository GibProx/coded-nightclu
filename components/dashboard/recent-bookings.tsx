"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ResponsiveTable } from "@/components/ui/responsive-table"

interface RecentBookingsProps {
  fullList?: boolean
}

export function RecentBookings({ fullList = false }: RecentBookingsProps) {
  const bookings = [
    {
      id: "B001",
      name: "Alex Johnson",
      email: "alex@example.com",
      type: "VIP",
      guests: 6,
      table: "VIP-3",
      time: "10:00 PM",
      status: "confirmed",
    },
    {
      id: "B002",
      name: "Samantha Lee",
      email: "sam@example.com",
      type: "Regular",
      guests: 4,
      table: "Main-12",
      time: "11:30 PM",
      status: "confirmed",
    },
    {
      id: "B003",
      name: "Michael Chen",
      email: "michael@example.com",
      type: "Birthday",
      guests: 8,
      table: "Booth-2",
      time: "9:30 PM",
      status: "pending",
    },
    {
      id: "B004",
      name: "Jessica Taylor",
      email: "jessica@example.com",
      type: "Regular",
      guests: 2,
      table: "Bar-5",
      time: "10:45 PM",
      status: "confirmed",
    },
    {
      id: "B005",
      name: "David Wilson",
      email: "david@example.com",
      type: "VIP",
      guests: 5,
      table: "VIP-1",
      time: "11:00 PM",
      status: "confirmed",
    },
  ]

  const displayBookings = fullList ? bookings : bookings.slice(0, 4)

  const columns = [
    {
      key: "guest",
      title: "Guest",
      render: (_, booking) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage alt={booking.name} />
            <AvatarFallback>{booking.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="grid gap-0.5">
            <div className="font-medium">{booking.name}</div>
            <div className="text-xs text-muted-foreground">{booking.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: "type",
      title: "Type",
      render: (value) => <Badge variant={value === "VIP" ? "destructive" : "outline"}>{value}</Badge>,
    },
    { key: "table", title: "Table" },
    { key: "time", title: "Time" },
    {
      key: "status",
      title: "Status",
      render: (value) => <Badge variant={value === "confirmed" ? "success" : "secondary"}>{value}</Badge>,
    },
    {
      key: "actions",
      title: "Actions",
      render: () => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            Edit
          </Button>
          <Button variant="ghost" size="sm">
            Cancel
          </Button>
        </div>
      ),
    },
  ]

  return (
    <ResponsiveTable
      data={displayBookings.map((booking) => ({
        ...booking,
        guest: booking,
      }))}
      columns={columns}
      emptyState={
        <div className="text-center py-8">
          <h3 className="text-lg font-medium">No bookings found</h3>
          <p className="text-sm text-muted-foreground mt-2">There are no bookings to display.</p>
        </div>
      }
    />
  )
}
