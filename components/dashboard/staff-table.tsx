"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Pencil, Trash2, UserPlus } from "lucide-react"
import type { Staff } from "@/types/database"
import { deleteStaffMember } from "@/app/actions/staff-actions"
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
import { toast } from "@/components/ui/use-toast"

interface StaffTableProps {
  staff: Staff[]
}

export function StaffTable({ staff }: StaffTableProps) {
  const router = useRouter()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [staffToDelete, setStaffToDelete] = useState<Staff | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleEdit = (staffId: string) => {
    router.push(`/dashboard/staff/${staffId}/edit`)
  }

  const handleDelete = (staff: Staff) => {
    setStaffToDelete(staff)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!staffToDelete) return

    setIsDeleting(true)
    try {
      const result = await deleteStaffMember(staffToDelete.id)

      if (result.success) {
        toast({
          title: "Staff member deleted",
          description: "The staff member has been deleted successfully.",
        })
        router.refresh()
      } else {
        throw new Error(result.error || "Failed to delete staff member")
      }
    } catch (error) {
      console.error("Error deleting staff member:", error)
      toast({
        title: "Error",
        description: "There was an error deleting the staff member.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setIsDeleteDialogOpen(false)
      setStaffToDelete(null)
    }
  }

  if (!staff || staff.length === 0) {
    return (
      <div className="text-center py-8">
        <h3 className="text-lg font-medium">No Staff Members</h3>
        <p className="text-sm text-muted-foreground mt-2">There are no staff members in the system yet.</p>
        <Button className="mt-4" asChild>
          <a href="/dashboard/staff/new">
            <UserPlus className="mr-2 h-4 w-4" />
            Add Staff Member
          </a>
        </Button>
      </div>
    )
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Staff Member</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {staff.map((staffMember) => (
            <TableRow key={staffMember.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={staffMember.avatar_url || ""} alt={staffMember.name} />
                    <AvatarFallback>{staffMember.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="font-medium">{staffMember.name}</div>
                </div>
              </TableCell>
              <TableCell>{staffMember.role}</TableCell>
              <TableCell>{staffMember.email}</TableCell>
              <TableCell>{staffMember.phone || "—"}</TableCell>
              <TableCell>
                <Badge variant={staffMember.active ? "success" : "secondary"}>
                  {staffMember.active ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleEdit(staffMember.id)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDelete(staffMember)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {staffToDelete?.name}. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
