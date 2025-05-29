-- Add user management fields to staff table
ALTER TABLE staff 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS system_access BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS system_role VARCHAR(20) DEFAULT 'staff',
ADD COLUMN IF NOT EXISTS permissions JSONB DEFAULT '{}';

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_staff_user_id ON staff(user_id);
CREATE INDEX IF NOT EXISTS idx_staff_system_access ON staff(system_access);
CREATE INDEX IF NOT EXISTS idx_staff_system_role ON staff(system_role);

-- Update existing staff to have basic permissions if they don't have any
UPDATE staff 
SET permissions = '{
  "can_view_dashboard": false,
  "can_manage_guests": false,
  "can_manage_reservations": false,
  "can_manage_events": false,
  "can_manage_inventory": false,
  "can_manage_staff": false,
  "can_view_analytics": false,
  "can_manage_security": false
}'::jsonb
WHERE permissions IS NULL OR permissions = '{}'::jsonb;

-- Add comments to document the new columns
COMMENT ON COLUMN staff.user_id IS 'Reference to auth.users table for login account';
COMMENT ON COLUMN staff.system_access IS 'Whether this staff member can access the management system';
COMMENT ON COLUMN staff.system_role IS 'System role: admin, manager, staff, viewer';
COMMENT ON COLUMN staff.permissions IS 'JSON object containing granular permissions';
