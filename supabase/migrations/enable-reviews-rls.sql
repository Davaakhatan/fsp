-- Enable RLS and create policies for reviews table

-- Enable RLS
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Policy 1: Anyone can read approved reviews (public access)
CREATE POLICY "Anyone can read approved reviews"
  ON reviews
  FOR SELECT
  TO public
  USING (is_approved = true);

-- Policy 2: Authenticated users can submit reviews (unapproved by default)
CREATE POLICY "Authenticated users can submit reviews"
  ON reviews
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy 3: School admins can view ALL reviews for their school (including unapproved)
CREATE POLICY "School admins can view all reviews for their school"
  ON reviews
  FOR SELECT
  TO authenticated
  USING (
    -- Show all reviews (including unapproved) to school admins for their school
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
SELECT 'RLS policies created for reviews table!' as message;

