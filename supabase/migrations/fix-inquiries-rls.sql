-- Drop existing policies and recreate them for inquiries table

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can submit inquiries" ON inquiries;
DROP POLICY IF EXISTS "School admins can view their school inquiries" ON inquiries;
DROP POLICY IF EXISTS "School admins can update their school inquiries" ON inquiries;

-- Enable RLS
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

-- Policy 1: Anyone (even anonymous) can insert inquiries (for student contact forms)
CREATE POLICY "Anyone can submit inquiries"
  ON inquiries
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Policy 2: Authenticated users can view inquiries for their school
-- (School admins see their school's inquiries, platform admins see all)
CREATE POLICY "School admins can view their school inquiries"
  ON inquiries
  FOR SELECT
  TO authenticated
  USING (
    -- Platform admins (role = 'admin' or 'super_admin') see all inquiries
    (auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' IN ('admin', 'super_admin')
    OR
    -- School admins see only their school's inquiries
    school_id IN (
      SELECT school_id 
      FROM school_admins 
      WHERE user_id = auth.uid()
    )
  );

-- Policy 3: School admins can update inquiries for their school
CREATE POLICY "School admins can update their school inquiries"
  ON inquiries
  FOR UPDATE
  TO authenticated
  USING (
    -- Platform admins can update all
    (auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' IN ('admin', 'super_admin')
    OR
    -- School admins can update their school's inquiries
    school_id IN (
      SELECT school_id 
      FROM school_admins 
      WHERE user_id = auth.uid()
    )
  );

-- Success message
SELECT 'RLS policies updated for inquiries table!' as message;

