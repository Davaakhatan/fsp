-- Fix: Add school_id to the existing aircraft table
-- This merges marketplace and portal aircraft tables

ALTER TABLE aircraft ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES schools(id) ON DELETE CASCADE;

-- Update existing portal aircraft to belong to a default school (optional)
-- You can assign them to specific schools later
-- UPDATE aircraft SET school_id = (SELECT id FROM schools LIMIT 1) WHERE school_id IS NULL;

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_aircraft_school_id ON aircraft(school_id);

-- Success message
SELECT 'aircraft table updated with school_id column!' as message;

