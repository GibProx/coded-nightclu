export interface Staff {
  id: string
  name: string
  email: string
  phone?: string | null
  role: string
  shift_pattern?: string | null
  active: boolean
  avatar_url?: string | null
  // User management fields
  user_id?: string | null
  system_access?: boolean
  system_role?: "admin" | "manager" | "staff" | "viewer" | null
  permissions?: {
    can_view_dashboard?: boolean
    can_manage_guests?: boolean
    can_manage_reservations?: boolean
    can_manage_events?: boolean
    can_manage_inventory?: boolean
    can_manage_staff?: boolean
    can_view_analytics?: boolean
    can_manage_security?: boolean
  } | null
  created_at: string
  updated_at: string
}

export interface UserProfile {
  id: string
  email: string
  name?: string | null
  role: "admin" | "manager" | "staff" | "viewer"
  staff_id?: string | null
  permissions?: {
    can_view_dashboard?: boolean
    can_manage_guests?: boolean
    can_manage_reservations?: boolean
    can_manage_events?: boolean
    can_manage_inventory?: boolean
    can_manage_staff?: boolean
    can_view_analytics?: boolean
    can_manage_security?: boolean
  } | null
  avatar_url?: string | null
  created_at: string
  updated_at: string
}

export interface Inventory {
  id: string
  name: string
  category: string
  stock: number
  unit: string
  threshold: number
  supplier?: string | null
  cost?: number | null
  last_ordered?: string | null
  created_at: string
  updated_at: string
}

export interface Event {
  id: string
  name: string
  description?: string | null
  date: string
  start_time: string
  end_time: string
  capacity: number
  ticket_price: number
  status: string
  image_url?: string | null
  // Fatsoma integration fields
  fatsoma_event_id?: string | null
  fatsoma_url?: string | null
  external_ticketing?: boolean
  ticketing_provider?: string | null
  created_at: string
  updated_at: string
}

export interface Ticket {
  id: string
  event_id: string
  ticket_type: string
  price: number
  quantity_available: number
  quantity_sold: number
  created_at: string
  updated_at: string
  event?: Event
}

export interface TicketPurchase {
  id: string
  ticket_id: string
  guest_id?: string | null
  quantity: number
  total_price: number
  purchase_date: string
  status: string
  payment_method?: string | null
  created_at: string
  updated_at: string
  ticket?: Ticket
  guest?: Guest
}

export interface Guest {
  id: string
  name: string
  email?: string | null
  phone?: string | null
  status: string
  visits: number
  last_visit?: string | null
  spend_total: number
  notes?: string | null
  created_at: string
  updated_at: string
}

export interface Reservation {
  id: string
  guest_id?: string | null
  date: string
  time: string
  party_size: number
  table_number?: string | null
  type: string
  status: string
  special_requests?: string | null
  created_at: string
  updated_at: string
  guest?: Guest
}

export interface Payment {
  id: string
  guest_id?: string | null
  amount: number
  payment_date: string
  payment_method: string
  status: string
  items?: string | null
  created_at: string
  updated_at: string
  guest?: Guest
}

export interface SecurityLog {
  id: string
  timestamp: string
  type: string
  location: string
  description: string
  status: string
  assigned_to?: string | null
  resolved_at?: string | null
  created_at: string
  updated_at: string
  staff?: Staff
}

export interface Settings {
  id: string
  key: string
  value?: string | null
  category: string
  created_at: string
  updated_at: string
}

export interface Database {
  staff: Staff[]
  inventory: Inventory[]
  events: Event[]
  tickets: Ticket[]
  ticket_purchases: TicketPurchase[]
  guests: Guest[]
  reservations: Reservation[]
  payments: Payment[]
  security_logs: SecurityLog[]
  settings: Settings[]
  user_profiles: UserProfile[]
}

export type TableName = keyof Database
