"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import type { Order, InventoryItem } from "@/types"

interface EditOrderFormProps {
  order: Order
  inventoryItems: InventoryItem[]
}

const EditOrderForm: React.FC<EditOrderFormProps> = ({ order, inventoryItems }) => {
  const router = useRouter()
  const [orderItems, setOrderItems] = useState(order.items)
  const [selectedInventoryId, setSelectedInventoryId] = useState("")
  const [itemQuantity, setItemQuantity] = useState(1)

  // Add a state variable for the error message
  const [error, setError] = useState("")

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault()

    // Get the selected inventory item
    const selectedItem = inventoryItems.find((item) => item.id === selectedInventoryId)

    // Validate that we have enough stock
    if (selectedItem && itemQuantity > selectedItem.stock) {
      setError(`Cannot add more than available stock (${selectedItem.stock} ${selectedItem.unit})`)
      return
    }

    // Clear any previous errors
    setError("")

    if (selectedInventoryId) {
      const newItem = {
        inventoryItemId: selectedInventoryId,
        quantity: itemQuantity,
        name: inventoryItems.find((item) => item.id === selectedInventoryId)?.name || "Unknown Item",
        price: inventoryItems.find((item) => item.id === selectedInventoryId)?.price || 0,
      }

      setOrderItems([...orderItems, newItem])
      setSelectedInventoryId("")
      setItemQuantity(1)
    }
  }

  const handleRemoveItem = (index: number) => {
    const newOrderItems = [...orderItems]
    newOrderItems.splice(index, 1)
    setOrderItems(newOrderItems)
  }

  const handleQuantityChange = (index: number, quantity: number) => {
    const newOrderItems = [...orderItems]
    newOrderItems[index].quantity = quantity
    setOrderItems(newOrderItems)
  }

  const calculateTotal = () => {
    return orderItems.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const updatedOrder = {
      ...order,
      items: orderItems,
      total: calculateTotal(),
    }

    try {
      const response = await fetch(`/api/orders/${order.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedOrder),
      })

      if (response.ok) {
        router.push("/dashboard/orders")
      } else {
        console.error("Failed to update order")
      }
    } catch (error) {
      console.error("Error updating order:", error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-8">
      <h2 className="text-2xl font-semibold mb-4">Edit Order</h2>

      <div className="mb-4">
        <label htmlFor="inventoryItem" className="block text-gray-700 text-sm font-bold mb-2">
          Inventory Item:
        </label>
        <select
          id="inventoryItem"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={selectedInventoryId}
          onChange={(e) => setSelectedInventoryId(e.target.value)}
        >
          <option value="">Select an item</option>
          {inventoryItems.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label htmlFor="itemQuantity" className="block text-gray-700 text-sm font-bold mb-2">
          Quantity:
        </label>
        <input
          type="number"
          id="itemQuantity"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={itemQuantity}
          onChange={(e) => setItemQuantity(Number.parseInt(e.target.value))}
          min="1"
        />
      </div>

      <button
        type="button"
        onClick={handleAddItem}
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Add Item
      </button>

      {error && <div className="text-red-500 text-sm mt-2">{error}</div>}

      <h3 className="text-xl font-semibold mt-6 mb-2">Order Items:</h3>
      <ul>
        {orderItems.map((item, index) => (
          <li key={index} className="mb-2">
            {item.name} - ${item.price}
            <input
              type="number"
              className="shadow appearance-none border rounded w-16 py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ml-2"
              value={item.quantity}
              onChange={(e) => handleQuantityChange(index, Number.parseInt(e.target.value))}
              min="1"
            />
            <button
              type="button"
              onClick={() => handleRemoveItem(index)}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline ml-2"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>

      <div className="font-bold mt-4">Total: ${calculateTotal()}</div>

      <div className="mt-6">
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Update Order
        </button>
      </div>
    </form>
  )
}

export default EditOrderForm

// Add the missing named export
export { EditOrderForm }
