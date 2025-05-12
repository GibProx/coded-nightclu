import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default function PaymentsPage() {
  // Sample payment data
  const payments = [
    {
      id: "P001",
      date: "2023-11-15",
      customer: "Alex Johnson",
      amount: "$450.00",
      method: "Credit Card",
      status: "completed",
      items: "VIP Table Service, Bottles (2)",
    },
    {
      id: "P002",
      date: "2023-11-15",
      customer: "Samantha Lee",
      amount: "$180.00",
      method: "Cash",
      status: "completed",
      items: "Entry Tickets (4)",
    },
    {
      id: "P003",
      date: "2023-11-15",
      customer: "Michael Chen",
      amount: "$750.00",
      method: "Credit Card",
      status: "completed",
      items: "VIP Table Service, Bottles (3), Food",
    },
    {
      id: "P004",
      date: "2023-11-16",
      customer: "Jessica Taylor",
      amount: "$120.00",
      method: "Mobile Payment",
      status: "pending",
      items: "Entry Tickets (2), Drinks",
    },
    {
      id: "P005",
      date: "2023-11-16",
      customer: "David Wilson",
      amount: "$850.00",
      method: "Credit Card",
      status: "completed",
      items: "VIP Table Service, Bottles (4), Food",
    },
  ]

  return (
    <DashboardShell>
      <DashboardHeader heading="Payments" text="Track and manage all payment transactions" />

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Transactions</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Transactions</CardTitle>
              <CardDescription>Complete record of all payment transactions.</CardDescription>
            </CardHeader>
            <CardContent>
              <PaymentTable payments={payments} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Completed Payments</CardTitle>
              <CardDescription>Successfully completed payment transactions.</CardDescription>
            </CardHeader>
            <CardContent>
              <PaymentTable payments={payments.filter((payment) => payment.status === "completed")} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Payments</CardTitle>
              <CardDescription>Payment transactions that are still pending.</CardDescription>
            </CardHeader>
            <CardContent>
              <PaymentTable payments={payments.filter((payment) => payment.status === "pending")} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}

function PaymentTable({ payments }: { payments: any[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Method</TableHead>
          <TableHead>Items</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {payments.map((payment) => (
          <TableRow key={payment.id}>
            <TableCell className="font-medium">{payment.id}</TableCell>
            <TableCell>{payment.date}</TableCell>
            <TableCell>{payment.customer}</TableCell>
            <TableCell>{payment.amount}</TableCell>
            <TableCell>{payment.method}</TableCell>
            <TableCell className="max-w-xs truncate">{payment.items}</TableCell>
            <TableCell>
              <Badge variant={payment.status === "completed" ? "success" : "secondary"}>{payment.status}</Badge>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  View
                </Button>
                <Button variant="ghost" size="sm">
                  Receipt
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
