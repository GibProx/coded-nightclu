"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { SecurityLog } from "@/types/database"
import { ResponsiveTable } from "@/components/ui/responsive-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import { MoreHorizontal, Edit, Trash, CheckCircle } from "lucide-react"
import { deleteSecurityLog, updateSecurityLog } from "@/app/actions/security-actions"
import { useToast } from "@/components/ui/use-toast"
import { format } from "date-fns"

interface SecurityLogTableProps {
  data: (SecurityLog & { staff?: { id: string; name: string } })[]
}

export function SecurityLogTable({ data }: SecurityLogTableProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [resolveDialogOpen, setResolveDialogOpen] = useState(false)
  const [selectedLog, setSelectedLog] = useState<SecurityLog | null>(null)

  const handleDelete = async () => {
    if (!selectedLog) return

    const result = await deleteSecurityLog(selectedLog.id)

    if (result.success) {
      toast({
        title: "Success",
        description: result.message,
      })
    } else {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      })
    }

    setDeleteDialogOpen(false)
  }

  const handleResolve = async () => {
    if (!selectedLog) return

    const formData = new FormData()
    formData.append("id", selectedLog.id)
    formData.append("type", selectedLog.type)
    formData.append("location", selectedLog.location)
    formData.append("description", selectedLog.description)
    formData.append("status", "resolved")
    formData.append("current_status", selectedLog.status)
    formData.append("assigned_to", selectedLog.assigned_to || "none")

    const result = await updateSecurityLog(formData)

    if (result.success) {
      toast({
        title: "Success",
        description: result.message,
      })
    } else {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      })
    }

    setResolveDialogOpen(false)
  }

  const columns = [
    {
      key: "timestamp",
      title: "Timestamp",
      render: (value: string) => format(new Date(value), "MMM d, yyyy h:mm a"),
    },
    {
      key: "type",
      title: "Type",
      render: (value: string) => (
        <Badge
          variant={
            value === "Access Denied"
              ? "outline"
              : value === "Altercation"
                ? "destructive"
                : value === "Medical"
                  ? "secondary"
                  : value === "Suspicious Activity"
                    ? "warning"
                    : "default"
          }
        >
          {value}
        </Badge>
      ),
    },
    { key: "location", title: "Location" },
    {
      key: "description",
      title: "Description",
      className: "max-w-xs truncate",
    },
    {
      key: "status",
      title: "Status",
      render: (value: string) => <Badge variant={value === "resolved" ? "success" : "secondary"}>{value}</Badge>,
    },
    {
      key: "assigned_to",
      title: "Assigned To",
      render: (_, row) => row.staff?.name || "Unassigned",
    },
    {
      key: "actions",
      title: "Actions",
      render: (_, row) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push(`/dashboard/security/${row.id}/edit`)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            {row.status !== "resolved" && (
              <DropdownMenuItem
                onClick={() => {
                  setSelectedLog(row)
                  setResolveDialogOpen(true)
                }}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Mark as Resolved
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              onClick={() => {
                setSelectedLog(row)
                setDeleteDialogOpen(true)
              }}
              className="text-red-600"
            >
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  return (
    <>
      <ResponsiveTable
        data={data}
        columns={columns}
        emptyState={
          <div className="text-center py-8">
            <h3 className="text-lg font-medium">No security logs found</h3>
            <p className="text-sm text-muted-foreground mt-2">There are no security logs to display.</p>
          </div>
        }
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this security log. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Resolve Confirmation Dialog */}
      <AlertDialog open={resolveDialogOpen} onOpenChange={setResolveDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Mark as Resolved?</AlertDialogTitle>
            <AlertDialogDescription>
              This will mark the security incident as resolved. The current time will be recorded as the resolution
              time.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleResolve}>Mark as Resolved</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
