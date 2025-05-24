-- Function to calculate total revenue for a given period
CREATE OR REPLACE FUNCTION calculate_total_revenue(start_date DATE, end_date DATE)
RETURNS DECIMAL AS $$
DECLARE
    total DECIMAL;
BEGIN
    SELECT COALESCE(SUM(amount), 0)
    INTO total
    FROM payments
    WHERE payment_date BETWEEN start_date AND end_date
    AND status = 'completed';
    
    RETURN total;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate percentage change between two periods
CREATE OR REPLACE FUNCTION calculate_revenue_change(current_total DECIMAL, previous_total DECIMAL)
RETURNS DECIMAL AS $$
DECLARE
    change_percent DECIMAL;
BEGIN
    IF previous_total = 0 THEN
        RETURN 0;
    ELSE
        change_percent := ((current_total - previous_total) / previous_total) * 100;
        RETURN change_percent;
    END IF;
END;
$$ LANGUAGE plpgsql;
