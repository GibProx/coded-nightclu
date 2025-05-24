"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PlusCircle, AlertCircle } from "lucide-react"
import Link from "next/link"
import { createClientClient } from "@/lib/supabase/client"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"

export function ClientPaymentsContent() {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [usingMockData, setUsingMockData] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    async function fetchPayments() {
      try {
        setLoading(true)
        const supabase = createClientClient()

        if (!supabase) {
          throw new Error("Supabase client not available")
        }

        // Check if payments table exists
        const { data: tableExists, error: tableCheckError } = await supabase.from("payments").select("id").limit(1)

        if (tableCheckError) {
          // If table doesn't exist, create it
          if (tableCheckError.message.includes("does not exist")) {
            await createPaymentsTable(supabase)
            await seedInitialPayments(supabase)
          } else {
            throw new Error(`Table check error: ${tableCheckError.message}`)
          }
        }

        // Fetch payments with guest information
        const { data, error: fetchError } = await supabase
          .from("payments")
          .select("*, guest:guests(name)")
          .order("payment_date", { ascending: false })

        if (fetchError) {
          throw new Error(`Fetch error: ${fetchError.message}`)
        }

        setPayments(data || [])
        setUsingMockData(false)
      } catch (err) {
        console.error("Error fetching payments:", err)
        setError(err.message || "Failed to load payments")
        toast({
          title: "Error loading payments",
          description: err.message || "Could not load payments from database",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchPayments()
  }, [toast])

  // Function to create payments table if it doesn't exist
  async function createPaymentsTable(supabase) {
    try {
      // Create the payments table
      const { error } = await supabase.rpc("create_payments_table")

      if (error) {
        console.error("Error creating payments table:", error)
        throw new Error(`Failed to create payments table: ${error.message}`)
      }

      toast({
        title: "Payments table created",
        description: "The payments table has been created in your database.",
      })

      return true
    } catch (err) {
      console.error("Error in createPaymentsTable:", err)
      throw new Error(`Failed to create payments table: ${err.message}`)
    }
  }

  // Function to seed initial payments if table is empty
  async function seedInitialPayments(supabase) {
    try {
      // Check if table is empty
      const { data, error: checkError } = await supabase.from("payments").select("id").limit(1)

      if (checkError) {
        throw new Error(`Error checking payments: ${checkError.message}`)
      }

      // If table is empty, seed with initial data
      if (!data || data.length === 0) {
        const initialPayments = [
          {
            guest_id: null,
            amount: 450,
            payment_date: "2023-11-15",
            payment_method: "Credit Card",
            status: "completed",
            items: "VIP Table Service, Bottles (2)",
          },
          {
            guest_id: null,
            amount: 180,
            payment_date: "2023-11-15",
            payment_method: "Cash",
            status: "completed",
            items: "Entry Tickets (4)",
          },
          {
            guest_id: null,
            amount: 750,
            payment_date: "2023-11-16",
            payment_method: "Credit Card",
            status: "completed",
            items: "VIP Table Service, Bottles (3), Food",
          },
          {
            guest_id: null,
            amount: 120,
            payment_date: "2023-11-16",
            payment_method: "Mobile Payment",
            status: "pending",
            items: "Entry Tickets (2), Drinks",
          },
        ]

        const { error: insertError } = await supabase.from("payments").insert(initialPayments)

        if (insertError) {
          throw new Error(`Error seeding payments: ${insertError.message}`)
        }

        toast({
          title: "Sample payments added",
          description: "Sample payment data has been added to your database.",
        })
      }

      return true
    } catch (err) {
      console.error("Error in seedInitialPayments:", err)
      throw new Error(`Failed to seed initial payments: ${err.message}`)
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
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

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Payment Transactions</CardTitle>
          <CardDescription>Loading payment data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <div className="animate-pulse text-center">
              <p className="text-muted-foreground">Loading payments...</p>
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
          <CardDescription>Failed to load payments</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <div className="mt-4">
            <p className="text-muted-foreground">
              Please make sure your database is properly set up. You can run the setup script from the dashboard setup
              page.
            </p>
            <div className="mt-4">
              <Button asChild>
                <Link href="/dashboard/setup">Go to Setup Page</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <div>
          {usingMockData && (
            <Alert variant="warning" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Using Sample Data</AlertTitle>
              <AlertDescription>
                Displaying sample data because the database table is not available. Please run the setup script to
                create the payments table.
              </AlertDescription>
            </Alert>
          )}
        </div>
        <Button asChild>
          <Link href="/dashboard/payments/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Payment
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payment Transactions</CardTitle>
          <CardDescription>Complete record of all payment transactions.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    No payments found. Click "New Payment" to add one.
                  </TableCell>
                </TableRow>
              ) : (
                payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium">{payment.id}</TableCell>
                    <TableCell>{formatDate(payment.payment_date)}</TableCell>
                    <TableCell>{payment.guest?.name || "Anonymous"}</TableCell>
                    <TableCell>{formatCurrency(payment.amount)}</TableCell>
                    <TableCell>{payment.payment_method}</TableCell>
                    <TableCell className="max-w-xs truncate">{payment.items || "-"}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(payment.status)}>{payment.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/dashboard/payments/${payment.id}/view`}>View</Link>
                        </Button>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/dashboard/payments/${payment.id}/edit`}>Edit</Link>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  )
}
