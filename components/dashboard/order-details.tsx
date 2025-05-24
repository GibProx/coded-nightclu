"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClientClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { formatCurrency } from "@/lib/utils"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Printer, ArrowLeft, Edit, DollarSign, CheckCircle, TruckIcon, XCircle } from "lucide-react"
import Link from "next/link"

interface OrderDetailsProps {
  order: any
}

export function OrderDetails({ order }: OrderDetailsProps) {
  const router = useRouter()
  const supabase = createClientClient()

  const [loading, setLoading] = useState(false)
  const [markAsPaidDialogOpen, setMarkAsPaidDialogOpen] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("cash")

  const handlePrint = () => {
    window.print()
  }

  const handleMarkAsPaid = async () => {
    try {
      setLoading(true)

      // Instead of using the stored procedure, we'll do this manually
      // 1. Create a payment record
      const { data: paymentData, error: paymentError } = await supabase
        .from("payments")
        .insert({
          guest_id: order.client_id,
          amount: order.total_amount,
          payment_date: new Date().toISOString(),
          payment_method: paymentMethod,
          status: "completed",
          items: `Order #${order.id.substring(0, 8)}`,
        })
        .select()
        .single()

      if (paymentError) {
        throw new Error(`Failed to create payment: ${paymentError.message}`)
      }

      // 2. Update the order status and link the payment
      const { error: orderError } = await supabase
        .from("orders")
        .update({
          status: "paid",
          payment_id: paymentData.id,
          updated_at: new Date().toISOString(),
        })
        .eq("id", order.id)

      if (orderError) {
        throw new Error(`Failed to update order: ${orderError.message}`)
      }

      // 3. Update inventory quantities
      for (const item of order.items) {
        // Get the current inventory item to ensure we have the latest stock value
        const { data: inventoryItem, error: getError } = await supabase
          .from("inventory")
          .select("stock")
          .eq("id", item.inventory_id)
          .single()

        if (getError) {
          console.error(`Error getting inventory item ${item.inventory_id}:`, getError)
          continue // Skip this item and continue with others
        }

        // Calculate new stock value, ensuring it's not negative
        const currentStock = inventoryItem.stock || 0 // Default to 0 if null
        const newStock = Math.max(0, currentStock - item.quantity)

        // Update the inventory
        const { error: updateError } = await supabase
          .from("inventory")
          .update({
            stock: newStock,
            updated_at: new Date().toISOString(),
          })
          .eq("id", item.inventory_id)

        if (updateError) {
          console.error(`Error updating inventory for item ${item.inventory_id}:`, updateError)
          // Continue with other items even if one fails
        }
      }

      toast({
        title: "Order marked as paid",
        description: "The order has been marked as paid, inventory updated, and payment recorded.",
      })

      router.refresh()
    } catch (err: any) {
      console.error("Error in handleMarkAsPaid:", err)
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || "An unexpected error occurred while processing the payment.",
      })
    } finally {
      setLoading(false)
      setMarkAsPaidDialogOpen(false)
    }
  }

  const updateOrderStatus = async (newStatus: string) => {
    try {
      setLoading(true)

      const { error } = await supabase
        .from("orders")
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq("id", order.id)

      if (error) {
        throw new Error(`Failed to update order status: ${error.message}`)
      }

      toast({
        title: "Status updated",
        description: `Order has been marked as ${newStatus}.`,
      })

      router.refresh()
    } catch (err: any) {
      console.error("Error updating order status:", err)
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || "An unexpected error occurred while updating the status.",
      })
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            Pending
          </Badge>
        )
      case "confirmed":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            Confirmed
          </Badge>
        )
      case "delivered":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
            Delivered
          </Badge>
        )
      case "paid":
        return (
          <Badge variant="outline" className="bg-purple-100 text-purple-800 hover:bg-purple-100">
            Paid
          </Badge>
        )
      case "cancelled":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">
            Cancelled
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Button variant="outline" asChild>
          <Link href="/dashboard/orders">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Orders
          </Link>
        </Button>
        <div className="flex space-x-2">
          {order.status === "pending" && (
            <Button onClick={() => updateOrderStatus("confirmed")} disabled={loading}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Confirm Order
            </Button>
          )}

          {order.status === "confirmed" && (
            <Button onClick={() => updateOrderStatus("delivered")} disabled={loading}>
              <TruckIcon className="mr-2 h-4 w-4" />
              Mark as Delivered
            </Button>
          )}

          {(order.status === "pending" || order.status === "confirmed" || order.status === "delivered") && (
            <Button
              onClick={() => setMarkAsPaidDialogOpen(true)}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700"
            >
              <DollarSign className="mr-2 h-4 w-4" />
              Mark as Paid
            </Button>
          )}

          {order.status !== "cancelled" && order.status !== "paid" && (
            <Button
              variant="outline"
              onClick={() => updateOrderStatus("cancelled")}
              disabled={loading}
              className="text-red-600 border-red-600 hover:bg-red-50"
            >
              <XCircle className="mr-2 h-4 w-4" />
              Cancel Order
            </Button>
          )}

          <Button variant="outline" asChild>
            <Link href={`/dashboard/orders/${order.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Order
            </Link>
          </Button>

          <Button variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Order Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Order ID</p>
                <p>{order.id}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Date</p>
                <p>{new Date(order.order_date).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                <div className="mt-1">{getStatusBadge(order.status)}</div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Amount</p>
                <p className="font-semibold">{formatCurrency(order.total_amount)}</p>
              </div>
            </div>

            {order.notes && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Notes</p>
                <p>{order.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Client Information</CardTitle>
          </CardHeader>
          <CardContent>
            {order.client ? (
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Name</p>
                  <p>{order.client.name}</p>
                </div>
                {order.client.email && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Email</p>
                    <p>{order.client.email}</p>
                  </div>
                )}
                {order.client.phone && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Phone</p>
                    <p>{order.client.phone}</p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-muted-foreground">Anonymous order</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Order Items</CardTitle>
          <CardDescription>Products included in this order.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="p-2 text-left font-medium">Product</th>
                  <th className="p-2 text-left font-medium">Category</th>
                  <th className="p-2 text-center font-medium">Quantity</th>
                  <th className="p-2 text-right font-medium">Unit Price</th>
                  <th className="p-2 text-right font-medium">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {order.items && order.items.length > 0 ? (
                  order.items.map((item: any) => (
                    <tr key={item.id} className="border-b">
                      <td className="p-2">{item.inventory?.name || "Unknown Product"}</td>
                      <td className="p-2">{item.inventory?.category || "N/A"}</td>
                      <td className="p-2 text-center">
                        {item.quantity} {item.inventory?.unit || "units"}
                      </td>
                      <td className="p-2 text-right">{formatCurrency(item.unit_price)}</td>
                      <td className="p-2 text-right">{formatCurrency(item.subtotal)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-4 text-center text-muted-foreground">
                      No items in this order
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot>
                <tr className="font-medium">
                  <td colSpan={4} className="p-2 text-right">
                    Total:
                  </td>
                  <td className="p-2 text-right">{formatCurrency(order.total_amount)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </CardContent>
      </Card>

      {order.payment && (
        <Card>
          <CardHeader>
            <CardTitle>Payment Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Payment ID</p>
                <p>{order.payment.id}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Payment Date</p>
                <p>{new Date(order.payment.payment_date).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Payment Method</p>
                <p className="capitalize">{order.payment.payment_method}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Amount</p>
                <p className="font-semibold">{formatCurrency(order.payment.amount)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Mark as Paid Confirmation Dialog */}
      <AlertDialog open={markAsPaidDialogOpen} onOpenChange={setMarkAsPaidDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Mark order as paid?</AlertDialogTitle>
            <AlertDialogDescription>
              This will create a payment record, mark the order as paid, and update inventory quantities. This action
              cannot be easily undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <label className="text-sm font-medium mb-2 block">Payment Method</label>
            <Select defaultValue="cash" onValueChange={setPaymentMethod}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="credit_card">Credit Card</SelectItem>
                <SelectItem value="debit_card">Debit Card</SelectItem>
                <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                <SelectItem value="mobile_payment">Mobile Payment</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleMarkAsPaid} className="bg-green-600 hover:bg-green-700">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Mark as Paid
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
