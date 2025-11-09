-- Check what tables exist in your database
-- Run this in Supabase SQL Editor

-- Check marketplace tables
SELECT 'schools' as table_name, COUNT(*) as count FROM schools
UNION ALL
SELECT 'programs', COUNT(*) FROM programs
UNION ALL
SELECT 'reviews', COUNT(*) FROM reviews
UNION ALL
SELECT 'aircraft', COUNT(*) FROM aircraft

-- Check old booking system tables (if they exist)
UNION ALL
SELECT 'flight_bookings', COUNT(*) FROM flight_bookings
UNION ALL
SELECT 'students', COUNT(*) FROM students
UNION ALL
SELECT 'weather_alerts', COUNT(*) FROM weather_alerts
UNION ALL
SELECT 'locations', COUNT(*) FROM locations;

