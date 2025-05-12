import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { InventoryStatus } from "@/components/dashboard/inventory-status"
import { Button } from "@/components/ui/button"
import { PlusIcon } from "lucide-react"

export default function InventoryPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Inventory Management" text="Track and manage your inventory and supplies">
        <Button className="ml-auto">
          <PlusIcon className="mr-2 h-4 w-4" />
          Add Item
        </Button>
      </DashboardHeader>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Items</TabsTrigger>
          <TabsTrigger value="spirits">Spirits</TabsTrigger>
          <TabsTrigger value="mixers">Mixers</TabsTrigger>
          <TabsTrigger value="equipment">Equipment</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Items</CardTitle>
              <CardDescription>Complete list of all inventory items and their current stock levels.</CardDescription>
            </CardHeader>
            <CardContent>
              <InventoryStatus fullList={true} />
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
              <InventoryStatus fullList={true} />
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
              <InventoryStatus fullList={true} />
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
              <InventoryStatus fullList={true} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Purchase Orders</CardTitle>
              <CardDescription>Manage supplier orders and deliveries.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <h3 className="text-lg font-medium">No Active Orders</h3>
                <p className="text-sm text-muted-foreground mt-2">There are no active purchase orders at this time.</p>
                <Button className="mt-4">Create New Order</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}
