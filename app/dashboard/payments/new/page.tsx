import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { ClientNewPaymentForm } from "@/components/dashboard/client-new-payment-form"

export default function NewPaymentPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="New Payment" text="Create a new payment record" />
      <ClientNewPaymentForm />
    </DashboardShell>
  )
}
