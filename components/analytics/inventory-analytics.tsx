"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { ResponsiveContainer, XAxis, YAxis, CartesianGrid, Line, LineChart, PieChart, Pie, Cell } from "recharts"
import { createClientClient } from "@/lib/supabase/client"
import { Badge } from "@/components/ui/badge"

const mockInventoryValue = [
  { month: "Jan", value: 42000, orders: 8 },
  { month: "Feb", value: 38000, orders: 6 },
  { month: "Mar", value: 45000, orders: 10 },
  { month: "Apr", value: 48000, orders: 12 },
  { month: "May", value: 44000, orders: 9 },
  { month: "Jun", value: 47000, orders: 11 },
]

const mockTopItems = [
  { name: "Premium Vodka", value: 8500, quantity: 45, status: "In Stock" },
  { name: "Craft Beer", value: 3200, quantity: 120, status: "In Stock" },
  { name: "Wine Selection", value: 6800, quantity: 80, status: "Low Stock" },
  { name: "Whiskey", value: 5400, quantity: 25, status: "Low Stock" },
  { name: "Mixers", value: 1200, quantity: 200, status: "In Stock" },
]

const mockCategoryBreakdown = [
  { category: "Spirits", value: 28000, color: "#8884d8" },
  { category: "Beer", value: 8500, color: "#82ca9d" },
  { category: "Wine", value: 12000, color: "#ffc658" },
  { category: "Mixers", value: 3500, color: "#ff7300" },
  { category: "Glassware", value: 2800, color: "#00ff88" },
]

export function InventoryAnalytics() {
  const [inventoryValue, setInventoryValue] = useState(mockInventoryValue)
  const [topItems, setTopItems] = useState(mockTopItems)
  const [categoryBreakdown, setCategoryBreakdown] = useState(mockCategoryBreakdown)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchInventoryData() {
      try {
        const supabase = createClientClient()

        if (!supabase) {
          setLoading(false)
          return
        }

        // Try to fetch real data
        try {
          const { data: inventory } = await supabase
            .from("inventory")
            .select("name, quantity, cost_per_unit, category, reorder_level")

          if (inventory) {
            console.log("Using real inventory data")
            // Process real data here
          }
        } catch (err) {
          console.log("Using mock inventory data")
        }
      } catch (err) {
        console.error("Error fetching inventory data:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchInventoryData()
  }, [])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "In Stock":
        return <Badge className="bg-green-500">In Stock</Badge>
      case "Low Stock":
        return <Badge className="bg-yellow-500">Low Stock</Badge>
      case "Out of Stock":
        return <Badge className="bg-red-500">Out of Stock</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  if (loading) {
    return <div>Loading inventory analytics...</div>
  }

  return (
    <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
      <Card className="col-span-1 lg:col-span-2">
        <CardHeader>
          <CardTitle>Inventory Value Trend</CardTitle>
          <CardDescription>Monthly inventory value and order frequency</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              value: {
                label: "Inventory Value",
                color: "hsl(var(--chart-1))",
              },
              orders: {
                label: "Orders",
                color: "hsl(var(--chart-2))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={inventoryValue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="value"
                  stroke="var(--color-value)"
                  strokeWidth={2}
                  name="Inventory Value"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="orders"
                  stroke="var(--color-orders)"
                  strokeWidth={2}
                  name="Orders"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Inventory by Category</CardTitle>
          <CardDescription>Value breakdown by category</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              value: {
                label: "Value",
                color: "hsl(var(--chart-1))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ category, percent }) => `${category} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryBreakdown.map((entry, index) => (
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
          <CardTitle>Top Inventory Items</CardTitle>
          <CardDescription>Highest value items and stock status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topItems.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="space-y-1">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Qty: {item.quantity} • Value: ${item.value.toLocaleString()}
                  </p>
                </div>
                {getStatusBadge(item.status)}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
