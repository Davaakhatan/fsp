-- Fix RLS policies for reviews table - Allow public submissions

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can read approved reviews" ON reviews;
DROP POLICY IF EXISTS "Authenticated users can submit reviews" ON reviews;
DROP POLICY IF EXISTS "School admins can view all reviews for their school" ON reviews;
DROP POLICY IF EXISTS "School admins can update reviews for their school" ON reviews;

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

-- Policy 3: School admins can view ALL reviews for their school (including unapproved)
CREATE POLICY "School admins can view all reviews for their school"
  ON reviews
  FOR SELECT
  TO authenticated
  USING (
    school_id IN (
      SELECT school_id 
      FROM school_admins 
      WHERE user_id = auth.uid()
    )
  );

-- Policy 4: School admins can update review status (approve/reject)
CREATE POLICY "School admins can update reviews for their school"
  ON reviews
  FOR UPDATE
  TO authenticated
  USING (
    school_id IN (
      SELECT school_id 
      FROM school_admins 
      WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    school_id IN (
      SELECT school_id 
      FROM school_admins 
      WHERE user_id = auth.uid()
    )
  );

-- Success message
SELECT 'RLS policies fixed for reviews table - public submissions allowed!' as message;

