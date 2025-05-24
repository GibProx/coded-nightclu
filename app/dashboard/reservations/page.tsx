import { Suspense } from "react"
import Link from "next/link"
import { PlusIcon } from "lucide-react"

import {
  getReservations,
  getTodayReservations,
  getUpcomingReservations,
  getPastReservations,
} from "@/app/actions/reservation-actions"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { ReservationTable } from "@/components/dashboard/reservation-table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const dynamic = "force-dynamic"

export default async function ReservationsPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Reservations" text="Manage guest reservations and table bookings">
        <Button asChild className="ml-auto">
          <Link href="/dashboard/reservations/new">
            <PlusIcon className="mr-2 h-4 w-4" />
            New Reservation
          </Link>
        </Button>
      </DashboardHeader>

      <Tabs defaultValue="upcoming" className="space-y-4">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
          <TabsTrigger value="all">All Reservations</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Reservations</CardTitle>
              <CardDescription>View and manage all upcoming reservations.</CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<div>Loading upcoming reservations...</div>}>
                <UpcomingReservations />
              </Suspense>
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
              <Suspense fallback={<div>Loading today's reservations...</div>}>
                <TodayReservations />
              </Suspense>
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
              <Suspense fallback={<div>Loading past reservations...</div>}>
                <PastReservations />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Reservations</CardTitle>
              <CardDescription>Complete list of all reservations.</CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<div>Loading all reservations...</div>}>
                <AllReservations />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}

async function UpcomingReservations() {
  const reservations = await getUpcomingReservations()
  return <ReservationTable reservations={reservations} />
}

async function TodayReservations() {
  const reservations = await getTodayReservations()
  return <ReservationTable reservations={reservations} />
}

async function PastReservations() {
  const reservations = await getPastReservations()
  return <ReservationTable reservations={reservations} />
}

async function AllReservations() {
  const reservations = await getReservations()
  return <ReservationTable reservations={reservations} />
}
