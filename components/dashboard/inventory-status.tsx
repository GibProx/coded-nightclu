"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ResponsiveTable } from "@/components/ui/responsive-table"

interface InventoryStatusProps {
  fullList?: boolean
}

export function InventoryStatus({ fullList = false }: InventoryStatusProps) {
  const inventory = [
    {
      id: "I001",
      name: "Grey Goose Vodka",
      category: "Spirits",
      stock: 85,
      unit: "bottles",
      threshold: 20,
      supplier: "Premium Spirits Inc.",
    },
    {
      id: "I002",
      name: "Hendrick's Gin",
      category: "Spirits",
      stock: 42,
      unit: "bottles",
      threshold: 15,
      supplier: "Premium Spirits Inc.",
    },
    {
      id: "I003",
      name: "Patron Silver Tequila",
      category: "Spirits",
      stock: 28,
      unit: "bottles",
      threshold: 15,
      supplier: "Premium Spirits Inc.",
    },
    {
      id: "I004",
      name: "Red Bull",
      category: "Mixers",
      stock: 120,
      unit: "cans",
      threshold: 50,
      supplier: "Beverage Distributors Ltd.",
    },
    {
      id: "I005",
      name: "Lime Juice",
      category: "Mixers",
      stock: 18,
      unit: "bottles",
      threshold: 20,
      supplier: "Fresh Ingredients Co.",
    },
    {
      id: "I006",
      name: "Champagne",
      category: "Wine",
      stock: 65,
      unit: "bottles",
      threshold: 30,
      supplier: "Wine Importers LLC",
    },
    {
      id: "I007",
      name: "Glassware - Highball",
      category: "Equipment",
      stock: 210,
      unit: "glasses",
      threshold: 100,
      supplier: "Bar Supplies Inc.",
    },
  ]

  const displayInventory = fullList ? inventory : inventory.slice(0, 5)

  const columns = [
    {
      key: "name",
      title: "Item",
      render: (value, item) => (
        <div>
          <div className="font-medium">{value}</div>
          <div className="text-xs text-muted-foreground">{item.unit}</div>
        </div>
      ),
    },
    {
      key: "stock",
      title: "Stock",
      render: (value, item) => (
        <div className="flex items-center gap-2">
          <Progress
            value={(item.stock / (item.threshold * 5)) * 100}
            className="w-[80px]"
            indicatorClassName={
              item.stock < item.threshold
                ? "bg-destructive"
                : item.stock < item.threshold * 2
                  ? "bg-warning"
                  : "bg-primary"
            }
          />
          <span>{value}</span>
          {item.stock < item.threshold && <Badge variant="destructive">Low</Badge>}
        </div>
      ),
    },
    { key: "category", title: "Category" },
    { key: "supplier", title: "Supplier" },
    {
      key: "actions",
      title: "Actions",
      render: () => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            Order
          </Button>
          <Button variant="ghost" size="sm">
            Edit
          </Button>
        </div>
      ),
    },
  ]

  // Simplified columns for non-full list view
  const simpleColumns = [
    {
      key: "name",
      title: "Item",
      render: (value, item) => (
        <div>
          <div className="font-medium">{value}</div>
          <div className="text-xs text-muted-foreground">{item.unit}</div>
        </div>
      ),
    },
    {
      key: "stock",
      title: "Stock",
      render: (value, item) => (
        <div className="flex items-center gap-2">
          <Progress
            value={(item.stock / (item.threshold * 5)) * 100}
            className="w-[80px]"
            indicatorClassName={
              item.stock < item.threshold
                ? "bg-destructive"
                : item.stock < item.threshold * 2
                  ? "bg-warning"
                  : "bg-primary"
            }
          />
          <span>{value}</span>
          {item.stock < item.threshold && <Badge variant="destructive">Low</Badge>}
        </div>
      ),
    },
  ]

  return (
    <ResponsiveTable
      data={displayInventory}
      columns={fullList ? columns : simpleColumns}
      emptyState={
        <div className="text-center py-8">
          <h3 className="text-lg font-medium">No inventory items found</h3>
          <p className="text-sm text-muted-foreground mt-2">There are no inventory items to display.</p>
        </div>
      }
    />
  )
}
