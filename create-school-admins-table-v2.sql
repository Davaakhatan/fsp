-- Drop existing table if it exists
DROP TABLE IF EXISTS school_admins CASCADE;

-- Create school_admins junction table to link users to schools
CREATE TABLE school_admins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  role VARCHAR(50) DEFAULT 'admin',
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Add unique constraint
ALTER TABLE school_admins ADD CONSTRAINT school_admins_user_school_unique UNIQUE (user_id, school_id);

-- Add check constraint for role
ALTER TABLE school_admins ADD CONSTRAINT school_admins_role_check CHECK (role IN ('admin', 'manager', 'staff'));

-- Create indexes
CREATE INDEX idx_school_admins_user_id ON school_admins(user_id);
CREATE INDEX idx_school_admins_school_id ON school_admins(school_id);

-- Enable RLS
ALTER TABLE school_admins ENABLE ROW LEVEL SECURITY;

-- Simple policy for now
CREATE POLICY "Enable read for authenticated users"
  ON school_admins
  FOR SELECT
  TO authenticated
  USING (true);

-- Success message
SELECT 'school_admins table created successfully!' as message;

