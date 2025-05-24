"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import { useState } from "react"
import { updatePayment } from "@/app/actions/payment-actions"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

interface EditPaymentFormProps {
  payment: any
  guests: { id: string; name: string }[]
}

export function EditPaymentForm({ payment, guests }: EditPaymentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)

    try {
      const formData = new FormData(event.currentTarget)
      formData.append("id", payment.id)
      const result = await updatePayment(formData)

      if (result.error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error,
        })
      } else {
        toast({
          title: "Success",
          description: "Payment updated successfully",
        })
        router.push("/dashboard/payments")
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="guest_id">Customer</Label>
          <Select name="guest_id" defaultValue={payment.guest_id || "none"}>
            <SelectTrigger id="guest_id">
              <SelectValue placeholder="Select customer" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Anonymous</SelectItem>
              {guests.map((guest) => (
                <SelectItem key={guest.id} value={guest.id}>
                  {guest.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount">Amount</Label>
          <div className="relative">
            <span className="absolute left-3 top-2.5">$</span>
            <Input
              id="amount"
              name="amount"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              className="pl-7"
              defaultValue={payment.amount}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="payment_date">Date</Label>
          <Input
            id="payment_date"
            name="payment_date"
            type="date"
            defaultValue={payment.payment_date ? new Date(payment.payment_date).toISOString().split("T")[0] : ""}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="payment_method">Payment Method</Label>
          <Select name="payment_method" defaultValue={payment.payment_method}>
            <SelectTrigger id="payment_method">
              <SelectValue placeholder="Select method" />
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
          <Select name="status" defaultValue={payment.status}>
            <SelectTrigger id="status">
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
      </div>

      <div className="space-y-2">
        <Label htmlFor="items">Items</Label>
        <Textarea
          id="items"
          name="items"
          placeholder="Enter the items included in this payment"
          defaultValue={payment.items || ""}
        />
      </div>

      <div className="flex justify-between">
        <Button variant="outline" asChild>
          <Link href="/dashboard/payments">Cancel</Link>
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Updating..." : "Update Payment"}
        </Button>
      </div>
    </form>
  )
}
