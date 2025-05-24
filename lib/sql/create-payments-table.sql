-- Create a function to create the payments table if it doesn't exist
CREATE OR REPLACE FUNCTION create_payments_table()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  -- Check if the payments table already exists
  IF NOT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'payments'
  ) THEN
    -- Create the payments table
    CREATE TABLE payments (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      guest_id UUID REFERENCES guests(id) ON DELETE SET NULL,
      amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0),
      payment_date DATE NOT NULL,
      payment_method VARCHAR(50) NOT NULL,
      status VARCHAR(20) NOT NULL,
      items TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- Create indexes for better performance
    CREATE INDEX idx_payments_guest_id ON payments(guest_id);
    CREATE INDEX idx_payments_payment_date ON payments(payment_date);
    CREATE INDEX idx_payments_status ON payments(status);
    
    -- Create a trigger to update the updated_at timestamp
    CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON payments
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at_timestamp();
  END IF;
END;
$$;
