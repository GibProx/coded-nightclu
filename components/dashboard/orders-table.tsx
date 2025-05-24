"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Eye, Edit, Trash } from "lucide-react"
import Link from "next/link"
import { formatCurrency } from "@/lib/utils"

type Order = {
  id: string
  client_id: string | null
  payment_id: string | null
  order_date: string
  status: string
  total_amount: number
  notes: string | null
  created_at: string
  updated_at: string
  client?: {
    id: string
    name: string
  } | null
  payment?: {
    id: string
    amount: number
    payment_method: string
  } | null
}

interface OrdersTableProps {
  initialOrders: Order[]
  status: string
}

export function OrdersTable({ initialOrders, status }: OrdersTableProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80"
      case "confirmed":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100/80"
      case "delivered":
        return "bg-green-100 text-green-800 hover:bg-green-100/80"
      case "paid":
        return "bg-emerald-100 text-emerald-800 hover:bg-emerald-100/80"
      case "cancelled":
        return "bg-red-100 text-red-800 hover:bg-red-100/80"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100/80"
    }
  }

  if (initialOrders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <p className="text-muted-foreground mb-4">No orders found</p>
        <Link href="/dashboard/orders/new">
          <Button>Create your first order</Button>
        </Link>
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Order Date</TableHead>
          <TableHead>Client</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Total</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {initialOrders.map((order) => (
          <TableRow key={order.id}>
            <TableCell>{new Date(order.order_date).toLocaleDateString()}</TableCell>
            <TableCell>{order.client?.name || "Anonymous"}</TableCell>
            <TableCell>
              <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
            </TableCell>
            <TableCell>{formatCurrency(order.total_amount)}</TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href={`/dashboard/orders/${order.id}/view`}>
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={`/dashboard/orders/${order.id}/edit`}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600">
                    <Trash className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
