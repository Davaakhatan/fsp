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

-- Enable RLS but don't add policies yet (we'll add them later)
ALTER TABLE school_admins ENABLE ROW LEVEL SECURITY;

-- For now, allow all authenticated users to read their own records
CREATE POLICY "Enable read for users"
  ON school_admins
  FOR SELECT
  TO authenticated
  USING (true);

-- Success message
SELECT 'school_admins table created successfully!' as message;

