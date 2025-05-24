import Link from "next/link"
import { format } from "date-fns"

import { getTodayReservations, getUpcomingReservations } from "@/app/actions/reservation-actions"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface RecentBookingsProps {
  fullList?: boolean
}

export async function RecentBookings({ fullList = false }: RecentBookingsProps) {
  const reservations = fullList ? await getUpcomingReservations() : (await getTodayReservations()).slice(0, 5)

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return <Badge className="bg-green-500">Confirmed</Badge>
      case "pending":
        return <Badge className="bg-yellow-500">Pending</Badge>
      case "cancelled":
        return <Badge className="bg-red-500">Cancelled</Badge>
      case "completed":
        return <Badge className="bg-blue-500">Completed</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  return (
    <div className="space-y-8">
      {reservations.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-muted-foreground">No upcoming reservations found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reservations.map((booking) => (
            <div key={booking.id} className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">
                  {booking.guests?.name || "Walk-in"} - {booking.party_size}{" "}
                  {booking.party_size === 1 ? "person" : "people"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(booking.date), "MMM dd")} at {booking.time}{" "}
                  {booking.table_number ? `• Table ${booking.table_number}` : ""}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge(booking.status)}
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/dashboard/reservations/${booking.id}/edit`}>View</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!fullList && reservations.length > 0 && (
        <Button variant="outline" className="w-full" asChild>
          <Link href="/dashboard/reservations">View all reservations</Link>
        </Button>
      )}
    </div>
  )
}
