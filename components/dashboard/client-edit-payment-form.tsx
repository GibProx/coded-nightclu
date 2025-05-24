"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClientClient } from "@/lib/supabase/client"
import { useToast } from "@/components/ui/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

interface ClientEditPaymentFormProps {
  paymentId: string
}

export function ClientEditPaymentForm({ paymentId }: ClientEditPaymentFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [guests, setGuests] = useState([])
  const [formData, setFormData] = useState({
    guest_id: "",
    amount: "",
    payment_date: "",
    payment_method: "",
    status: "",
    items: "",
  })

  useEffect(() => {
    async function fetchPaymentAndGuests() {
      try {
        setLoading(true)
        const supabase = createClientClient()

        if (!supabase) {
          throw new Error("Supabase client not available")
        }

        // Fetch payment data
        const { data: payment, error: paymentError } = await supabase
          .from("payments")
          .select("*")
          .eq("id", paymentId)
          .single()

        if (paymentError) {
          throw new Error(`Error fetching payment: ${paymentError.message}`)
        }

        if (!payment) {
          throw new Error("Payment not found")
        }

        // Fetch guests for dropdown
        const { data: guestsData, error: guestsError } = await supabase.from("guests").select("id, name").order("name")

        if (guestsError) {
          console.error("Error fetching guests:", guestsError)
          // Continue with payment data even if guests can't be loaded
        }

        setGuests(guestsData || [])
        setFormData({
          guest_id: payment.guest_id || "none",
          amount: payment.amount.toString(),
          payment_date: payment.payment_date,
          payment_method: payment.payment_method,
          status: payment.status,
          items: payment.items || "",
        })
      } catch (err) {
        console.error("Error:", err)
        setError(err.message || "An error occurred while loading the payment")
      } finally {
        setLoading(false)
      }
    }

    fetchPaymentAndGuests()
  }, [paymentId])

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
        throw new Error("Supabase client not available")
      }

      // Validate form data
      if (!formData.amount || isNaN(Number.parseFloat(formData.amount)) || Number.parseFloat(formData.amount) <= 0) {
        throw new Error("Amount must be a positive number")
      }

      // Update payment in database
      const { error: updateError } = await supabase
        .from("payments")
        .update({
          guest_id: formData.guest_id === "none" ? null : formData.guest_id,
          amount: Number.parseFloat(formData.amount),
          payment_date: formData.payment_date,
          payment_method: formData.payment_method,
          status: formData.status,
          items: formData.items || null,
        })
        .eq("id", paymentId)

      if (updateError) {
        throw new Error(`Error updating payment: ${updateError.message}`)
      }

      toast({
        title: "Success",
        description: "Payment updated successfully",
      })

      router.push("/dashboard/payments")
      router.refresh()
    } catch (err) {
      console.error("Error in handleSubmit:", err)
      toast({
        title: "Error",
        description: err.message || "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading</CardTitle>
          <CardDescription>Loading payment data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <div className="animate-pulse text-center">
              <p className="text-muted-foreground">Loading payment details...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error</CardTitle>
          <CardDescription>Failed to load payment</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <div className="mt-4">
            <Button onClick={() => router.push("/dashboard/payments")}>Back to Payments</Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Payment Information</CardTitle>
          <CardDescription>Update the details for this payment.</CardDescription>
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
                <SelectItem value="Credit Card">Credit Card</SelectItem>
                <SelectItem value="Cash">Cash</SelectItem>
                <SelectItem value="Mobile Payment">Mobile Payment</SelectItem>
                <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
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
            {loading ? "Updating..." : "Update Payment"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
