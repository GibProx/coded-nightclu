-- Add Fatsoma integration fields to events table
ALTER TABLE events 
ADD COLUMN IF NOT EXISTS fatsoma_event_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS fatsoma_url TEXT,
ADD COLUMN IF NOT EXISTS external_ticketing BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS ticketing_provider VARCHAR(100) DEFAULT 'internal';

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_events_fatsoma_id ON events(fatsoma_event_id);
CREATE INDEX IF NOT EXISTS idx_events_external_ticketing ON events(external_ticketing);

-- Update existing events to use external ticketing
UPDATE events SET external_ticketing = true, ticketing_provider = 'fatsoma' WHERE fatsoma_url IS NOT NULL;
