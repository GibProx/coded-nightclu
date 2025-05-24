import { notFound } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { InventoryForm } from "@/components/dashboard/inventory-form"
import { getInventoryItem } from "@/app/actions/inventory-actions"
import { ErrorBoundary } from "@/components/ui/error-boundary"

interface InventoryEditPageProps {
  params: {
    id: string
  }
}

export default async function InventoryEditPage({ params }: InventoryEditPageProps) {
  const inventoryItem = await getInventoryItem(params.id)

  if (!inventoryItem) {
    notFound()
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Edit Inventory Item" text="Update inventory item details and stock levels." />
      <div className="grid gap-6">
        <ErrorBoundary
          fallback={<div className="p-4 text-center">Error loading inventory item. Please try again later.</div>}
        >
          <InventoryForm initialData={inventoryItem} />
        </ErrorBoundary>
      </div>
    </DashboardShell>
  )
}
