-- Create inventory table if it doesn't exist
CREATE TABLE IF NOT EXISTS inventory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  unit TEXT NOT NULL,
  threshold INTEGER NOT NULL DEFAULT 5,
  supplier TEXT,
  cost DECIMAL(10, 2),
  last_ordered TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add some sample data if the table is empty
INSERT INTO inventory (name, category, stock, unit, threshold, supplier, cost, last_ordered)
SELECT 
  'Grey Goose Vodka', 'Spirits', 24, 'bottle', 5, 'Premium Spirits Inc.', 29.99, NOW() - INTERVAL '15 days'
WHERE NOT EXISTS (SELECT 1 FROM inventory LIMIT 1);

INSERT INTO inventory (name, category, stock, unit, threshold, supplier, cost, last_ordered)
SELECT 
  'Hendrick''s Gin', 'Spirits', 18, 'bottle', 4, 'Premium Spirits Inc.', 34.99, NOW() - INTERVAL '15 days'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE name = 'Hendrick''s Gin');

INSERT INTO inventory (name, category, stock, unit, threshold, supplier, cost, last_ordered)
SELECT 
  'Coca-Cola', 'Mixers', 120, 'can', 24, 'Beverage Distributors', 0.75, NOW() - INTERVAL '10 days'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE name = 'Coca-Cola');

INSERT INTO inventory (name, category, stock, unit, threshold, supplier, cost, last_ordered)
SELECT 
  'Red Bull', 'Mixers', 96, 'can', 24, 'Beverage Distributors', 1.50, NOW() - INTERVAL '10 days'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE name = 'Red Bull');

INSERT INTO inventory (name, category, stock, unit, threshold, supplier, cost, last_ordered)
SELECT 
  'Cocktail Glasses', 'Equipment', 200, 'piece', 50, 'Bar Supplies Co.', 3.99, NOW() - INTERVAL '30 days'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE name = 'Cocktail Glasses');
