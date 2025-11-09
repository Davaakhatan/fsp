-- Add user roles and permissions to auth.users metadata
-- This extends Supabase Auth with role-based access control

-- Create a function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    SELECT COALESCE(
      (auth.jwt() -> 'user_metadata' ->> 'role')::text = 'admin',
      false
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to check if user is school admin
CREATE OR REPLACE FUNCTION is_school_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    SELECT COALESCE(
      (auth.jwt() -> 'user_metadata' ->> 'role')::text IN ('admin', 'school_admin'),
      false
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update RLS policies to respect roles
-- Example: Allow admins to see all schools
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access to schools" ON schools;
CREATE POLICY "Allow public read access to schools" 
  ON schools FOR SELECT 
  USING (true); -- Everyone can view schools

DROP POLICY IF EXISTS "Allow admins to manage all schools" ON schools;
CREATE POLICY "Allow admins to manage all schools" 
  ON schools FOR ALL 
  USING (is_admin());

DROP POLICY IF EXISTS "Allow school admins to manage their school" ON schools;
CREATE POLICY "Allow school admins to manage their school" 
  ON schools FOR ALL 
  USING (
    is_school_admin() AND 
    id IN (
      SELECT school_id 
      FROM school_admins 
      WHERE auth_user_id = auth.uid()
    )
  );

-- Create admin users table for tracking admin actions
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('super_admin', 'admin', 'support')),
  permissions TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  UNIQUE(auth_user_id)
);

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view admin users"
  ON admin_users FOR SELECT
  USING (is_admin());

CREATE POLICY "Super admins can manage admin users"
  ON admin_users FOR ALL
  USING (
    (auth.jwt() -> 'user_metadata' ->> 'role')::text = 'super_admin'
  );

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_admin_users_auth_user_id ON admin_users(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_admin_users_role ON admin_users(role);

-- Insert a super admin (you'll need to create this user in Supabase Auth first)
-- After creating the user in Supabase Auth dashboard, update their metadata:
-- Go to Authentication > Users > [your user] > User Metadata
-- Add: { "role": "super_admin" }

COMMENT ON TABLE admin_users IS 'Platform administrators with elevated permissions';
COMMENT ON COLUMN admin_users.role IS 'Admin role: super_admin (full access), admin (most access), support (read-only)';
COMMENT ON COLUMN admin_users.permissions IS 'Additional granular permissions';

