-- Function to count total guests for a specific date
CREATE OR REPLACE FUNCTION count_total_guests(check_date DATE)
RETURNS INTEGER AS $$
DECLARE
    total_guests INTEGER;
    guest_column TEXT;
BEGIN
    -- Determine which column stores the guest count
    SELECT column_name INTO guest_column
    FROM information_schema.columns
    WHERE table_name = 'reservations'
    AND column_name IN ('guest_count', 'guests', 'party_size', 'number_of_guests')
    LIMIT 1;
    
    -- If no matching column found, use a default
    IF guest_column IS NULL THEN
        guest_column := 'guest_count';
    END IF;
    
    -- Dynamic SQL to sum the guest counts
    EXECUTE format('
        SELECT COALESCE(SUM(%I::integer), 0)
        FROM reservations
        WHERE DATE(reservation_date) = %L
        AND status = ''confirmed''
    ', guest_column, check_date) INTO total_guests;
    
    RETURN total_guests;
END;
$$ LANGUAGE plpgsql;

-- Function to count reservations for a specific date
CREATE OR REPLACE FUNCTION count_reservations(check_date DATE)
RETURNS INTEGER AS $$
DECLARE
    reservation_count INTEGER;
BEGIN
    SELECT COUNT(*)
    INTO reservation_count
    FROM reservations
    WHERE DATE(reservation_date) = check_date
    AND status = 'confirmed';
    
    RETURN reservation_count;
END;
$$ LANGUAGE plpgsql;
