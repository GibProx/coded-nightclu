import { createServerActionClient } from "./supabase/server"
import { mockData } from "./mock-data"
import type { Staff, Inventory, Event, Guest, Reservation, Payment, SecurityLog } from "@/types/database"

// Update the useMockData function to be more robust
const useMockData = () => {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    return !supabaseUrl || !supabaseKey || supabaseUrl === "" || supabaseKey === ""
  } catch (error) {
    console.error("Error checking Supabase environment variables:", error)
    return true // Default to mock data if there's an error
  }
}

// Generic function to get data with fallback to mock data
async function getData<T>(
  tableName: string,
  mockDataKey: keyof typeof mockData,
  query?: (supabase: any) => any,
): Promise<T[]> {
  const shouldUseMockData = useMockData()
  try {
    // If environment variables are missing, use mock data
    if (shouldUseMockData) {
      return mockData[mockDataKey] as T[]
    }

    // Otherwise, try to use Supabase
    const supabase = createServerActionClient()

    // If a custom query is provided, use it
    if (query) {
      const { data, error } = await query(supabase)
      if (error) throw error
      return data || []
    }

    // Otherwise, do a simple select
    const { data, error } = await supabase.from(tableName).select("*")
    if (error) throw error
    return data || []
  } catch (error) {
    console.error(`Error fetching ${tableName}:`, error)
    // Fallback to mock data on error
    return mockData[mockDataKey] as T[]
  }
}

// Generic function to get a single item
async function getItem<T>(tableName: string, mockDataKey: keyof typeof mockData, id: string): Promise<T | null> {
  const shouldUseMockData = useMockData()
  try {
    // If environment variables are missing, use mock data
    if (shouldUseMockData) {
      const items = mockData[mockDataKey] as T[]
      return items.find((item: any) => item.id === id) || null
    }

    // Otherwise, try to use Supabase
    const supabase = createServerActionClient()
    const { data, error } = await supabase.from(tableName).select("*").eq("id", id).single()
    if (error) throw error
    return data
  } catch (error) {
    console.error(`Error fetching ${tableName} item:`, error)
    // Fallback to mock data on error
    const items = mockData[mockDataKey] as T[]
    return items.find((item: any) => item.id === id) || null
  }
}

// Generic function to create an item
async function createItem<T>(
  tableName: string,
  mockDataKey: keyof typeof mockData,
  item: Partial<T>,
): Promise<{ success: boolean; data?: T; error?: string }> {
  const shouldUseMockData = useMockData()
  try {
    // If environment variables are missing, simulate success
    if (shouldUseMockData) {
      return { success: true, data: { id: crypto.randomUUID(), ...item } as T }
    }

    // Otherwise, try to use Supabase
    const supabase = createServerActionClient()
    const { data, error } = await supabase.from(tableName).insert(item).select().single()
    if (error) throw error
    return { success: true, data }
  } catch (error: any) {
    console.error(`Error creating ${tableName} item:`, error)
    return { success: false, error: error.message || `Failed to create ${tableName} item` }
  }
}

// Generic function to update an item
async function updateItem<T>(
  tableName: string,
  mockDataKey: keyof typeof mockData,
  id: string,
  updates: Partial<T>,
): Promise<{ success: boolean; data?: T; error?: string }> {
  const shouldUseMockData = useMockData()
  try {
    // If environment variables are missing, simulate success
    if (shouldUseMockData) {
      return { success: true, data: { id, ...updates } as T }
    }

    // Otherwise, try to use Supabase
    const supabase = createServerActionClient()
    const { data, error } = await supabase.from(tableName).update(updates).eq("id", id).select().single()
    if (error) throw error
    return { success: true, data }
  } catch (error: any) {
    console.error(`Error updating ${tableName} item:`, error)
    return { success: false, error: error.message || `Failed to update ${tableName} item` }
  }
}

// Generic function to delete an item
async function deleteItem(tableName: string, id: string): Promise<{ success: boolean; error?: string }> {
  const shouldUseMockData = useMockData()
  try {
    // If environment variables are missing, simulate success
    if (shouldUseMockData) {
      return { success: true }
    }

    // Otherwise, try to use Supabase
    const supabase = createServerActionClient()
    const { error } = await supabase.from(tableName).delete().eq("id", id)
    if (error) throw error
    return { success: true }
  } catch (error: any) {
    console.error(`Error deleting ${tableName} item:`, error)
    return { success: false, error: error.message || `Failed to delete ${tableName} item` }
  }
}

