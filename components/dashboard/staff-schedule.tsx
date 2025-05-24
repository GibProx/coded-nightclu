"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function StaffSchedule() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [view, setView] = useState("week")

  // Sample schedule data
  const scheduleData = [
    {
      id: 1,
      name: "Alex Johnson",
      role: "Bar Manager",
      shift: "Evening (6pm-2am)",
      days: ["Monday", "Tuesday", "Wednesday", "Friday"],
    },
    {
      id: 2,
      name: "Jamie Smith",
      role: "Security Lead",
      shift: "Evening (8pm-4am)",
      days: ["Friday", "Saturday", "Sunday"],
    },
    { id: 3, name: "Taylor Williams", role: "DJ", shift: "Night (10pm-4am)", days: ["Friday", "Saturday"] },
    {
      id: 4,
      name: "Morgan Lee",
      role: "Bartender",
      shift: "Evening (6pm-2am)",
      days: ["Thursday", "Friday", "Saturday", "Sunday"],
    },
    {
      id: 5,
      name: "Casey Brown",
      role: "Event Coordinator",
      shift: "Day (10am-6pm)",
      days: ["Monday", "Tuesday", "Wednesday", "Thursday"],
    },
  ]

  // Get current day of week
  const currentDay = date ? new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(date) : ""

  // Filter schedule for current day
  const todaySchedule = scheduleData.filter((staff) => staff.days.includes(currentDay))

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <Card className="flex-1">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">Staff Calendar</h3>
              <Select value={view} onValueChange={setView}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="View" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Day</SelectItem>
                  <SelectItem value="week">Week</SelectItem>
                  <SelectItem value="month">Month</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md border" />
          </CardContent>
        </Card>

        <Card className="flex-1">
          <CardContent className="p-4">
            <h3 className="font-medium mb-4">
              {date ? (
                <>
                  Schedule for{" "}
                  {new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric" }).format(date)}
                </>
              ) : (
                <>Select a date</>
              )}
            </h3>

            {todaySchedule.length > 0 ? (
              <div className="space-y-4">
                {todaySchedule.map((staff) => (
                  <div key={staff.id} className="flex items-center justify-between border-b pb-2">
                    <div>
                      <p className="font-medium">{staff.name}</p>
                      <p className="text-sm text-muted-foreground">{staff.role}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">{staff.shift}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">No staff scheduled for this day</div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-4">
          <h3 className="font-medium mb-4">Weekly Overview</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Staff Member</th>
                  <th className="text-center p-2">Mon</th>
                  <th className="text-center p-2">Tue</th>
                  <th className="text-center p-2">Wed</th>
                  <th className="text-center p-2">Thu</th>
                  <th className="text-center p-2">Fri</th>
                  <th className="text-center p-2">Sat</th>
                  <th className="text-center p-2">Sun</th>
                </tr>
              </thead>
              <tbody>
                {scheduleData.map((staff) => (
                  <tr key={staff.id} className="border-b">
                    <td className="p-2">
                      <div>
                        <p className="font-medium">{staff.name}</p>
                        <p className="text-xs text-muted-foreground">{staff.role}</p>
                      </div>
                    </td>
                    {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                      <td key={day} className="text-center p-2">
                        {staff.days.includes(day) ? (
                          <div className="h-2 w-2 bg-green-500 rounded-full mx-auto" title={staff.shift}></div>
                        ) : (
                          <div className="h-2 w-2 bg-gray-200 rounded-full mx-auto"></div>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
