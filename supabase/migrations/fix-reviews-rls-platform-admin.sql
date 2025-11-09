-- Add platform admin access to reviews RLS policies

-- Drop ALL existing policies first
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'reviews') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON reviews';
    END LOOP;
END $$;

-- Enable RLS
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Policy 1: Anyone (including anonymous) can read approved reviews
CREATE POLICY "Anyone can read approved reviews"
  ON reviews
  FOR SELECT
  TO public
  USING (is_approved = true);

-- Policy 2: Anyone (including anonymous) can submit reviews
CREATE POLICY "Anyone can submit reviews"
  ON reviews
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Policy 3: Authenticated users can view reviews based on role
CREATE POLICY "Authenticated users can view reviews"
  ON reviews
  FOR SELECT
  TO authenticated
  USING (
    -- Platform admins (role = 'admin' or 'super_admin') see ALL reviews from ALL schools
    (auth.jwt() -> 'user_metadata' ->> 'role') IN ('admin', 'super_admin')
    OR
    -- School admins see only their school's reviews (including unapproved)
    school_id IN (
      SELECT school_id 
      FROM school_admins 
      WHERE user_id = auth.uid()
    )
  );

-- Policy 4: Authenticated users can update reviews based on role
CREATE POLICY "Authenticated users can update reviews"
  ON reviews
  FOR UPDATE
  TO authenticated
  USING (
    -- Platform admins can update ALL reviews
    (auth.jwt() -> 'user_metadata' ->> 'role') IN ('admin', 'super_admin')
    OR
    -- School admins can update their school's reviews
    school_id IN (
      SELECT school_id 
      FROM school_admins 
      WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    -- Platform admins can update ALL reviews
    (auth.jwt() -> 'user_metadata' ->> 'role') IN ('admin', 'super_admin')
    OR
    -- School admins can update their school's reviews
    school_id IN (
      SELECT school_id 
      FROM school_admins 
      WHERE user_id = auth.uid()
    )
  );

-- Success message
SELECT 'RLS policies updated for reviews - platform admins can now see ALL reviews!' as message;

