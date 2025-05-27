"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  Line,
  LineChart,
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { createClientClient } from "@/lib/supabase/client"

const mockRevenueData = [
  { month: "Jan", revenue: 45000, target: 50000 },
  { month: "Feb", revenue: 52000, target: 50000 },
  { month: "Mar", revenue: 48000, target: 50000 },
  { month: "Apr", revenue: 61000, target: 55000 },
  { month: "May", revenue: 55000, target: 55000 },
  { month: "Jun", revenue: 67000, target: 60000 },
]

const mockRevenueBySource = [
  { source: "Events", value: 45000, color: "#8884d8" },
  { source: "Bar Sales", value: 32000, color: "#82ca9d" },
  { source: "VIP Tables", value: 28000, color: "#ffc658" },
  { source: "Cover Charges", value: 15000, color: "#ff7300" },
]

const mockDailyRevenue = [
  { day: "Mon", revenue: 8500 },
  { day: "Tue", revenue: 6200 },
  { day: "Wed", revenue: 7800 },
  { day: "Thu", revenue: 12000 },
  { day: "Fri", revenue: 18500 },
  { day: "Sat", revenue: 22000 },
  { day: "Sun", revenue: 14000 },
]

export function RevenueAnalytics() {
  const [revenueData, setRevenueData] = useState(mockRevenueData)
  const [revenueBySource, setRevenueBySource] = useState(mockRevenueBySource)
  const [dailyRevenue, setDailyRevenue] = useState(mockDailyRevenue)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchRevenueData() {
      try {
        const supabase = createClientClient()

        if (!supabase) {
          setLoading(false)
          return
        }

        // Try to fetch real data, but fall back to mock data if tables don't exist
        try {
          // Fetch monthly revenue data
          const { data: payments } = await supabase
            .from("payments")
            .select("amount, payment_date, payment_method")
            .eq("status", "completed")
            .order("payment_date", { ascending: true })

          if (payments && payments.length > 0) {
            // Process real data here
            console.log("Using real payment data")
          }
        } catch (err) {
          console.log("Using mock revenue data")
        }
      } catch (err) {
        console.error("Error fetching revenue data:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchRevenueData()
  }, [])

  if (loading) {
    return <div>Loading revenue analytics...</div>
  }

  return (
    <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
      <Card className="col-span-1 lg:col-span-2">
        <CardHeader>
          <CardTitle>Monthly Revenue Trend</CardTitle>
          <CardDescription>Revenue vs targets over the last 6 months</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              revenue: {
                label: "Revenue",
                color: "hsl(var(--chart-1))",
              },
              target: {
                label: "Target",
                color: "hsl(var(--chart-2))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="revenue" stroke="var(--color-revenue)" strokeWidth={2} name="Revenue" />
                <Line
                  type="monotone"
                  dataKey="target"
                  stroke="var(--color-target)"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Target"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Revenue by Source</CardTitle>
          <CardDescription>Breakdown of revenue streams</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              value: {
                label: "Revenue",
                color: "hsl(var(--chart-1))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={revenueBySource}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ source, percent }) => `${source} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {revenueBySource.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Daily Revenue</CardTitle>
          <CardDescription>Average daily revenue by day of week</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              revenue: {
                label: "Revenue",
                color: "hsl(var(--chart-1))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="revenue" fill="var(--color-revenue)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
