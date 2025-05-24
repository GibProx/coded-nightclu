import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Button } from "@/components/ui/button"
import { PlusIcon } from "lucide-react"
import { getInventoryItems, getInventoryByCategory } from "@/app/actions/inventory-actions"
import { InventoryTable } from "@/components/dashboard/inventory-table"
import { Suspense } from "react"
import { ErrorBoundary } from "@/components/ui/error-boundary"

export default async function InventoryPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Inventory Management" text="Track and manage your inventory and supplies">
        <Button className="ml-auto" asChild>
          <a href="/dashboard/inventory/new">
            <PlusIcon className="mr-2 h-4 w-4" />
            Add Item
          </a>
        </Button>
      </DashboardHeader>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Items</TabsTrigger>
          <TabsTrigger value="spirits">Spirits</TabsTrigger>
          <TabsTrigger value="mixers">Mixers</TabsTrigger>
          <TabsTrigger value="equipment">Equipment</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Items</CardTitle>
              <CardDescription>Complete list of all inventory items and their current stock levels.</CardDescription>
            </CardHeader>
            <CardContent>
              <ErrorBoundary
                fallback={
                  <div className="text-center py-4">Error loading inventory items. Please try again later.</div>
                }
              >
                <Suspense fallback={<div className="text-center py-4">Loading inventory items...</div>}>
                  <AllInventoryItems />
                </Suspense>
              </ErrorBoundary>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="spirits" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Spirits Inventory</CardTitle>
              <CardDescription>Track all spirits and liquor inventory.</CardDescription>
            </CardHeader>
            <CardContent>
              <ErrorBoundary
                fallback={
                  <div className="text-center py-4">Error loading spirits inventory. Please try again later.</div>
                }
              >
                <Suspense fallback={<div className="text-center py-4">Loading spirits inventory...</div>}>
                  <CategoryInventoryItems category="Spirits" />
                </Suspense>
              </ErrorBoundary>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mixers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Mixers & Non-Alcoholic</CardTitle>
              <CardDescription>Track all mixers, juices, and non-alcoholic beverages.</CardDescription>
            </CardHeader>
            <CardContent>
              <ErrorBoundary
                fallback={
                  <div className="text-center py-4">Error loading mixers inventory. Please try again later.</div>
                }
              >
                <Suspense fallback={<div className="text-center py-4">Loading mixers inventory...</div>}>
                  <CategoryInventoryItems category="Mixers" />
                </Suspense>
              </ErrorBoundary>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="equipment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Equipment & Supplies</CardTitle>
              <CardDescription>Track all bar equipment, glassware, and other supplies.</CardDescription>
            </CardHeader>
            <CardContent>
              <ErrorBoundary
                fallback={
                  <div className="text-center py-4">Error loading equipment inventory. Please try again later.</div>
                }
              >
                <Suspense fallback={<div className="text-center py-4">Loading equipment inventory...</div>}>
                  <CategoryInventoryItems category="Equipment" />
                </Suspense>
              </ErrorBoundary>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}

async function AllInventoryItems() {
  const inventoryItems = await getInventoryItems()
  return <InventoryTable inventory={inventoryItems} />
}

async function CategoryInventoryItems({ category }: { category: string }) {
  const inventoryItems = await getInventoryByCategory(category)
  return <InventoryTable inventory={inventoryItems} />
}
