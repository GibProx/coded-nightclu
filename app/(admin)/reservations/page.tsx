"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { RecentBookings } from "@/components/dashboard/recent-bookings"
import { Button } from "@/components/ui/button"
import { CalendarIcon, PlusIcon } from "lucide-react"

export default function ReservationsPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Reservations" text="Manage guest reservations and table bookings">
        <Button className="ml-auto">
          <PlusIcon className="mr-2 h-4 w-4" />
          New Reservation
        </Button>
      </DashboardHeader>

      <Tabs defaultValue="upcoming" className="space-y-4">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Reservations</CardTitle>
              <CardDescription>View and manage all upcoming reservations.</CardDescription>
            </CardHeader>
            <CardContent>
              <RecentBookings fullList={true} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="today" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Today's Reservations</CardTitle>
              <CardDescription>All reservations scheduled for today.</CardDescription>
            </CardHeader>
            <CardContent>
              <RecentBookings fullList={true} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="past" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Past Reservations</CardTitle>
              <CardDescription>History of past reservations and attendance.</CardDescription>
            </CardHeader>
            <CardContent>
              <RecentBookings fullList={true} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Reservation Calendar</CardTitle>
              <CardDescription>View reservations in a calendar format.</CardDescription>
            </CardHeader>
            <CardContent className="flex h-[400px] items-center justify-center">
              <div className="flex flex-col items-center text-center">
                <CalendarIcon className="h-16 w-16 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">Calendar View</h3>
                <p className="mt-2 text-sm text-muted-foreground">Calendar integration will be available soon.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}
