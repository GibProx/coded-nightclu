"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createClientClient } from "@/lib/supabase/client"
import { Skeleton } from "@/components/ui/skeleton"

export function GuestsTonightCard() {
  const [guestCount, setGuestCount] = useState<number | null>(null)
  const [reservationCount, setReservationCount] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchGuestsData() {
      try {
        setLoading(true)
        const supabase = createClientClient()

        if (!supabase) {
          throw new Error("Supabase client not available")
        }

        // First, let's check the structure of the reservations table
        const { data: tableInfo, error: tableInfoError } = await supabase.from("reservations").select("*").limit(1)

        if (tableInfoError) {
          // If table doesn't exist, show error
          if (tableInfoError.message.includes("does not exist")) {
            throw new Error("Reservations table does not exist. Please run the setup script.")
          } else {
            throw new Error(`Table check error: ${tableInfoError.message}`)
          }
        }

        // Determine the date column name by checking the first record
        let dateColumnName = "date" // Default assumption
        let guestColumnName = "guest_count" // Default assumption

        if (tableInfo && tableInfo.length > 0) {
          const firstRecord = tableInfo[0]
          // Check which date column exists
          if ("reservation_date" in firstRecord) {
            dateColumnName = "reservation_date"
          } else if ("date" in firstRecord) {
            dateColumnName = "date"
          } else if ("booking_date" in firstRecord) {
            dateColumnName = "booking_date"
          } else if ("scheduled_for" in firstRecord) {
            dateColumnName = "scheduled_for"
          }

          // Check which guest count column exists
          if ("guest_count" in firstRecord) {
            guestColumnName = "guest_count"
          } else if ("guests" in firstRecord) {
            guestColumnName = "guests"
          } else if ("party_size" in firstRecord) {
            guestColumnName = "party_size"
          } else if ("number_of_guests" in firstRecord) {
            guestColumnName = "number_of_guests"
          }
        }

        // Get today's date in YYYY-MM-DD format
        const today = new Date()
        const todayStr = today.toISOString().split("T")[0]

        // Build the query dynamically based on the date column name
        let query = supabase.from("reservations").select(`id, ${guestColumnName}`).eq("status", "confirmed")

        // Add date filtering based on the column name
        // We need to handle both date and datetime columns
        if (dateColumnName) {
          // Try to determine if it's a date or datetime column
          const firstValue = tableInfo[0]?.[dateColumnName]
          const isDateTimeColumn = firstValue && firstValue.includes("T")

          if (isDateTimeColumn) {
            // For datetime columns
            query = query.gte(dateColumnName, `${todayStr}T00:00:00`).lt(dateColumnName, `${todayStr}T23:59:59`)
          } else {
            // For date columns
            query = query.eq(dateColumnName, todayStr)
          }
        }

        // Execute the query
        const { data: reservations, error: reservationsError } = await query

        if (reservationsError) {
          throw new Error(`Error fetching reservations: ${reservationsError.message}`)
        }

        // Count total guests and reservations
        let totalGuests = 0
        reservations.forEach((reservation) => {
          const guestCount = Number.parseInt(reservation[guestColumnName] || "0", 10)
          if (!isNaN(guestCount)) {
            totalGuests += guestCount
          }
        })

        setGuestCount(totalGuests)
        setReservationCount(reservations.length)
      } catch (err) {
        console.error("Error fetching guests data:", err)
        setError(err.message || "Failed to load guests data")
        // Fallback to mock data in case of error
        setGuestCount(Math.floor(Math.random() * 200) + 100) // Random number between 100 and 300
        setReservationCount(Math.floor(Math.random() * 100) + 50) // Random number between 50 and 150
      } finally {
        setLoading(false)
      }
    }

    fetchGuestsData()
  }, [])

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Guests Tonight</CardTitle>
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
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      </CardHeader>
      <CardContent>
        {loading ? (
          <>
            <Skeleton className="h-8 w-[80px] mb-1" />
            <Skeleton className="h-4 w-[100px]" />
          </>
        ) : error ? (
          <div className="flex flex-col">
            <div className="text-2xl font-bold">{guestCount !== null ? guestCount : 0}</div>
            <p className="text-xs text-muted-foreground">
              +{reservationCount !== null ? reservationCount : 0} reservations
            </p>
            <p className="text-xs text-destructive mt-2">{error}</p>
          </div>
        ) : (
          <>
            <div className="text-2xl font-bold">{guestCount !== null ? guestCount : 0}</div>
            <p className="text-xs text-muted-foreground">
              +{reservationCount !== null ? reservationCount : 0} reservations
            </p>
          </>
        )}
      </CardContent>
    </Card>
  )
}
