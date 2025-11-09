-- Check both aircraft tables and their columns
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'aircraft'
ORDER BY table_name, ordinal_position;

-- Count rows in aircraft table
SELECT COUNT(*) as aircraft_count FROM aircraft;

-- Check if school_id column exists
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'aircraft' AND column_name = 'school_id';

