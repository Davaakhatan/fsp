-- Fix RLS policies for school_admins table
-- Allow users to create their own school_admin record during signup

-- Drop existing policies
DROP POLICY IF EXISTS "Enable read for users" ON school_admins;

-- Policy: Users can insert their own school_admin record (during signup)
CREATE POLICY "Users can create own school admin record"
  ON school_admins
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can view their own school_admin records
CREATE POLICY "Users can view own school admin record"
  ON school_admins
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy: Users can update their own school_admin records
CREATE POLICY "Users can update own school admin record"
  ON school_admins
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Success message
SELECT 'RLS policies updated for school_admins!' as message;

