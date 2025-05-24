"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createInventoryItem, updateInventoryItem } from "@/app/actions/inventory-actions"
import type { Inventory } from "@/types/database"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { toast } from "@/components/ui/use-toast"

const inventoryFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  category: z.string().min(1, {
    message: "Please select a category.",
  }),
  stock: z.coerce.number().int().min(0, {
    message: "Stock must be a positive number.",
  }),
  unit: z.string().min(1, {
    message: "Please enter a unit of measurement.",
  }),
  threshold: z.coerce.number().int().min(1, {
    message: "Threshold must be at least 1.",
  }),
  supplier: z.string().optional(),
  cost: z.coerce.number().min(0).optional(),
})

type InventoryFormValues = z.infer<typeof inventoryFormSchema>

interface InventoryFormProps {
  initialData?: Inventory
  isEditing?: boolean
}

export function InventoryForm({ initialData, isEditing = false }: InventoryFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<InventoryFormValues>({
    resolver: zodResolver(inventoryFormSchema),
    defaultValues: initialData
      ? {
          name: initialData.name,
          category: initialData.category,
          stock: initialData.stock,
          unit: initialData.unit,
          threshold: initialData.threshold,
          supplier: initialData.supplier || "",
          cost: initialData.cost || undefined,
        }
      : {
          name: "",
          category: "",
          stock: 0,
          unit: "",
          threshold: 10,
          supplier: "",
          cost: undefined,
        },
  })

  async function onSubmit(data: InventoryFormValues) {
    setIsLoading(true)
    try {
      if (isEditing && initialData) {
        await updateInventoryItem(initialData.id, data)
        toast({
          title: "Inventory item updated",
          description: "The inventory item has been updated successfully.",
        })
      } else {
        await createInventoryItem(data)
        toast({
          title: "Inventory item created",
          description: "The inventory item has been created successfully.",
        })
      }
      router.push("/dashboard/inventory")
      router.refresh()
    } catch (error) {
      console.error("Error saving inventory item:", error)
      toast({
        title: "Error",
        description: "There was an error saving the inventory item.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>{isEditing ? "Edit Inventory Item" : "Add New Inventory Item"}</CardTitle>
            <CardDescription>
              {isEditing ? "Update the details of an existing inventory item." : "Add a new item to your inventory."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Grey Goose Vodka" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Spirits">Spirits</SelectItem>
                      <SelectItem value="Mixers">Mixers</SelectItem>
                      <SelectItem value="Wine">Wine</SelectItem>
                      <SelectItem value="Beer">Beer</SelectItem>
                      <SelectItem value="Equipment">Equipment</SelectItem>
                      <SelectItem value="Food">Food</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Stock</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unit</FormLabel>
                    <FormControl>
                      <Input placeholder="bottles" {...field} />
                    </FormControl>
                    <FormDescription>The unit of measurement (e.g., bottles, cans, glasses)</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="threshold"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Low Stock Threshold</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormDescription>You'll be alerted when stock falls below this number</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="supplier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Supplier</FormLabel>
                  <FormControl>
                    <Input placeholder="Premium Spirits Inc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cost"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cost per Unit</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      {...field}
                      value={field.value === undefined ? "" : field.value}
                      onChange={(e) => {
                        const value = e.target.value === "" ? undefined : Number.parseFloat(e.target.value)
                        field.onChange(value)
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => router.push("/dashboard/inventory")} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : isEditing ? "Update Item" : "Add Item"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  )
}
