-- Create guests table if it doesn't exist
CREATE TABLE IF NOT EXISTS guests (
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
);

-- Add some sample data if the table is empty
INSERT INTO guests (name, email, phone, status, visits, last_visit, spend_total, notes)
SELECT 
  'John Smith', 'john@example.com', '555-123-4567', 'VIP', 12, NOW() - INTERVAL '5 days', 2500.00, 'Prefers corner booth'
WHERE NOT EXISTS (SELECT 1 FROM guests LIMIT 1);

INSERT INTO guests (name, email, phone, status, visits, last_visit, spend_total, notes)
SELECT 
  'Sarah Johnson', 'sarah@example.com', '555-987-6543', 'Regular', 5, NOW() - INTERVAL '14 days', 750.00, 'Birthday on October 15'
WHERE NOT EXISTS (SELECT 1 FROM guests WHERE email = 'sarah@example.com');

INSERT INTO guests (name, email, phone, status, visits, last_visit, spend_total, notes)
SELECT 
  'Michael Chen', 'michael@example.com', '555-555-1212', 'VIP', 20, NOW() - INTERVAL '2 days', 4200.00, 'Always reserves table 8'
WHERE NOT EXISTS (SELECT 1 FROM guests WHERE email = 'michael@example.com');

INSERT INTO guests (name, email, phone, status, visits, last_visit, spend_total, notes)
SELECT 
  'Jessica Williams', 'jessica@example.com', '555-222-3333', 'Regular', 3, NOW() - INTERVAL '30 days', 450.00, 'Allergic to nuts'
WHERE NOT EXISTS (SELECT 1 FROM guests WHERE email = 'jessica@example.com');

INSERT INTO guests (name, email, phone, status, visits, last_visit, spend_total, notes)
SELECT 
  'David Rodriguez', 'david@example.com', '555-444-5555', 'VIP', 15, NOW() - INTERVAL '7 days', 3100.00, 'Prefers Dom Perignon'
WHERE NOT EXISTS (SELECT 1 FROM guests WHERE email = 'david@example.com');

-- Create a trigger to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_guests_updated_at ON guests;
CREATE TRIGGER update_guests_updated_at
BEFORE UPDATE ON guests
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
