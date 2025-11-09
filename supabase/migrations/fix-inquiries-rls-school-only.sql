-- Drop existing policies and recreate - SCHOOL ADMINS ONLY (no platform admin override)

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

-- Policy 2: School admins can ONLY view inquiries for THEIR school (no platform admin exception)
CREATE POLICY "School admins can view their school inquiries"
  ON inquiries
  FOR SELECT
  TO authenticated
  USING (
    school_id IN (
      SELECT school_id 
      FROM school_admins 
      WHERE user_id = auth.uid()
    )
  );

-- Policy 3: School admins can update inquiries for their school only
CREATE POLICY "School admins can update their school inquiries"
  ON inquiries
  FOR UPDATE
  TO authenticated
  USING (
    school_id IN (
      SELECT school_id 
      FROM school_admins 
      WHERE user_id = auth.uid()
    )
  );

-- Success message
SELECT 'RLS policies updated - School admins only see their own inquiries!' as message;

