"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react"

import { deleteReservation } from "@/app/actions/reservation-actions"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"

type ReservationWithGuest = {
  id: string
  guest_id: string | null
  date: string
  time: string
  party_size: number
  table_number: string | null
  type: string
  status: string
  special_requests: string | null
  created_at: string
  updated_at: string
  guests: {
    id: string
    name: string
    email: string | null
    phone: string | null
  } | null
}

interface ReservationTableProps {
  reservations: ReservationWithGuest[]
}

export function ReservationTable({ reservations }: ReservationTableProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [reservationToDelete, setReservationToDelete] = useState<string | null>(null)

  const handleEdit = (id: string) => {
    router.push(`/dashboard/reservations/${id}/edit`)
  }

  const handleDelete = async () => {
    if (!reservationToDelete) return

    const result = await deleteReservation(reservationToDelete)

    if (result.success) {
      toast({
        title: "Reservation deleted",
        description: result.message,
      })
      router.refresh()
    } else {
      toast({
        title: "Error",
        description: result.message,
        variant: "destructive",
      })
    }

    setIsDeleteDialogOpen(false)
    setReservationToDelete(null)
  }

  const confirmDelete = (id: string) => {
    setReservationToDelete(id)
    setIsDeleteDialogOpen(true)
  }

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
    <div className="rounded-md border">
      <div className="relative w-full overflow-auto">
        <table className="w-full caption-bottom text-sm">
          <thead className="[&_tr]:border-b">
            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
              <th className="h-12 px-4 text-left align-middle font-medium">Date</th>
              <th className="h-12 px-4 text-left align-middle font-medium">Time</th>
              <th className="h-12 px-4 text-left align-middle font-medium">Guest</th>
              <th className="h-12 px-4 text-left align-middle font-medium">Party Size</th>
              <th className="h-12 px-4 text-left align-middle font-medium">Table</th>
              <th className="h-12 px-4 text-left align-middle font-medium">Type</th>
              <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
              <th className="h-12 px-4 text-left align-middle font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="[&_tr:last-child]:border-0">
            {reservations.length === 0 ? (
              <tr>
                <td colSpan={8} className="h-24 text-center">
                  No reservations found.
                </td>
              </tr>
            ) : (
              reservations.map((reservation) => (
                <tr
                  key={reservation.id}
                  className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                >
                  <td className="p-4 align-middle">{format(new Date(reservation.date), "MMM dd, yyyy")}</td>
                  <td className="p-4 align-middle">{reservation.time}</td>
                  <td className="p-4 align-middle">
                    {reservation.guests?.name || "Walk-in"}
                    {reservation.guests?.phone && (
                      <div className="text-xs text-muted-foreground">{reservation.guests.phone}</div>
                    )}
                  </td>
                  <td className="p-4 align-middle">{reservation.party_size}</td>
                  <td className="p-4 align-middle">{reservation.table_number || "-"}</td>
                  <td className="p-4 align-middle">{reservation.type}</td>
                  <td className="p-4 align-middle">{getStatusBadge(reservation.status)}</td>
                  <td className="p-4 align-middle">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(reservation.id)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600" onClick={() => confirmDelete(reservation.id)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the reservation.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
