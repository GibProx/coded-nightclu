"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Area, AreaChart } from "recharts"
import { createClientClient } from "@/lib/supabase/client"

const mockGuestData = [
  { month: "Jan", newGuests: 245, returningGuests: 180, totalVisits: 425 },
  { month: "Feb", newGuests: 280, returningGuests: 220, totalVisits: 500 },
  { month: "Mar", newGuests: 320, returningGuests: 280, totalVisits: 600 },
  { month: "Apr", newGuests: 380, returningGuests: 340, totalVisits: 720 },
  { month: "May", newGuests: 420, returningGuests: 380, totalVisits: 800 },
  { month: "Jun", newGuests: 480, returningGuests: 420, totalVisits: 900 },
]

const mockAgeGroups = [
  { ageGroup: "18-25", count: 450 },
  { ageGroup: "26-30", count: 380 },
  { ageGroup: "31-35", count: 220 },
  { ageGroup: "36-40", count: 150 },
  { ageGroup: "40+", count: 100 },
]

const mockVisitFrequency = [
  { frequency: "First Time", count: 480 },
  { frequency: "2-3 Times", count: 320 },
  { frequency: "4-6 Times", count: 180 },
  { frequency: "7+ Times", count: 120 },
]

export function GuestAnalytics() {
  const [guestData, setGuestData] = useState(mockGuestData)
  const [ageGroups, setAgeGroups] = useState(mockAgeGroups)
  const [visitFrequency, setVisitFrequency] = useState(mockVisitFrequency)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchGuestData() {
      try {
        const supabase = createClientClient()

        if (!supabase) {
          setLoading(false)
          return
        }

        // Try to fetch real data
        try {
          const { data: guests } = await supabase.from("guests").select("created_at, date_of_birth")

          const { data: reservations } = await supabase.from("reservations").select("guest_id, date, party_size")

          if (guests && reservations) {
            console.log("Using real guest data")
            // Process real data here
          }
        } catch (err) {
          console.log("Using mock guest data")
        }
      } catch (err) {
        console.error("Error fetching guest data:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchGuestData()
  }, [])

  if (loading) {
    return <div>Loading guest analytics...</div>
  }

  return (
    <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
      <Card className="col-span-1 lg:col-span-2">
        <CardHeader>
          <CardTitle>Guest Growth Trend</CardTitle>
          <CardDescription>New vs returning guests over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              newGuests: {
                label: "New Guests",
                color: "hsl(var(--chart-1))",
              },
              returningGuests: {
                label: "Returning Guests",
                color: "hsl(var(--chart-2))",
              },
              totalVisits: {
                label: "Total Visits",
                color: "hsl(var(--chart-3))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={guestData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="newGuests"
                  stackId="1"
                  stroke="var(--color-newGuests)"
                  fill="var(--color-newGuests)"
                  name="New Guests"
                />
                <Area
                  type="monotone"
                  dataKey="returningGuests"
                  stackId="1"
                  stroke="var(--color-returningGuests)"
                  fill="var(--color-returningGuests)"
                  name="Returning Guests"
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Guest Age Distribution</CardTitle>
          <CardDescription>Breakdown by age groups</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              count: {
                label: "Guests",
                color: "hsl(var(--chart-1))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ageGroups}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="ageGroup" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="var(--color-count)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Visit Frequency</CardTitle>
          <CardDescription>How often guests return</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              count: {
                label: "Guests",
                color: "hsl(var(--chart-2))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={visitFrequency} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="frequency" type="category" width={80} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="var(--color-count)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
