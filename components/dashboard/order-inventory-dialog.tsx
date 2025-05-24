"use client"

import type React from "react"

import { useState } from "react"
import { createClientClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface OrderInventoryDialogProps {
  item: {
    id: string
    name: string
    category: string
    stock: number
    unit: string
    cost: number
    threshold: number
    supplier?: string | null
  }
  onOrderComplete?: () => void
}

export function OrderInventoryDialog({ item, onOrderComplete }: OrderInventoryDialogProps) {
  const [open, setOpen] = useState(false)
  const [quantity, setQuantity] = useState(Math.max(1, item.threshold - item.stock))
  const [supplier, setSupplier] = useState(item.supplier || "")
  const [notes, setNotes] = useState(`Restock order for ${item.name}`)
  const [loading, setLoading] = useState(false)
  const supabase = createClientClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // 1. Create a supplier order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          status: "pending",
          order_date: new Date().toISOString(),
          notes: notes,
          total_amount: quantity * item.cost,
          order_type: "supplier", // Add this field to distinguish from customer orders
        })
        .select()
        .single()

      if (orderError) {
        throw new Error(`Error creating order: ${orderError.message}`)
      }

      // 2. Add the inventory item to the order
      const { error: itemError } = await supabase.from("order_items").insert({
        order_id: order.id,
        inventory_id: item.id,
        quantity: quantity,
        unit_price: item.cost,
      })

      if (itemError) {
        throw new Error(`Error adding item to order: ${itemError.message}`)
      }

      // 3. Update the inventory item with the supplier and last ordered date
      const { error: updateError } = await supabase
        .from("inventory")
        .update({
          supplier: supplier,
          last_ordered: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", item.id)

      if (updateError) {
        throw new Error(`Error updating inventory: ${updateError.message}`)
      }

      toast({
        title: "Order created",
        description: `Order for ${quantity} ${item.unit} of ${item.name} has been created.`,
      })

      setOpen(false)
      if (onOrderComplete) {
        onOrderComplete()
      }
    } catch (error: any) {
      console.error("Error creating inventory order:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "An unexpected error occurred",
      })
    } finally {
      setLoading(false)
    }
  }

  // Calculate suggested order quantity based on threshold
  const suggestedQuantity = Math.max(1, item.threshold - item.stock)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Order More
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Order Inventory</DialogTitle>
          <DialogDescription>Create a new order for {item.name}.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="quantity" className="text-right">
                Quantity
              </Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="supplier" className="text-right">
                Supplier
              </Label>
              <Input
                id="supplier"
                value={supplier}
                onChange={(e) => setSupplier(e.target.value)}
                className="col-span-3"
                placeholder="Enter supplier name"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="notes" className="text-right">
                Notes
              </Label>
              <Input id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="text-right text-sm text-muted-foreground">Cost</div>
              <div className="col-span-3">${(item.cost * quantity).toFixed(2)}</div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Order
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