// Specific data functions for each entity type
export const dataProvider = {
  // Staff
  staff: {
    getAll: () => getData<Staff>("staff", "staff"),
    getById: (id: string) => getItem<Staff>("staff", "staff", id),
    create: (staff: Partial<Staff>) => createItem<Staff>("staff", "staff", staff),
    update: (id: string, updates: Partial<Staff>) => updateItem<Staff>("staff", "staff", id, updates),
    delete: (id: string) => deleteItem("staff", id),
  },

  // Inventory
  inventory: {
    getAll: () => getData<Inventory>("inventory", "inventory"),
    getByCategory: (category: string) =>
      getData<Inventory>("inventory", "inventory", (supabase) =>
        supabase.from("inventory").select("*").eq("category", category),
      ),
    getById: (id: string) => getItem<Inventory>("inventory", "inventory", id),
    create: (item: Partial<Inventory>) => createItem<Inventory>("inventory", "inventory", item),
    update: (id: string, updates: Partial<Inventory>) => updateItem<Inventory>("inventory", "inventory", id, updates),
    delete: (id: string) => deleteItem("inventory", id),
  },

  // Events
  events: {
    getAll: () => getData<Event>("events", "events"),
    getUpcoming: () =>
      getData<Event>("events", "events", (supabase) =>
        supabase
          .from("events")
          .select("*")
          .gte("date", new Date().toISOString().split("T")[0])
          .order("date", { ascending: true }),
      ),
    getPast: () =>
      getData<Event>("events", "events", (supabase) =>
        supabase
          .from("events")
          .select("*")
          .lt("date", new Date().toISOString().split("T")[0])
          .order("date", { ascending: false }),
      ),
    getByStatus: (status: string) =>
      getData<Event>("events", "events", (supabase) => supabase.from("events").select("*").eq("status", status)),
    getById: (id: string) => getItem<Event>("events", "events", id),
    create: (event: Partial<Event>) => createItem<Event>("events", "events", event),
    update: (id: string, updates: Partial<Event>) => updateItem<Event>("events", "events", id, updates),
    delete: (id: string) => deleteItem("events", id),
  },

  // Guests
  guests: {
    getAll: () => getData<Guest>("guests", "guests"),
    getByStatus: (status: string) =>
      getData<Guest>("guests", "guests", (supabase) => supabase.from("guests").select("*").eq("status", status)),
    getById: (id: string) => getItem<Guest>("guests", "guests", id),
    create: (guest: Partial<Guest>) => createItem<Guest>("guests", "guests", guest),
    update: (id: string, updates: Partial<Guest>) => updateItem<Guest>("guests", "guests", id, updates),
    delete: (id: string) => deleteItem("guests", id),
  },

  // Reservations
  reservations: {
    getAll: () => getData<Reservation>("reservations", "reservations"),
    getUpcoming: () =>
      getData<Reservation>("reservations", "reservations", (supabase) =>
        supabase
          .from("reservations")
          .select("*")
          .gte("date", new Date().toISOString().split("T")[0])
          .order("date", { ascending: true }),
      ),
    getToday: () => {
      const today = new Date().toISOString().split("T")[0]
      return getData<Reservation>("reservations", "reservations", (supabase) =>
        supabase.from("reservations").select("*").eq("date", today),
      )
    },
    getPast: () =>
      getData<Reservation>("reservations", "reservations", (supabase) =>
        supabase
          .from("reservations")
          .select("*")
          .lt("date", new Date().toISOString().split("T")[0])
          .order("date", { ascending: false }),
      ),
    getById: (id: string) => getItem<Reservation>("reservations", "reservations", id),
    create: (reservation: Partial<Reservation>) => createItem<Reservation>("reservations", "reservations", reservation),
    update: (id: string, updates: Partial<Reservation>) =>
      updateItem<Reservation>("reservations", "reservations", id, updates),
    delete: (id: string) => deleteItem("reservations", id),
  },

  // Security Logs
  securityLogs: {
    getAll: () => getData<SecurityLog>("security_logs", "securityLogs"),
    getByStatus: (status: string) =>
      getData<SecurityLog>("security_logs", "securityLogs", (supabase) =>
        supabase.from("security_logs").select("*").eq("status", status),
      ),
    getById: (id: string) => getItem<SecurityLog>("security_logs", "securityLogs", id),
    create: (log: Partial<SecurityLog>) => createItem<SecurityLog>("security_logs", "securityLogs", log),
    update: (id: string, updates: Partial<SecurityLog>) =>
      updateItem<SecurityLog>("security_logs", "securityLogs", id, updates),
    delete: (id: string) => deleteItem("security_logs", id),
  },

  // Payments
  payments: {
    getAll: () => getData<Payment>("payments", "payments"),
    getById: (id: string) => getItem<Payment>("payments", "payments", id),
    create: (payment: Partial<Payment>) => createItem<Payment>("payments", "payments", payment),
    update: (id: string, updates: Partial<Payment>) => updateItem<Payment>("payments", "payments", id, updates),
    delete: (id: string) => deleteItem("payments", id),
  },
}
