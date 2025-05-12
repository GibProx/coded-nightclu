import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ResponsiveTable } from "@/components/ui/responsive-table"

export default function SecurityPage() {
  // Sample security log data
  const securityLogs = [
    {
      id: "SL001",
      timestamp: "2023-11-15 22:34:12",
      type: "Access Denied",
      location: "VIP Entrance",
      description: "Guest attempted to enter VIP area without proper credentials",
      status: "resolved",
      assignedTo: "Maria Garcia",
    },
    {
      id: "SL002",
      timestamp: "2023-11-15 23:15:45",
      type: "Altercation",
      location: "Main Bar",
      description: "Verbal dispute between guests, security intervened",
      status: "resolved",
      assignedTo: "James Wilson",
    },
    {
      id: "SL003",
      timestamp: "2023-11-16 00:22:18",
      type: "Medical",
      location: "Dance Floor",
      description: "Guest feeling lightheaded, medical assistance provided",
      status: "resolved",
      assignedTo: "Emily Davis",
    },
    {
      id: "SL004",
      timestamp: "2023-11-16 01:05:33",
      type: "Suspicious Activity",
      location: "Restroom Area",
      description: "Possible drug use reported, under investigation",
      status: "pending",
      assignedTo: "Robert Johnson",
    },
    {
      id: "SL005",
      timestamp: "2023-11-16 01:47:21",
      type: "Ejection",
      location: "Main Entrance",
      description: "Intoxicated guest removed from premises",
      status: "resolved",
      assignedTo: "Maria Garcia",
    },
  ]

  const columns = [
    { key: "id", title: "ID" },
    { key: "timestamp", title: "Timestamp" },
    {
      key: "type",
      title: "Type",
      render: (value: string) => (
        <Badge
          variant={
            value === "Access Denied"
              ? "outline"
              : value === "Altercation"
                ? "destructive"
                : value === "Medical"
                  ? "secondary"
                  : value === "Suspicious Activity"
                    ? "warning"
                    : "default"
          }
        >
          {value}
        </Badge>
      ),
    },
    { key: "location", title: "Location" },
    {
      key: "description",
      title: "Description",
      className: "max-w-xs truncate",
    },
    {
      key: "status",
      title: "Status",
      render: (value: string) => <Badge variant={value === "resolved" ? "success" : "secondary"}>{value}</Badge>,
    },
    { key: "assignedTo", title: "Assigned To" },
    {
      key: "actions",
      title: "Actions",
      render: () => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            View
          </Button>
          <Button variant="ghost" size="sm">
            Update
          </Button>
        </div>
      ),
    },
  ]

  return (
    <DashboardShell>
      <DashboardHeader heading="Security Log" text="Monitor and manage security incidents" />

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="w-full flex-wrap justify-start">
          <TabsTrigger value="all">All Incidents</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="resolved">Resolved</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Incidents</CardTitle>
              <CardDescription>Complete log of all security incidents and their current status.</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveTable
                data={securityLogs}
                columns={columns}
                emptyState={
                  <div className="text-center py-8">
                    <h3 className="text-lg font-medium">No incidents found</h3>
                    <p className="text-sm text-muted-foreground mt-2">There are no security incidents to display.</p>
                  </div>
                }
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Incidents</CardTitle>
              <CardDescription>Security incidents that require attention or follow-up.</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveTable
                data={securityLogs.filter((log) => log.status === "pending")}
                columns={columns}
                emptyState={
                  <div className="text-center py-8">
                    <h3 className="text-lg font-medium">No pending incidents</h3>
                    <p className="text-sm text-muted-foreground mt-2">
                      There are no pending security incidents to display.
                    </p>
                  </div>
                }
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resolved" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Resolved Incidents</CardTitle>
              <CardDescription>Security incidents that have been addressed and resolved.</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveTable
                data={securityLogs.filter((log) => log.status === "resolved")}
                columns={columns}
                emptyState={
                  <div className="text-center py-8">
                    <h3 className="text-lg font-medium">No resolved incidents</h3>
                    <p className="text-sm text-muted-foreground mt-2">
                      There are no resolved security incidents to display.
                    </p>
                  </div>
                }
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}
