import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { InventoryForm } from "@/components/dashboard/inventory-form"
import { ErrorBoundary } from "@/components/ui/error-boundary"

export default function InventoryNewPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Add Inventory Item" text="Add a new item to your inventory." />
      <div className="grid gap-6">
        <ErrorBoundary fallback={<div className="p-4 text-center">Error loading form. Please try again later.</div>}>
          <InventoryForm />
        </ErrorBoundary>
      </div>
    </DashboardShell>
  )
}
