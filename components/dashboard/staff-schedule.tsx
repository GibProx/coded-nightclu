"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ResponsiveTable } from "@/components/ui/responsive-table"

export function StaffSchedule() {
  const staff = [
    {
      id: "S001",
      name: "John Smith",
      role: "Bartender",
      shift: "8:00 PM - 4:00 AM",
      status: "checked-in",
      location: "Main Bar",
    },
    {
      id: "S002",
      name: "Maria Garcia",
      role: "Security",
      shift: "9:00 PM - 5:00 AM",
      status: "checked-in",
      location: "Front Entrance",
    },
    {
      id: "S003",
      name: "Robert Johnson",
      role: "DJ",
      shift: "10:00 PM - 3:00 AM",
      status: "pending",
      location: "Main Floor",
    },
    {
      id: "S004",
      name: "Emily Davis",
      role: "Server",
      shift: "8:00 PM - 2:00 AM",
      status: "checked-in",
      location: "VIP Area",
    },
    {
      id: "S005",
      name: "James Wilson",
      role: "Manager",
      shift: "7:00 PM - 5:00 AM",
      status: "checked-in",
      location: "All Areas",
    },
    {
      id: "S006",
      name: "Sophia Martinez",
      role: "Bartender",
      shift: "9:00 PM - 3:00 AM",
      status: "checked-in",
      location: "Second Bar",
    },
    {
      id: "S007",
      name: "Daniel Thompson",
      role: "Security",
      shift: "9:00 PM - 5:00 AM",
      status: "pending",
      location: "Back Entrance",
    },
  ]

  const columns = [
    {
      key: "name",
      title: "Staff Member",
      render: (value, staff) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage alt={staff.name} />
            <AvatarFallback>{staff.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="font-medium">{staff.name}</div>
        </div>
      ),
    },
    { key: "role", title: "Role" },
    { key: "shift", title: "Shift" },
    { key: "location", title: "Location" },
    {
      key: "status",
      title: "Status",
      render: (value) => <Badge variant={value === "checked-in" ? "success" : "secondary"}>{value}</Badge>,
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
            Message
          </Button>
        </div>
      ),
    },
  ]

  return (
    <ResponsiveTable
      data={staff}
      columns={columns}
      emptyState={
        <div className="text-center py-8">
          <h3 className="text-lg font-medium">No staff scheduled</h3>
          <p className="text-sm text-muted-foreground mt-2">There are no staff members scheduled.</p>
        </div>
      }
    />
  )
}
