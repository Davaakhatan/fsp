-- Verify which tables exist
-- Run this to check what was created

SELECT table_name 
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

