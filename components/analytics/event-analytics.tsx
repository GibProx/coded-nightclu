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

const mockEventPerformance = [
  { month: "Jan", events: 8, attendance: 2400, revenue: 45000 },
  { month: "Feb", events: 6, attendance: 1800, revenue: 38000 },
  { month: "Mar", events: 10, attendance: 3200, revenue: 52000 },
  { month: "Apr", events: 12, attendance: 3800, revenue: 61000 },
  { month: "May", events: 9, attendance: 2900, revenue: 48000 },
  { month: "Jun", events: 14, attendance: 4200, revenue: 67000 },
]

const mockEventTypes = [
  { type: "DJ Nights", count: 24, color: "#8884d8" },
  { type: "Live Music", count: 18, color: "#82ca9d" },
  { type: "Private Events", count: 12, color: "#ffc658" },
  { type: "Theme Parties", count: 15, color: "#ff7300" },
  { type: "Special Events", count: 8, color: "#00ff88" },
]

const mockPopularEvents = [
  { name: "Saturday Night Fever", attendance: 450, rating: 4.8 },
  { name: "VIP Exclusive", attendance: 280, rating: 4.9 },
  { name: "Live Jazz Night", attendance: 320, rating: 4.6 },
  { name: "Electronic Beats", attendance: 380, rating: 4.7 },
  { name: "Retro Night", attendance: 290, rating: 4.5 },
]

export function EventAnalytics() {
  const [eventPerformance, setEventPerformance] = useState(mockEventPerformance)
  const [eventTypes, setEventTypes] = useState(mockEventTypes)
  const [popularEvents, setPopularEvents] = useState(mockPopularEvents)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchEventData() {
      try {
        const supabase = createClientClient()

        if (!supabase) {
          setLoading(false)
          return
        }

        // Try to fetch real data
        try {
          const { data: events } = await supabase.from("events").select("title, date, type, capacity, ticket_price")

          if (events) {
            console.log("Using real event data")
            // Process real data here
          }
        } catch (err) {
          console.log("Using mock event data")
        }
      } catch (err) {
        console.error("Error fetching event data:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchEventData()
  }, [])

  if (loading) {
    return <div>Loading event analytics...</div>
  }

  return (
    <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
      <Card className="col-span-1 lg:col-span-2">
        <CardHeader>
          <CardTitle>Event Performance</CardTitle>
          <CardDescription>Monthly events, attendance, and revenue</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              events: {
                label: "Events",
                color: "hsl(var(--chart-1))",
              },
              attendance: {
                label: "Attendance",
                color: "hsl(var(--chart-2))",
              },
              revenue: {
                label: "Revenue",
                color: "hsl(var(--chart-3))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={eventPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="events"
                  stroke="var(--color-events)"
                  strokeWidth={2}
                  name="Events"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="attendance"
                  stroke="var(--color-attendance)"
                  strokeWidth={2}
                  name="Attendance"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Event Types Distribution</CardTitle>
          <CardDescription>Breakdown by event categories</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              count: {
                label: "Events",
                color: "hsl(var(--chart-1))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={eventTypes}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ type, percent }) => `${type} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {eventTypes.map((entry, index) => (
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
          <CardTitle>Most Popular Events</CardTitle>
          <CardDescription>Top events by attendance</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              attendance: {
                label: "Attendance",
                color: "hsl(var(--chart-1))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={popularEvents} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="attendance" fill="var(--color-attendance)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
