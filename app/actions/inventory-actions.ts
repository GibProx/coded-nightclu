"use server"

import { dataProvider } from "@/lib/data-provider"
import type { Inventory } from "@/types/database"
import { revalidatePath } from "next/cache"

// Get all inventory items
export async function getInventoryItems(): Promise<Inventory[]> {
  try {
    return await dataProvider.inventory.getAll()
  } catch (error) {
    console.error("Error fetching inventory:", error)
    return [] // Return empty array instead of throwing
  }
}

// Get inventory items by category
export async function getInventoryByCategory(category: string): Promise<Inventory[]> {
  try {
    return await dataProvider.inventory.getByCategory(category)
  } catch (error) {
    console.error("Error fetching inventory by category:", error)
    return [] // Return empty array instead of throwing
  }
}

// Get a single inventory item by ID
export async function getInventoryItem(id: string): Promise<Inventory | null> {
  try {
    return await dataProvider.inventory.getById(id)
  } catch (error) {
    console.error("Error fetching inventory item:", error)
    return null
  }
}

// Create a new inventory item
export async function createInventoryItem(
  inventoryData: Omit<Inventory, "id" | "created_at" | "updated_at" | "last_ordered">,
): Promise<{ success: boolean; data?: Inventory; error?: string }> {
  try {
    // Add last_ordered field if stock is greater than 0
    const dataToInsert = {
      ...inventoryData,
      last_ordered: inventoryData.stock > 0 ? new Date().toISOString() : null,
    }

    const result = await dataProvider.inventory.create(dataToInsert)

    if (result.success) {
      revalidatePath("/dashboard/inventory")
    }

    return result
  } catch (error: any) {
    console.error("Error creating inventory item:", error)
    return {
      success: false,
      error: error.message || "Failed to create inventory item",
    }
  }
}

// Update an inventory item
export async function updateInventoryItem(
  id: string,
  inventoryData: Partial<Inventory>,
): Promise<{ success: boolean; data?: Inventory; error?: string }> {
  try {
    const result = await dataProvider.inventory.update(id, inventoryData)

    if (result.success) {
      revalidatePath("/dashboard/inventory")
    }

    return result
  } catch (error: any) {
    console.error("Error updating inventory item:", error)
    return {
      success: false,
      error: error.message || "Failed to update inventory item",
    }
  }
}

// Delete an inventory item
export async function deleteInventoryItem(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const result = await dataProvider.inventory.delete(id)

    if (result.success) {
      revalidatePath("/dashboard/inventory")
    }

    return result
  } catch (error: any) {
    console.error("Error deleting inventory item:", error)
    return {
      success: false,
      error: error.message || "Failed to delete inventory item",
    }
  }
}
