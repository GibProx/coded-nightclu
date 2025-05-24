-- Add ticket_types and ticket_categories columns to events table if they don't exist
DO $$
BEGIN
    -- Check if ticket_types column exists
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'events' AND column_name = 'ticket_types'
    ) THEN
        ALTER TABLE events ADD COLUMN ticket_types JSONB;
    END IF;

    -- Check if ticket_categories column exists
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'events' AND column_name = 'ticket_categories'
    ) THEN
        ALTER TABLE events ADD COLUMN ticket_categories JSONB;
    END IF;

    -- Check if long_description column exists
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'events' AND column_name = 'long_description'
    ) THEN
        ALTER TABLE events ADD COLUMN long_description TEXT;
    END IF;

    -- Check if main_image column exists
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'events' AND column_name = 'main_image'
    ) THEN
        ALTER TABLE events ADD COLUMN main_image TEXT;
    END IF;

    -- Check if gallery_images column exists
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'events' AND column_name = 'gallery_images'
    ) THEN
        ALTER TABLE events ADD COLUMN gallery_images JSONB;
    END IF;

    -- Check if dj column exists
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'events' AND column_name = 'dj'
    ) THEN
        ALTER TABLE events ADD COLUMN dj VARCHAR(255);
    END IF;
END
$$;
