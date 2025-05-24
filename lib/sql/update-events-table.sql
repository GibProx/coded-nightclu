-- First, check if the columns already exist
DO $$
BEGIN
    -- Add long_description column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'events' AND column_name = 'long_description') THEN
        ALTER TABLE events ADD COLUMN long_description TEXT;
    END IF;

    -- Add location column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'events' AND column_name = 'location') THEN
        ALTER TABLE events ADD COLUMN location TEXT DEFAULT 'Coded Nightclub, 45 Broad Street, Birmingham, B1 2HP';
    END IF;

    -- Add dj column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'events' AND column_name = 'dj') THEN
        ALTER TABLE events ADD COLUMN dj TEXT;
    END IF;

    -- Add main_image column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'events' AND column_name = 'main_image') THEN
        ALTER TABLE events ADD COLUMN main_image TEXT;
    END IF;

    -- Add gallery_images column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'events' AND column_name = 'gallery_images') THEN
        ALTER TABLE events ADD COLUMN gallery_images TEXT;
    END IF;

    -- Add ticket_categories column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'events' AND column_name = 'ticket_categories') THEN
        ALTER TABLE events ADD COLUMN ticket_categories TEXT;
    END IF;

    -- Rename image_url to main_image if it exists
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'events' AND column_name = 'image_url') THEN
        ALTER TABLE events RENAME COLUMN image_url TO main_image;
    END IF;
END $$;

-- Create a storage bucket for images if it doesn't exist
-- Note: This is a Supabase-specific operation that would normally be done in the Supabase dashboard
-- or via the Supabase CLI. This SQL is just for reference.
-- 
-- CREATE BUCKET IF NOT EXISTS images;
-- 
-- GRANT ALL ON BUCKET images TO authenticated;
-- GRANT SELECT ON BUCKET images TO anon;
