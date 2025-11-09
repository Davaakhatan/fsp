-- =====================================================
-- RESET DATABASE - DROP ALL MARKETPLACE TABLES
-- =====================================================
-- WARNING: This will delete ALL data in these tables!
-- Only run this if you want to start fresh.
-- =====================================================

-- Drop all tables in reverse order (respecting foreign keys)
DROP TABLE IF EXISTS ai_match_events CASCADE;
DROP TABLE IF EXISTS comparison_events CASCADE;
DROP TABLE IF EXISTS page_views CASCADE;
DROP TABLE IF EXISTS scholarships CASCADE;
DROP TABLE IF EXISTS financing_partners CASCADE;
DROP TABLE IF EXISTS school_admins CASCADE;
DROP TABLE IF EXISTS inquiries CASCADE;
DROP TABLE IF EXISTS student_profiles CASCADE;
DROP TABLE IF EXISTS school_photos CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS instructors CASCADE;
DROP TABLE IF EXISTS simulators CASCADE;
DROP TABLE IF EXISTS aircraft CASCADE;
DROP TABLE IF EXISTS programs CASCADE;
DROP TABLE IF EXISTS schools CASCADE;

-- Drop views
DROP VIEW IF EXISTS school_analytics CASCADE;
DROP VIEW IF EXISTS school_summary CASCADE;

-- Drop functions
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- Success message
SELECT 'All tables dropped successfully! Now run database-schema-marketplace.sql' AS status;

