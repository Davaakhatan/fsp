-- Clean up old booking/weather system tables
-- Run this FIRST before running database-schema.sql

-- Drop tables (in order to avoid foreign key constraints)
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS reschedule_options CASCADE;
DROP TABLE IF EXISTS weather_alerts CASCADE;
DROP TABLE IF EXISTS flight_bookings CASCADE;
DROP TABLE IF EXISTS aircraft CASCADE;
DROP TABLE IF EXISTS locations CASCADE;
DROP TABLE IF EXISTS instructors CASCADE;
DROP TABLE IF EXISTS students CASCADE;

-- Drop ENUM types
DROP TYPE IF EXISTS booking_status CASCADE;
DROP TYPE IF EXISTS training_level CASCADE;
DROP TYPE IF EXISTS severity CASCADE;
DROP TYPE IF EXISTS notification_type CASCADE;
DROP TYPE IF EXISTS notification_status CASCADE;

-- Success message
SELECT 'Old booking/weather tables cleaned up successfully!' as message;

