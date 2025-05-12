"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const data = [
  {
    name: "Mon",
    revenue: 4000,
    guests: 240,
  },
  {
    name: "Tue",
    revenue: 3000,
    guests: 180,
  },
  {
    name: "Wed",
    revenue: 5000,
    guests: 300,
  },
  {
    name: "Thu",
    revenue: 8000,
    guests: 480,
  },
  {
    name: "Fri",
    revenue: 12000,
    guests: 720,
  },
  {
    name: "Sat",
    revenue: 15000,
    guests: 900,
  },
  {
    name: "Sun",
    revenue: 10000,
    guests: 600,
  },
]

export function Overview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Overview</CardTitle>
        <CardDescription>Revenue and guest attendance for the past week.</CardDescription>
      </CardHeader>
      <CardContent className="px-2">
        <ChartContainer
          config={{
            revenue: {
              label: "Revenue",
              color: "hsl(var(--chart-1))",
            },
            guests: {
              label: "Guests",
              color: "hsl(var(--chart-2))",
            },
          }}
          className="h-[200px] sm:h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" orientation="left" stroke="var(--color-revenue)" />
              <YAxis yAxisId="right" orientation="right" stroke="var(--color-guests)" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar yAxisId="left" dataKey="revenue" fill="var(--color-revenue)" radius={[4, 4, 0, 0]} />
              <Bar yAxisId="right" dataKey="guests" fill="var(--color-guests)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
