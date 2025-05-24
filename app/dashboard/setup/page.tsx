import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createServerActionClient } from "@/lib/supabase/server"
import Link from "next/link"

export const metadata = {
  title: "Database Setup",
  description: "Set up and manage your database",
}

export default async function DatabaseSetupPage() {
  const supabase = createServerActionClient()
  const isConnected = !!supabase

  return (
    <DashboardShell>
      <DashboardHeader heading="Database Setup" text="Set up and manage your Supabase database for Coded Nightclub" />

      <Tabs defaultValue="status" className="space-y-4">
        <TabsList>
          <TabsTrigger value="status">Connection Status</TabsTrigger>
          <TabsTrigger value="tables">Database Tables</TabsTrigger>
          <TabsTrigger value="sample-data">Sample Data</TabsTrigger>
        </TabsList>

        <TabsContent value="status" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Database Connection</CardTitle>
              <CardDescription>Check your connection to the Supabase database</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <div className="font-medium">Connection Status:</div>
                <div
                  className={`rounded-md p-3 ${
                    isConnected ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}
                >
                  {isConnected ? "Connected to Supabase" : "Not connected to Supabase"}
                </div>
              </div>

              <div className="grid gap-2">
                <div className="font-medium">Environment Variables:</div>
                <div className="rounded-md bg-muted p-3">
                  <div className="grid gap-1">
                    <div>
                      NEXT_PUBLIC_SUPABASE_URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? "✅ Set" : "❌ Not set"}
                    </div>
                    <div>
                      NEXT_PUBLIC_SUPABASE_ANON_KEY:{" "}
                      {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✅ Set" : "❌ Not set"}
                    </div>
                    <div>
                      SUPABASE_SERVICE_ROLE_KEY: {process.env.SUPABASE_SERVICE_ROLE_KEY ? "✅ Set" : "❌ Not set"}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              {!isConnected && (
                <div className="text-sm text-muted-foreground">
                  Please set up your Supabase environment variables to connect to your database.
                </div>
              )}
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="tables" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Database Tables</CardTitle>
              <CardDescription>Create and manage the tables in your Supabase database</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <div className="font-medium">Guests Table</div>
                  <div className="text-sm text-muted-foreground">
                    Stores information about guests, including contact details, status, and visit history.
                  </div>
                  <pre className="mt-2 overflow-auto rounded-md bg-muted p-4 text-sm">
                    <code>{`CREATE TABLE IF NOT EXISTS guests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  phone TEXT,
  status TEXT DEFAULT 'Regular',
  visits INTEGER DEFAULT 0,
  last_visit TIMESTAMP,
  spend_total DECIMAL(10, 2) DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`}</code>
                  </pre>
                </div>

                <div className="grid gap-2">
                  <div className="font-medium">Reservations Table</div>
                  <div className="text-sm text-muted-foreground">
                    Stores information about table reservations, including date, time, and party size.
                  </div>
                  <pre className="mt-2 overflow-auto rounded-md bg-muted p-4 text-sm">
                    <code>{`CREATE TABLE IF NOT EXISTS reservations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  guest_id UUID REFERENCES guests(id),
  date DATE NOT NULL,
  time TIME NOT NULL,
  party_size INTEGER NOT NULL,
  table_number TEXT,
  type TEXT DEFAULT 'Standard',
  status TEXT DEFAULT 'Confirmed',
  special_requests TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`}</code>
                  </pre>
                </div>

                <div className="grid gap-2">
                  <div className="font-medium">Events Table</div>
                  <div className="text-sm text-muted-foreground">
                    Stores information about events, including date, time, capacity, and ticket price.
                  </div>
                  <pre className="mt-2 overflow-auto rounded-md bg-muted p-4 text-sm">
                    <code>{`CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  capacity INTEGER NOT NULL,
  ticket_price DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'Upcoming',
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`}</code>
                  </pre>
                </div>

                <div className="grid gap-2">
                  <div className="font-medium">Inventory Table</div>
                  <div className="text-sm text-muted-foreground">
                    Stores information about inventory items, including stock levels and thresholds.
                  </div>
                  <pre className="mt-2 overflow-auto rounded-md bg-muted p-4 text-sm">
                    <code>{`CREATE TABLE IF NOT EXISTS inventory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  unit TEXT NOT NULL,
  threshold INTEGER NOT NULL DEFAULT 10,
  supplier TEXT,
  cost DECIMAL(10, 2),
  last_ordered TIMESTAMP,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`}</code>
                  </pre>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <div className="text-sm text-muted-foreground">
                Run these SQL scripts in your Supabase SQL Editor to create the necessary tables.
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="sample-data" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sample Data</CardTitle>
              <CardDescription>Add sample data to your database for testing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <div className="font-medium">Sample Guests</div>
                  <pre className="mt-2 overflow-auto rounded-md bg-muted p-4 text-sm">
                    <code>{`-- Add sample guests
INSERT INTO guests (name, email, phone, status, visits, last_visit, spend_total, notes)
VALUES 
  ('John Smith', 'john@example.com', '555-123-4567', 'VIP', 12, NOW() - INTERVAL '5 days', 2500.00, 'Prefers corner booth'),
  ('Sarah Johnson', 'sarah@example.com', '555-987-6543', 'Regular', 5, NOW() - INTERVAL '14 days', 750.00, 'Birthday on October 15'),
  ('Michael Chen', 'michael@example.com', '555-555-1212', 'VIP', 20, NOW() - INTERVAL '2 days', 4200.00, 'Always reserves table 8'),
  ('Jessica Williams', 'jessica@example.com', '555-222-3333', 'Regular', 3, NOW() - INTERVAL '30 days', 450.00, 'Allergic to nuts'),
  ('David Rodriguez', 'david@example.com', '555-444-5555', 'VIP', 15, NOW() - INTERVAL '7 days', 3100.00, 'Prefers Dom Perignon');`}</code>
                  </pre>
                </div>

                <div className="grid gap-2">
                  <div className="font-medium">Sample Inventory</div>
                  <pre className="mt-2 overflow-auto rounded-md bg-muted p-4 text-sm">
                    <code>{`-- Add sample inventory
INSERT INTO inventory (name, category, stock, unit, threshold, supplier, cost)
VALUES 
  ('Vodka Premium', 'Spirits', 24, 'bottle', 5, 'Premium Distributors', 28.99),
  ('Gin Craft', 'Spirits', 18, 'bottle', 5, 'Craft Spirits Inc', 32.50),
  ('Tequila Gold', 'Spirits', 12, 'bottle', 3, 'Mexican Imports', 45.75),
  ('Red Wine House', 'Wine', 36, 'bottle', 10, 'Vineyard Direct', 18.25),
  ('White Wine House', 'Wine', 42, 'bottle', 10, 'Vineyard Direct', 16.50),
  ('Champagne Premium', 'Wine', 15, 'bottle', 5, 'French Imports', 65.00),
  ('Draft Beer Local', 'Beer', 120, 'pint', 20, 'Local Brewery', 4.50),
  ('Craft Beer Assorted', 'Beer', 85, 'bottle', 15, 'Craft Distributors', 6.25),
  ('Limes', 'Garnish', 50, 'piece', 20, 'Fresh Produce Co', 0.30),
  ('Cocktail Napkins', 'Supplies', 500, 'piece', 100, 'Bar Supplies Inc', 0.10);`}</code>
                  </pre>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <div className="text-sm text-muted-foreground">
                Run these SQL scripts in your Supabase SQL Editor to add sample data to your tables.
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-6 flex justify-between">
        <Button variant="outline" asChild>
          <Link href="/dashboard">Back to Dashboard</Link>
        </Button>
        <Button asChild>
          <Link href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer">
            Open Supabase Dashboard
          </Link>
        </Button>
      </div>
    </DashboardShell>
  )
}
