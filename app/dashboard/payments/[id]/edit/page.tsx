import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { ClientEditPaymentForm } from "@/components/dashboard/client-edit-payment-form"

interface EditPaymentPageProps {
  params: {
    id: string
  }
}

export default function EditPaymentPage({ params }: EditPaymentPageProps) {
  const { id } = params

  return (
    <DashboardShell>
      <DashboardHeader heading="Edit Payment" text="Update payment details" />
      <ClientEditPaymentForm paymentId={id} />
    </DashboardShell>
  )
}
