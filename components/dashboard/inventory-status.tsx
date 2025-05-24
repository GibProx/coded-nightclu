"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ResponsiveTable } from "@/components/ui/responsive-table"
import { createClientClient } from "@/lib/supabase/client"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"

interface InventoryItem {
  id: string
  name: string
  category: string
  stock: number
  unit: string
  threshold: number
  supplier: string
}

interface InventoryStatusProps {
  fullList?: boolean
}

export function InventoryStatus({ fullList = false }: InventoryStatusProps) {
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchInventory() {
      setLoading(true)
      setError(null)

      try {
        const supabase = createClientClient()
        if (!supabase) {
          throw new Error("Could not create Supabase client")
        }

        const { data, error } = await supabase.from("inventory").select("*").order("stock", { ascending: true })

        if (error) {
          throw new Error(`Error fetching inventory: ${error.message}`)
        }

        if (data && data.length > 0) {
          setInventory(data as InventoryItem[])
        } else {
          setError("No inventory items found. Please add items on the inventory page.")
        }
      } catch (err) {
        console.error("Error fetching inventory:", err)
        setError(err instanceof Error ? err.message : "Unknown error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchInventory()
  }, [])

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
      render: (_, item) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            Order
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/dashboard/inventory/${item.id}/edit`}>Edit</Link>
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

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <h3 className="text-lg font-medium text-destructive">Error Loading Inventory</h3>
        <p className="text-sm text-muted-foreground mt-2">{error}</p>
        <div className="mt-4">
          <Button asChild>
            <Link href="/dashboard/inventory">Go to Inventory Page</Link>
          </Button>
        </div>
      </div>
    )
  }

  if (inventory.length === 0) {
    return (
      <div className="text-center py-8">
        <h3 className="text-lg font-medium">No inventory items found</h3>
        <p className="text-sm text-muted-foreground mt-2">Add items on the inventory page to see them here.</p>
        <div className="mt-4">
          <Button asChild>
            <Link href="/dashboard/inventory/new">Add Inventory Item</Link>
          </Button>
        </div>
      </div>
    )
  }

  const displayInventory = fullList ? inventory : inventory.slice(0, 5)

  return (
    <ResponsiveTable
      data={displayInventory}
      columns={fullList ? columns : simpleColumns}
      emptyState={
        <div className="text-center py-8">
          <h3 className="text-lg font-medium">No inventory items found</h3>
          <p className="text-sm text-muted-foreground mt-2">Add items on the inventory page to see them here.</p>
          <div className="mt-4">
            <Button asChild>
              <Link href="/dashboard/inventory/new">Add Inventory Item</Link>
            </Button>
          </div>
        </div>
      }
    />
  )
}
