"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Edit, AlertTriangle } from "lucide-react"
import { OrderInventoryDialog } from "./order-inventory-dialog"

interface InventoryItemProps {
  item: {
    id: string
    name: string
    category: string
    stock: number
    unit: string
    cost: number
    threshold: number
    supplier?: string | null
    last_ordered?: string | null
  }
  onRefresh?: () => void
}

export function InventoryItem({ item, onRefresh }: InventoryItemProps) {
  // Determine if stock is low (below threshold)
  const isLowStock = item.stock <= item.threshold

  return (
    <Card className={isLowStock ? "border-red-200" : ""}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{item.name}</CardTitle>
          {isLowStock && (
            <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">
              <AlertTriangle className="h-3 w-3 mr-1" />
              Low Stock
            </Badge>
          )}
        </div>
        <Badge variant="outline" className="mt-1">
          {item.category}
        </Badge>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="text-muted-foreground">Current Stock</p>
            <p className="font-medium">
              {item.stock} {item.unit}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Threshold</p>
            <p className="font-medium">
              {item.threshold} {item.unit}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Cost</p>
            <p className="font-medium">${item.cost.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Supplier</p>
            <p className="font-medium">{item.supplier || "Not specified"}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-2">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/dashboard/inventory/${item.id}/edit`}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Link>
        </Button>
        <OrderInventoryDialog item={item} onOrderComplete={onRefresh} />
      </CardFooter>
    </Card>
  )
}
