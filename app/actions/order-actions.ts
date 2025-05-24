"use server"

import { createServerActionClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function checkOrdersTableExists() {
  try {
    const supabase = createServerActionClient()

    // Try to query the orders table directly
    const { data, error } = await supabase.from("orders").select("id").limit(1).maybeSingle()

    // If we get a specific error about the relation not existing, the table doesn't exist
    if (error && error.code === "42P01") {
      return { exists: false, error: null }
    }

    // If we get any other error, something else went wrong
    if (error && error.code !== "42P01") {
      console.error("Error checking if orders table exists:", error)
      return { exists: false, error: error.message }
    }

    // If we got here without an error, the table exists
    return { exists: true, error: null }
  } catch (error: any) {
    console.error("Error checking if orders table exists:", error)
    return { exists: false, error: error.message }
  }
}

export async function getOrders() {
  try {
    const supabase = createServerActionClient()

    const { data: orders, error } = await supabase
      .from("orders")
      .select(`
        *,
        client:client_id(id, name),
        payment:payment_id(id, amount, payment_method)
      `)
      .order("order_date", { ascending: false })

    if (error) {
      console.error("Error fetching orders:", error)
      return { orders: [], error: error.message }
    }

    return { orders, error: null }
  } catch (error: any) {
    console.error("Error fetching orders:", error)
    return { orders: [], error: error.message }
  }
}

export async function getOrder(id: string) {
  try {
    const supabase = createServerActionClient()

    const { data, error } = await supabase
      .from("orders")
      .select(`
        *,
        client:client_id(id, name),
        payment:payment_id(id, amount, payment_method),
        items:order_items(
          id, 
          quantity, 
          unit_price, 
          subtotal,
          product:inventory_id(id, name, category, unit)
        )
      `)
      .eq("id", id)
      .single()

    if (error) {
      if (error.code === "PGRST116") {
        return { order: null, notFound: true }
      }
      console.error("Error fetching order:", error)
      return { order: null, error: error.message }
    }

    return { order: data, error: null }
  } catch (error: any) {
    console.error("Error fetching order:", error)
    return { order: null, error: error.message }
  }
}

export async function createOrder(formData: FormData) {
  try {
    const supabase = createServerActionClient()

    const clientId = formData.get("client_id") as string
    const notes = formData.get("notes") as string
    const itemsJson = formData.get("items") as string
    const totalAmount = formData.get("total_amount") as string

    // Create the order
    const { data, error } = await supabase
      .from("orders")
      .insert({
        client_id: clientId === "anonymous" ? null : clientId,
        notes: notes || null,
        status: "pending",
        order_date: new Date().toISOString(),
        total_amount: Number.parseFloat(totalAmount) || 0,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating order:", error)
      return { success: false, error: error.message }
    }

    // Add order items if provided
    if (itemsJson) {
      const items = JSON.parse(itemsJson)

      if (items.length > 0) {
        // Check stock levels for all items
        for (const item of items) {
          const { data: inventoryItem, error: inventoryError } = await supabase
            .from("inventory")
            .select("stock, name, unit")
            .eq("id", item.id)
            .single()

          if (inventoryError) {
            console.error("Error checking inventory:", inventoryError)
            return { success: false, error: inventoryError.message }
          }

          if (item.quantity > inventoryItem.stock) {
            return {
              success: false,
              error: `Cannot add more than available stock (${inventoryItem.stock} ${inventoryItem.unit} of ${inventoryItem.name})`,
            }
          }
        }

        const orderItems = items.map((item: any) => ({
          order_id: data.id,
          inventory_id: item.id,
          quantity: item.quantity,
          unit_price: item.unit_price,
        }))

        const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

        if (itemsError) {
          console.error("Error adding order items:", itemsError)
          return { success: false, error: `Order created but items failed: ${itemsError.message}` }
        }
      }
    }

    revalidatePath("/dashboard/orders")
    return { success: true, data }
  } catch (error: any) {
    console.error("Error in createOrder:", error)
    return { success: false, error: error.message || "An unexpected error occurred" }
  }
}

export async function updateOrderStatus(orderId: string, status: string) {
  try {
    const supabase = createServerActionClient()

    const { error } = await supabase
      .from("orders")
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", orderId)

    if (error) {
      console.error("Error updating order status:", error)
      return { success: false, error: error.message }
    }

    // If the order is being completed, update inventory
    if (status === "completed") {
      await updateInventoryStock(orderId)
    }

    revalidatePath("/dashboard/orders")
    revalidatePath(`/dashboard/orders/${orderId}/view`)
    return { success: true }
  } catch (error: any) {
    console.error("Error updating order status:", error)
    return { success: false, error: error.message }
  }
}

export async function deleteOrder(orderId: string) {
  try {
    const supabase = createServerActionClient()

    // Delete order items first (cascade should handle this, but just to be safe)
    await supabase.from("order_items").delete().eq("order_id", orderId)

    // Then delete the order
    const { error } = await supabase.from("orders").delete().eq("id", orderId)

    if (error) {
      console.error("Error deleting order:", error)
      return { success: false, error: error.message }
    }

    revalidatePath("/dashboard/orders")
    return { success: true }
  } catch (error: any) {
    console.error("Error deleting order:", error)
    return { success: false, error: error.message }
  }
}

export async function addOrderItem(orderId: string, formData: FormData) {
  try {
    const supabase = createServerActionClient()

    const inventoryId = formData.get("inventory_id") as string
    const quantity = Number.parseInt(formData.get("quantity") as string) || 1
    const unitPrice = Number.parseFloat(formData.get("unit_price") as string) || 0

    // Check if we have enough stock
    const { data: inventoryItem, error: inventoryError } = await supabase
      .from("inventory")
      .select("stock, name, unit")
      .eq("id", inventoryId)
      .single()

    if (inventoryError) {
      console.error("Error checking inventory:", inventoryError)
      return { success: false, error: inventoryError.message }
    }

    if (quantity > inventoryItem.stock) {
      return {
        success: false,
        error: `Cannot add more than available stock (${inventoryItem.stock} ${inventoryItem.unit} of ${inventoryItem.name})`,
      }
    }

    // Add the order item
    const { error: itemError } = await supabase.from("order_items").insert({
      order_id: orderId,
      inventory_id: inventoryId,
      quantity,
      unit_price: unitPrice,
    })

    if (itemError) {
      console.error("Error adding order item:", itemError)
      return { success: false, error: itemError.message }
    }

    // Update the order total
    await supabase.rpc("update_order_total", { order_uuid: orderId })

    revalidatePath(`/dashboard/orders/${orderId}/edit`)
    revalidatePath(`/dashboard/orders/${orderId}/view`)
    return { success: true }
  } catch (error: any) {
    console.error("Error adding order item:", error)
    return { success: false, error: error.message }
  }
}

export async function removeOrderItem(itemId: string, orderId: string) {
  try {
    const supabase = createServerActionClient()

    // Delete the order item
    const { error } = await supabase.from("order_items").delete().eq("id", itemId)

    if (error) {
      console.error("Error removing order item:", error)
      return { success: false, error: error.message }
    }

    // Update the order total
    await supabase.rpc("update_order_total", { order_uuid: orderId })

    revalidatePath(`/dashboard/orders/${orderId}/edit`)
    revalidatePath(`/dashboard/orders/${orderId}/view`)
    return { success: true }
  } catch (error: any) {
    console.error("Error removing order item:", error)
    return { success: false, error: error.message }
  }
}

export async function updateInventoryStock(orderId: string) {
  try {
    const supabase = createServerActionClient()

    // Get all items in the order
    const { data: orderItems, error: itemsError } = await supabase
      .from("order_items")
      .select("inventory_id, quantity")
      .eq("order_id", orderId)

    if (itemsError) {
      console.error("Error fetching order items:", itemsError)
      return { success: false, error: itemsError.message }
    }

    // Update inventory for each item
    for (const item of orderItems) {
      // Get current stock
      const { data: inventoryItem, error: inventoryError } = await supabase
        .from("inventory")
        .select("stock")
        .eq("id", item.inventory_id)
        .single()

      if (inventoryError) {
        console.error("Error fetching inventory item:", inventoryError)
        continue
      }

      // Update stock (subtract the ordered quantity)
      const newStock = Math.max(0, inventoryItem.stock - item.quantity)

      const { error: updateError } = await supabase
        .from("inventory")
        .update({
          stock: newStock,
          updated_at: new Date().toISOString(),
        })
        .eq("id", item.inventory_id)

      if (updateError) {
        console.error("Error updating inventory stock:", updateError)
      }
    }

    return { success: true }
  } catch (error: any) {
    console.error("Error updating inventory stock:", error)
    return { success: false, error: error.message }
  }
}

export async function markOrderAsPaid(orderId: string, formData: FormData) {
  try {
    const supabase = createServerActionClient()

    const paymentMethod = formData.get("payment_method") as string
    const amount = Number.parseFloat(formData.get("amount") as string)

    // Use the database function to mark the order as paid
    const { data, error } = await supabase
      .rpc("mark_order_as_paid", {
        order_uuid: orderId,
        payment_method: paymentMethod,
        payment_amount: amount,
      })
      .single()

    if (error) {
      console.error("Error marking order as paid:", error)
      return { success: false, error: error.message }
    }

    // Update inventory stock levels
    await updateInventoryStock(orderId)

    revalidatePath("/dashboard/orders")
    revalidatePath(`/dashboard/orders/${orderId}/view`)
    return { success: true, paymentId: data }
  } catch (error: any) {
    console.error("Error marking order as paid:", error)
    return { success: false, error: error.message }
  }
}
