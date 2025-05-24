-- Function to decrease inventory quantity
CREATE OR REPLACE FUNCTION decrease_inventory(inv_id UUID, qty INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE inventory
  SET 
    stock = GREATEST(stock - qty, 0),
    updated_at = NOW()
  WHERE id = inv_id;
END;
$$ LANGUAGE plpgsql;
