import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { ClientPaymentsContent } from "@/components/dashboard/client-payments-content"

export default function PaymentsPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Payments" text="Track and manage all payment transactions" />
      <ClientPaymentsContent />
    </DashboardShell>
  )
}
