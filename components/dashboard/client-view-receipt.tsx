"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { createClientClient } from "@/lib/supabase/client"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Printer, Edit } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface ClientViewReceiptProps {
  paymentId: string
}

export function ClientViewReceipt({ paymentId }: ClientViewReceiptProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [payment, setPayment] = useState<any>(null)
  const [guest, setGuest] = useState<any>(null)
  const receiptRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function fetchPaymentData() {
      try {
        setLoading(true)
        const supabase = createClientClient()

        if (!supabase) {
          throw new Error("Supabase client not available")
        }

        // Fetch payment data
        const { data: paymentData, error: paymentError } = await supabase
          .from("payments")
          .select("*")
          .eq("id", paymentId)
          .single()

        if (paymentError) {
          throw new Error(`Error fetching payment: ${paymentError.message}`)
        }

        if (!paymentData) {
          throw new Error("Payment not found")
        }

        setPayment(paymentData)

        // If payment has a guest_id, fetch guest data
        if (paymentData.guest_id) {
          const { data: guestData, error: guestError } = await supabase
            .from("guests")
            .select("*")
            .eq("id", paymentData.guest_id)
            .single()

          if (guestError) {
            console.error("Error fetching guest:", guestError)
            // Continue without guest data
          } else {
            setGuest(guestData)
          }
        }
      } catch (err) {
        console.error("Error:", err)
        setError(err.message || "An error occurred while loading the payment")
      } finally {
        setLoading(false)
      }
    }

    fetchPaymentData()
  }, [paymentId])

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    } catch (error) {
      return dateString
    }
  }

  const getStatusVariant = (status) => {
    if (!status) return "default"

    switch (status.toLowerCase()) {
      case "completed":
        return "success"
      case "pending":
        return "secondary"
      case "failed":
        return "destructive"
      case "refunded":
        return "outline"
      default:
        return "default"
    }
  }

  const handlePrint = () => {
    const printContent = receiptRef.current?.innerHTML
    const originalContent = document.body.innerHTML

    if (printContent) {
      document.body.innerHTML = `
        <html>
          <head>
            <title>Payment Receipt</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
              .receipt { max-width: 800px; margin: 0 auto; }
              .header { text-align: center; margin-bottom: 20px; }
              .details { margin-bottom: 20px; }
              .details div { margin-bottom: 5px; }
              .items { margin-top: 20px; }
              .footer { margin-top: 30px; text-align: center; font-size: 0.8em; }
              table { width: 100%; border-collapse: collapse; }
              th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
              th { background-color: #f2f2f2; }
              .amount { text-align: right; }
              .total { font-weight: bold; }
            </style>
          </head>
          <body>
            <div class="receipt">
              ${printContent}
            </div>
          </body>
        </html>
      `

      window.print()
      document.body.innerHTML = originalContent
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
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Payment Receipt</CardTitle>
          <CardDescription>Receipt for payment #{payment.id}</CardDescription>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button variant="outline" size="sm" asChild>
            <a href={`/dashboard/payments/${payment.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </a>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div ref={receiptRef}>
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold">CODED Nightclub</h2>
            <p className="text-muted-foreground">123 Party Street, Nightlife City</p>
            <p className="text-muted-foreground">Tel: (555) 123-4567</p>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Receipt Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-muted-foreground">Receipt Number:</p>
                <p className="font-medium">{payment.id}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Date:</p>
                <p className="font-medium">{formatDate(payment.payment_date)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Payment Method:</p>
                <p className="font-medium">{payment.payment_method}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Status:</p>
                <Badge variant={getStatusVariant(payment.status)}>{payment.status}</Badge>
              </div>
            </div>
          </div>

          {guest && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Customer Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-muted-foreground">Name:</p>
                  <p className="font-medium">{guest.name}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Email:</p>
                  <p className="font-medium">{guest.email || "N/A"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Phone:</p>
                  <p className="font-medium">{guest.phone || "N/A"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">VIP Status:</p>
                  <p className="font-medium">{guest.is_vip ? "VIP" : "Regular"}</p>
                </div>
              </div>
            </div>
          )}

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Items</h3>
            {payment.items ? (
              <div className="border rounded-md p-4">
                <p>{payment.items}</p>
              </div>
            ) : (
              <p className="text-muted-foreground">No items specified</p>
            )}
          </div>

          <Separator className="my-4" />

          <div className="flex justify-between items-center text-lg font-bold">
            <span>Total Amount:</span>
            <span>{formatCurrency(payment.amount)}</span>
          </div>

          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p>Thank you for your business!</p>
            <p>For any questions, please contact our customer service.</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => router.push("/dashboard/payments")}>
          Back to Payments
        </Button>
      </CardFooter>
    </Card>
  )
}
