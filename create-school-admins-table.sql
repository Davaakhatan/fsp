-- Create school_admins junction table to link users to schools

CREATE TABLE IF NOT EXISTS school_admins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL, -- References auth.users(id) but we can't add FK constraint across schemas
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
  role VARCHAR(50) DEFAULT 'admin' CHECK (role IN ('admin', 'manager', 'staff')),
  is_primary BOOLEAN DEFAULT FALSE, -- One primary admin per school
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- Ensure one user can only be linked to one school once
  UNIQUE(user_id, school_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_school_admins_user_id ON school_admins(user_id);
CREATE INDEX IF NOT EXISTS idx_school_admins_school_id ON school_admins(school_id);

-- Add RLS policies
ALTER TABLE school_admins ENABLE ROW LEVEL SECURITY;

-- Policy: Users can see their own school admin records
CREATE POLICY "Users can view own school admin records"
  ON school_admins
  FOR SELECT
  USING (auth.uid() = school_admins.user_id);

-- Policy: Platform admins can see all school admin records
CREATE POLICY "Platform admins can view all school admin records"
  ON school_admins
  FOR SELECT
  USING (
    (auth.jwt()->>'role')::text = 'admin' OR
    (auth.jwt()->'user_metadata'->>'role')::text = 'admin'
  );

-- Policy: Platform admins can insert school admin records
CREATE POLICY "Platform admins can create school admin records"
  ON school_admins
  FOR INSERT
  WITH CHECK (
    (auth.jwt()->>'role')::text = 'admin' OR
    (auth.jwt()->'user_metadata'->>'role')::text = 'admin'
  );

-- Policy: Platform admins can update school admin records
CREATE POLICY "Platform admins can update school admin records"
  ON school_admins
  FOR UPDATE
  USING (
    (auth.jwt()->>'role')::text = 'admin' OR
    (auth.jwt()->'user_metadata'->>'role')::text = 'admin'
  );

-- Policy: Platform admins can delete school admin records
CREATE POLICY "Platform admins can delete school admin records"
  ON school_admins
  FOR DELETE
  USING (
    (auth.jwt()->>'role')::text = 'admin' OR
    (auth.jwt()->'user_metadata'->>'role')::text = 'admin'
  );

-- Success message
SELECT 'school_admins table created successfully!' as message;

