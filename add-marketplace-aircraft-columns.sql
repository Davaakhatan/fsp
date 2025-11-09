-- Add missing marketplace columns to existing aircraft table
-- This preserves any existing data while adding new fields

-- Add missing columns
ALTER TABLE aircraft ADD COLUMN IF NOT EXISTS registration VARCHAR(20);
ALTER TABLE aircraft ADD COLUMN IF NOT EXISTS make VARCHAR(100);
ALTER TABLE aircraft ADD COLUMN IF NOT EXISTS year INTEGER;
ALTER TABLE aircraft ADD COLUMN IF NOT EXISTS hourly_rate DECIMAL(10, 2);
ALTER TABLE aircraft ADD COLUMN IF NOT EXISTS avionics TEXT;
ALTER TABLE aircraft ADD COLUMN IF NOT EXISTS maintenance_status VARCHAR(50);
ALTER TABLE aircraft ADD COLUMN IF NOT EXISTS total_hours DECIMAL(10, 2);
ALTER TABLE aircraft ADD COLUMN IF NOT EXISTS last_inspection TIMESTAMP;
ALTER TABLE aircraft ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE aircraft ADD COLUMN IF NOT EXISTS is_available BOOLEAN DEFAULT TRUE;

-- Rename 'available' to match portal expectations if needed
-- ALTER TABLE aircraft RENAME COLUMN available TO is_available;

-- Add check constraints (drop first if exists)
DO $$ 
BEGIN
  ALTER TABLE aircraft DROP CONSTRAINT IF EXISTS aircraft_category_check;
  ALTER TABLE aircraft ADD CONSTRAINT aircraft_category_check 
    CHECK (category IN ('single_engine', 'multi_engine', 'helicopter', 'seaplane', 'glider', 'Single Engine Land'));
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ 
BEGIN
  ALTER TABLE aircraft DROP CONSTRAINT IF EXISTS aircraft_maintenance_check;
  ALTER TABLE aircraft ADD CONSTRAINT aircraft_maintenance_check 
    CHECK (maintenance_status IS NULL OR maintenance_status IN ('excellent', 'good', 'fair', 'maintenance_required'));
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_aircraft_school_id ON aircraft(school_id);
CREATE INDEX IF NOT EXISTS idx_aircraft_category ON aircraft(category);
CREATE INDEX IF NOT EXISTS idx_aircraft_available ON aircraft(available);
CREATE INDEX IF NOT EXISTS idx_aircraft_is_available ON aircraft(is_available);

-- Make registration nullable (marketplace has it, portal doesn't always need it)
ALTER TABLE aircraft ALTER COLUMN tail_number DROP NOT NULL;

-- Success message
SELECT 'Aircraft table updated with marketplace columns!' as message,
       (SELECT COUNT(*) FROM aircraft) as total_aircraft;

