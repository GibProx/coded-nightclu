"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClientClient } from "@/lib/supabase/client"
import { toast } from "@/components/ui/use-toast"

export function ClientNewPaymentForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [guests, setGuests] = useState([])
  const [formData, setFormData] = useState({
    guest_id: "none",
    amount: "",
    payment_date: new Date().toISOString().split("T")[0],
    payment_method: "credit_card",
    status: "completed",
    items: "",
  })

  useEffect(() => {
    async function fetchGuests() {
      try {
        const supabase = createClientClient()

        if (!supabase) {
          console.log("Supabase client not available")
          return
        }

        const { data, error } = await supabase.from("guests").select("id, name").order("name")

        if (error) {
          console.error("Error fetching guests:", error)
          return
        }

        setGuests(data || [])
      } catch (err) {
        console.error("Error in fetchGuests:", err)
      }
    }

    fetchGuests()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const supabase = createClientClient()

      if (!supabase) {
        toast({
          title: "Error",
          description: "Could not connect to database",
          variant: "destructive",
        })
        return
      }

      // Validate form data
      if (!formData.amount || isNaN(Number.parseFloat(formData.amount)) || Number.parseFloat(formData.amount) <= 0) {
        toast({
          title: "Validation Error",
          description: "Amount must be a positive number",
          variant: "destructive",
        })
        setLoading(false)
        return
      }

      // Create payment in database
      const { data, error } = await supabase
        .from("payments")
        .insert({
          guest_id: formData.guest_id === "none" ? null : formData.guest_id,
          amount: Number.parseFloat(formData.amount),
          payment_date: formData.payment_date,
          payment_method: formData.payment_method,
          status: formData.status,
          items: formData.items || null,
        })
        .select()
        .single()

      if (error) {
        console.error("Error creating payment:", error)
        toast({
          title: "Error",
          description: error.message || "Failed to create payment",
          variant: "destructive",
        })
        return
      }

      toast({
        title: "Success",
        description: "Payment created successfully",
      })

      router.push("/dashboard/payments")
      router.refresh()
    } catch (err) {
      console.error("Error in handleSubmit:", err)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Payment Information</CardTitle>
          <CardDescription>Enter the details for the new payment.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="guest_id">Guest</Label>
            <Select
              name="guest_id"
              value={formData.guest_id}
              onValueChange={(value) => handleSelectChange("guest_id", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a guest" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Anonymous / No Guest</SelectItem>
                {guests.map((guest) => (
                  <SelectItem key={guest.id} value={guest.id}>
                    {guest.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount ($)</Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0.00"
              value={formData.amount}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="payment_date">Payment Date</Label>
            <Input
              id="payment_date"
              name="payment_date"
              type="date"
              value={formData.payment_date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="payment_method">Payment Method</Label>
            <Select
              name="payment_method"
              value={formData.payment_method}
              onValueChange={(value) => handleSelectChange("payment_method", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="credit_card">Credit Card</SelectItem>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="mobile_payment">Mobile Payment</SelectItem>
                <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              name="status"
              value={formData.status}
              onValueChange={(value) => handleSelectChange("status", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="items">Items (Optional)</Label>
            <Textarea
              id="items"
              name="items"
              placeholder="Enter items or services purchased"
              value={formData.items}
              onChange={handleChange}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" type="button" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Payment"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
