-- Check if booking system tables exist
SELECT 
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns WHERE columns.table_name = tables.table_name) as column_count
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN (
    'students',
    'instructors',
    'aircraft',
    'locations',
    'flight_bookings',
    'weather_conditions',
    'weather_alerts',
    'events'
  )
ORDER BY table_name;

-- Also check row counts if tables exist
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'flight_bookings') THEN
    RAISE NOTICE 'flight_bookings count: %', (SELECT COUNT(*) FROM flight_bookings);
  END IF;
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'weather_alerts') THEN
    RAISE NOTICE 'weather_alerts count: %', (SELECT COUNT(*) FROM weather_alerts);
  END IF;
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'students') THEN
    RAISE NOTICE 'students count: %', (SELECT COUNT(*) FROM students);
  END IF;
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'locations') THEN
    RAISE NOTICE 'locations count: %', (SELECT COUNT(*) FROM locations);
  END IF;
END $$;

