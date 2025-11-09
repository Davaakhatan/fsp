-- Clean up old booking/weather system tables
-- Run this FIRST before running database-schema.sql
-- NOTE: Some tables overlap with marketplace schema (aircraft, instructors)
-- We keep the marketplace versions and only clean up booking system tables

-- Drop booking system specific tables
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS reschedule_options CASCADE;
DROP TABLE IF EXISTS weather_alerts CASCADE;
DROP TABLE IF EXISTS weather_conditions CASCADE;
DROP TABLE IF EXISTS flight_bookings CASCADE;
DROP TABLE IF EXISTS locations CASCADE;
DROP TABLE IF EXISTS students CASCADE;

-- NOTE: We do NOT drop 'aircraft' and 'instructors' because they're used by marketplace
-- The old schema will fail if these exist, so we need to modify database-schema.sql instead

-- Drop ENUM types
DROP TYPE IF EXISTS booking_status CASCADE;
DROP TYPE IF EXISTS training_level CASCADE;
DROP TYPE IF EXISTS severity CASCADE;
DROP TYPE IF EXISTS notification_type CASCADE;
DROP TYPE IF EXISTS notification_status CASCADE;

-- Success message
SELECT 'Old booking/weather tables cleaned up successfully!' as message;

