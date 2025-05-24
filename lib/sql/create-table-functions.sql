-- Function to check table availability for a specific date
CREATE OR REPLACE FUNCTION check_table_availability(check_date DATE)
RETURNS TABLE (
    table_number INTEGER,
    is_available BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    WITH all_tables AS (
        -- Generate all table numbers from 1 to 30
        SELECT generate_series(1, 30) AS table_number
    ),
    booked_tables AS (
        -- Get all booked tables for the specified date
        SELECT DISTINCT table_number
        FROM reservations
        WHERE DATE(reservation_date) = check_date
        AND status = 'confirmed'
    )
    SELECT 
        at.table_number,
        bt.table_number IS NULL AS is_available
    FROM all_tables at
    LEFT JOIN booked_tables bt ON at.table_number = bt.table_number
    ORDER BY at.table_number;
END;
$$ LANGUAGE plpgsql;

-- Function to count booked tables for a specific date
CREATE OR REPLACE FUNCTION count_booked_tables(check_date DATE)
RETURNS INTEGER AS $$
DECLARE
    booked_count INTEGER;
BEGIN
    SELECT COUNT(DISTINCT table_number)
    INTO booked_count
    FROM reservations
    WHERE DATE(reservation_date) = check_date
    AND status = 'confirmed';
    
    RETURN booked_count;
END;
$$ LANGUAGE plpgsql;
