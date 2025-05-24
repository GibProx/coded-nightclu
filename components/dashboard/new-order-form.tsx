"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { createOrder } from "@/app/actions/order-actions"
import { Loader2, Plus, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface NewOrderFormProps {
  guests: { id: string; name: string }[]
  inventory: any[] // Using any to avoid type issues
}

export function NewOrderForm({ guests, inventory }: NewOrderFormProps) {
  const [clientId, setClientId] = useState<string>("anonymous")
  const [notes, setNotes] = useState<string>("")
  const [items, setItems] = useState<any[]>([])
  const [selectedProductId, setSelectedProductId] = useState<string>("none")
  const [quantity, setQuantity] = useState<number>(1)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // Calculate total order amount
  const totalAmount = items.reduce((sum, item) => sum + item.subtotal, 0)

  // Group inventory by category for the dropdown
  const inventoryByCategory: Record<string, any[]> = {}
  inventory.forEach((item) => {
    if (!inventoryByCategory[item.category]) {
      inventoryByCategory[item.category] = []
    }
    inventoryByCategory[item.category].push(item)
  })

  const handleAddItem = () => {
    if (selectedProductId === "none" || quantity <= 0) return

    const product = inventory.find((item) => item.id === selectedProductId)
    if (!product) return

    // Validate quantity against available stock
    if (quantity > product.stock) {
      toast({
        variant: "destructive",
        title: "Invalid quantity",
        description: `Cannot add more than available stock (${product.stock} ${product.unit} of ${product.name})`,
      })
      return
    }

    const newItem = {
      id: product.id,
      name: product.name,
      category: product.category,
      quantity,
      unit_price: product.cost,
      subtotal: product.cost * quantity,
    }

    setItems([...items, newItem])
    setSelectedProductId("none")
    setQuantity(1)
  }

  const handleRemoveItem = (index: number) => {
    const newItems = [...items]
    newItems.splice(index, 1)
    setItems(newItems)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (items.length === 0) {
      toast({
        variant: "destructive",
        title: "No items added",
        description: "Please add at least one item to the order.",
      })
      return
    }

    setLoading(true)

    try {
      // Create form data for the server action
      const formData = new FormData()
      formData.append("client_id", clientId)
      formData.append("notes", notes)
      formData.append("items", JSON.stringify(items))
      formData.append("total_amount", totalAmount.toString())

      const result = await createOrder(formData)

      if (!result.success) {
        throw new Error(result.error || "Failed to create order")
      }

      toast({
        title: "Order created",
        description: "Your order has been created successfully.",
      })

      router.push("/dashboard/orders")
    } catch (error: any) {
      console.error("Error creating order:", error)
      toast({
        variant: "destructive",
        title: "Error creating order",
        description: error.message || "An unexpected error occurred",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Order Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="client">Client (Optional)</Label>
              <Select value={clientId} onValueChange={setClientId}>
                <SelectTrigger id="client">
                  <SelectValue placeholder="Select a client" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="anonymous">Anonymous</SelectItem>
                  {guests.map((guest) => (
                    <SelectItem key={guest.id} value={guest.id}>
                      {guest.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any notes about this order"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Order Items</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_120px_auto] gap-4 items-end">
              <div>
                <Label htmlFor="product">Product</Label>
                <Select value={selectedProductId} onValueChange={setSelectedProductId}>
                  <SelectTrigger id="product">
                    <SelectValue placeholder="Select a product" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Select a product</SelectItem>
                    {Object.entries(inventoryByCategory).map(([category, products]) => (
                      <div key={category}>
                        <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">{category}</div>
                        {products.map((product) => (
                          <SelectItem key={product.id} value={product.id}>
                            {product.name} ({product.stock} {product.unit} available)
                          </SelectItem>
                        ))}
                      </div>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Number.parseInt(e.target.value) || 1)}
                />
              </div>
              <Button type="button" onClick={handleAddItem} disabled={selectedProductId === "none"}>
                <Plus className="mr-2 h-4 w-4" /> Add Item
              </Button>
            </div>

            {items.length > 0 ? (
              <div className="border rounded-md">
                <div className="grid grid-cols-[1fr_100px_100px_auto] gap-4 p-4 font-medium border-b">
                  <div>Product</div>
                  <div className="text-right">Price</div>
                  <div className="text-right">Quantity</div>
                  <div className="text-right">Subtotal</div>
                </div>
                {items.map((item, index) => (
                  <div key={index} className="grid grid-cols-[1fr_100px_100px_auto] gap-4 p-4 border-b">
                    <div>
                      <div>{item.name}</div>
                      <Badge variant="outline" className="mt-1">
                        {item.category}
                      </Badge>
                    </div>
                    <div className="text-right">${item.unit_price.toFixed(2)}</div>
                    <div className="text-right">{item.quantity}</div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">${item.subtotal.toFixed(2)}</span>
                      <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(index)} className="h-8 w-8">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                <div className="grid grid-cols-[1fr_100px_100px_auto] gap-4 p-4 font-medium">
                  <div className="col-span-3 text-right">Total:</div>
                  <div className="text-right">${totalAmount.toFixed(2)}</div>
                </div>
              </div>
            ) : (
              <div className="border rounded-md p-8 text-center text-muted-foreground">
                No items added to this order yet. Add some products above.
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => router.push("/dashboard/orders")} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || items.length === 0}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Order
            </Button>
          </CardFooter>
        </Card>
      </div>
    </form>
  )
}
