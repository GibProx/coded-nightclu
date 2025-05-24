"use client"

import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { ClientViewReceipt } from "@/components/dashboard/client-view-receipt"

interface ViewReceiptPageProps {
  params: {
    id: string
  }
}

export default function ViewReceiptPage({ params }: ViewReceiptPageProps) {
  const { id } = params

  return (
    <DashboardShell>
      <DashboardHeader heading="Payment Receipt" text="View payment details and receipt" />
      <ClientViewReceipt paymentId={id} />
    </DashboardShell>
  )
}
