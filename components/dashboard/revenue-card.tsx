"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createClientClient } from "@/lib/supabase/client"
import { Skeleton } from "@/components/ui/skeleton"

export function RevenueCard() {
  const [totalRevenue, setTotalRevenue] = useState<number | null>(null)
  const [percentageChange, setPercentageChange] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchRevenueData() {
      try {
        setLoading(true)
        const supabase = createClientClient()

        if (!supabase) {
          throw new Error("Supabase client not available")
        }

        // Check if payments table exists
        const { data: tableExists, error: tableCheckError } = await supabase.from("payments").select("id").limit(1)

        if (tableCheckError) {
          // If table doesn't exist, show error
          if (tableCheckError.message.includes("does not exist")) {
            throw new Error("Payments table does not exist. Please run the setup script.")
          } else {
            throw new Error(`Table check error: ${tableCheckError.message}`)
          }
        }

        // Get current month's start and end dates
        const now = new Date()
        const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
        const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0)

        // Get previous month's start and end dates
        const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
        const previousMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0)

        // Format dates for Supabase query
        const currentStartStr = currentMonthStart.toISOString().split("T")[0]
        const currentEndStr = currentMonthEnd.toISOString().split("T")[0]
        const prevStartStr = previousMonthStart.toISOString().split("T")[0]
        const prevEndStr = previousMonthEnd.toISOString().split("T")[0]

        // Fetch current month's total revenue
        const { data: currentData, error: currentError } = await supabase
          .from("payments")
          .select("amount")
          .gte("payment_date", currentStartStr)
          .lte("payment_date", currentEndStr)
          .eq("status", "completed")

        if (currentError) {
          throw new Error(`Error fetching current revenue: ${currentError.message}`)
        }

        // Fetch previous month's total revenue
        const { data: previousData, error: previousError } = await supabase
          .from("payments")
          .select("amount")
          .gte("payment_date", prevStartStr)
          .lte("payment_date", prevEndStr)
          .eq("status", "completed")

        if (previousError) {
          throw new Error(`Error fetching previous revenue: ${previousError.message}`)
        }

        // Calculate total revenue for current month
        const currentTotal = currentData.reduce((sum, payment) => sum + (payment.amount || 0), 0)

        // Calculate total revenue for previous month
        const previousTotal = previousData.reduce((sum, payment) => sum + (payment.amount || 0), 0)

        // Calculate percentage change
        let change = 0
        if (previousTotal > 0) {
          change = ((currentTotal - previousTotal) / previousTotal) * 100
        }

        setTotalRevenue(currentTotal)
        setPercentageChange(change)
      } catch (err) {
        console.error("Error fetching revenue data:", err)
        setError(err.message || "Failed to load revenue data")
      } finally {
        setLoading(false)
      }
    }

    fetchRevenueData()
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    }).format(amount)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          className="h-4 w-4 text-muted-foreground"
        >
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      </CardHeader>
      <CardContent>
        {loading ? (
          <>
            <Skeleton className="h-8 w-[120px] mb-1" />
            <Skeleton className="h-4 w-[80px]" />
          </>
        ) : error ? (
          <div className="text-destructive text-sm">{error}</div>
        ) : (
          <>
            <div className="text-2xl font-bold">{formatCurrency(totalRevenue || 0)}</div>
            <p className={`text-xs ${percentageChange && percentageChange >= 0 ? "text-green-500" : "text-red-500"}`}>
              {percentageChange !== null
                ? percentageChange >= 0
                  ? `+${percentageChange.toFixed(1)}%`
                  : `${percentageChange.toFixed(1)}%`
                : "0%"}{" "}
              from last month
            </p>
          </>
        )}
      </CardContent>
    </Card>
  )
}
