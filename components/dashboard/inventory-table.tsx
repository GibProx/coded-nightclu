"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Pencil, Trash2, ShoppingCart, AlertTriangle } from "lucide-react"
import type { Inventory } from "@/types/database"
import { deleteInventoryItem } from "@/app/actions/inventory-actions"
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

interface InventoryTableProps {
  inventory: Inventory[]
}

export function InventoryTable({ inventory }: InventoryTableProps) {
  const router = useRouter()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<Inventory | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleEdit = (itemId: string) => {
    router.push(`/dashboard/inventory/${itemId}/edit`)
  }

  const handleDelete = (item: Inventory) => {
    setItemToDelete(item)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!itemToDelete) return

    setIsDeleting(true)
    try {
      const result = await deleteInventoryItem(itemToDelete.id)

      if (result.success) {
        toast({
          title: "Item deleted",
          description: "The inventory item has been deleted successfully.",
        })
        router.refresh()
      } else {
        throw new Error(result.error || "Failed to delete item")
      }
    } catch (error: any) {
      console.error("Error deleting inventory item:", error)
      toast({
        title: "Error",
        description: error.message || "There was an error deleting the inventory item.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setIsDeleteDialogOpen(false)
      setItemToDelete(null)
    }
  }

  // Handle case where inventory is undefined or null
  if (!inventory) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <AlertTriangle className="h-12 w-12 text-yellow-500 mb-4" />
        <h3 className="text-lg font-medium">Unable to load inventory data</h3>
        <p className="text-sm text-muted-foreground mt-2">
          There was a problem loading the inventory data. Please try again later.
        </p>
        <Button variant="outline" className="mt-4" onClick={() => router.refresh()}>
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Item</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Supplier</TableHead>
            <TableHead>Last Ordered</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {inventory.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8">
                No inventory items found. Add your first item to get started.
              </TableCell>
            </TableRow>
          ) : (
            inventory.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-xs text-muted-foreground">{item.unit}</div>
                  </div>
                </TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress
                      value={(item.stock / (item.threshold * 5)) * 100}
                      className="w-[80px]"
                      indicatorClassName={
                        item.stock < item.threshold
                          ? "bg-destructive"
                          : item.stock < item.threshold * 2
                            ? "bg-yellow-500"
                            : "bg-primary"
                      }
                    />
                    <span>{item.stock}</span>
                    {item.stock < item.threshold && <Badge variant="destructive">Low</Badge>}
                  </div>
                </TableCell>
                <TableCell>{item.supplier || "—"}</TableCell>
                <TableCell>{item.last_ordered ? new Date(item.last_ordered).toLocaleDateString() : "—"}</TableCell>
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
                      <DropdownMenuItem onClick={() => handleEdit(item.id)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Order
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(item)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {itemToDelete?.name}. This action cannot be undone.
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
