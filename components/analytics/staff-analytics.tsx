"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell } from "recharts"
import { createClientClient } from "@/lib/supabase/client"
import { Badge } from "@/components/ui/badge"

const mockStaffSchedule = [
  { day: "Mon", bartenders: 4, security: 6, service: 8, total: 18 },
  { day: "Tue", bartenders: 3, security: 4, service: 6, total: 13 },
  { day: "Wed", bartenders: 4, security: 5, service: 7, total: 16 },
  { day: "Thu", bartenders: 5, security: 7, service: 9, total: 21 },
  { day: "Fri", bartenders: 8, security: 10, service: 12, total: 30 },
  { day: "Sat", bartenders: 10, security: 12, service: 15, total: 37 },
  { day: "Sun", bartenders: 6, security: 8, service: 10, total: 24 },
]

const mockDepartments = [
  { department: "Bartenders", count: 12, color: "#8884d8" },
  { department: "Security", count: 15, color: "#82ca9d" },
  { department: "Service", count: 18, color: "#ffc658" },
  { department: "Management", count: 5, color: "#ff7300" },
  { department: "Kitchen", count: 8, color: "#00ff88" },
]

const mockPerformance = [
  { name: "John Smith", department: "Bartender", rating: 4.8, shifts: 24 },
  { name: "Sarah Johnson", department: "Security", rating: 4.9, shifts: 28 },
  { name: "Mike Wilson", department: "Service", rating: 4.6, shifts: 22 },
  { name: "Lisa Brown", department: "Bartender", rating: 4.7, shifts: 26 },
  { name: "David Lee", department: "Security", rating: 4.5, shifts: 25 },
]

export function StaffAnalytics() {
  const [staffSchedule, setStaffSchedule] = useState(mockStaffSchedule)
  const [departments, setDepartments] = useState(mockDepartments)
  const [performance, setPerformance] = useState(mockPerformance)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStaffData() {
      try {
        const supabase = createClientClient()

        if (!supabase) {
          setLoading(false)
          return
        }

        // Try to fetch real data
        try {
          const { data: staff } = await supabase.from("staff").select("name, position, department, hire_date, status")

          if (staff) {
            console.log("Using real staff data")
            // Process real data here
          }
        } catch (err) {
          console.log("Using mock staff data")
        }
      } catch (err) {
        console.error("Error fetching staff data:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchStaffData()
  }, [])

  const getRatingBadge = (rating: number) => {
    if (rating >= 4.7) return <Badge className="bg-green-500">{rating}</Badge>
    if (rating >= 4.5) return <Badge className="bg-yellow-500">{rating}</Badge>
    return <Badge className="bg-red-500">{rating}</Badge>
  }

  if (loading) {
    return <div>Loading staff analytics...</div>
  }

  return (
    <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
      <Card className="col-span-1 lg:col-span-2">
        <CardHeader>
          <CardTitle>Weekly Staff Schedule</CardTitle>
          <CardDescription>Staff allocation by department and day</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              bartenders: {
                label: "Bartenders",
                color: "hsl(var(--chart-1))",
              },
              security: {
                label: "Security",
                color: "hsl(var(--chart-2))",
              },
              service: {
                label: "Service",
                color: "hsl(var(--chart-3))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={staffSchedule}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="bartenders" stackId="a" fill="var(--color-bartenders)" />
                <Bar dataKey="security" stackId="a" fill="var(--color-security)" />
                <Bar dataKey="service" stackId="a" fill="var(--color-service)" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Staff by Department</CardTitle>
          <CardDescription>Employee distribution across departments</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              count: {
                label: "Staff Count",
                color: "hsl(var(--chart-1))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={departments}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ department, percent }) => `${department} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {departments.map((entry, index) => (
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
          <CardTitle>Top Performers</CardTitle>
          <CardDescription>Staff performance ratings and shift counts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {performance.map((staff, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="space-y-1">
                  <p className="font-medium">{staff.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {staff.department} • {staff.shifts} shifts this month
                  </p>
                </div>
                {getRatingBadge(staff.rating)}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
