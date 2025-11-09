-- Recreate school_summary view and PostGIS function
-- Run this in Supabase SQL Editor

-- Step 1: Drop existing view if it exists
DROP VIEW IF EXISTS school_summary CASCADE;

-- Step 2: Create the view (with correct column names from actual schema)
CREATE VIEW school_summary AS
SELECT 
  s.id,
  s.name,
  s.slug,
  s.city,
  s.state,
  s.latitude,
  s.longitude,
  s.trust_tier,
  s.is_claimed,
  s.subscription_tier,
  s.total_instructors,
  s.total_aircraft,
  s.is_part_61,
  s.is_part_141,
  s.is_veteran_approved,
  s.fsp_avg_hours_to_ppl,
  s.fsp_avg_hours_to_ir,
  s.fsp_cancellation_rate,
  s.fsp_schedule_reliability,
  s.fsp_student_satisfaction,
  COUNT(DISTINCT p.id) as total_programs,
  COALESCE(AVG(r.rating_overall), 0) as avg_rating,
  COUNT(DISTINCT r.id) as total_reviews,
  MIN(p.min_total_cost) as min_program_cost,
  MAX(p.max_total_cost) as max_program_cost
FROM schools s
LEFT JOIN programs p ON s.id = p.school_id
LEFT JOIN reviews r ON s.id = r.school_id
GROUP BY 
  s.id, s.name, s.slug, s.city, s.state, 
  s.latitude, s.longitude, s.trust_tier, 
  s.is_claimed, s.subscription_tier,
  s.total_instructors, s.total_aircraft,
  s.is_part_61, s.is_part_141, s.is_veteran_approved,
  s.fsp_avg_hours_to_ppl, s.fsp_avg_hours_to_ir,
  s.fsp_cancellation_rate, s.fsp_schedule_reliability,
  s.fsp_student_satisfaction;

-- Step 3: Create PostGIS function for radius search
CREATE OR REPLACE FUNCTION schools_within_radius(
  lat DOUBLE PRECISION,
  lon DOUBLE PRECISION,
  radius_miles DOUBLE PRECISION
)
RETURNS TABLE (
  id UUID,
  name VARCHAR,
  slug VARCHAR,
  city VARCHAR,
  state VARCHAR,
  latitude DECIMAL,
  longitude DECIMAL,
  trust_tier VARCHAR,
  is_claimed BOOLEAN,
  subscription_tier VARCHAR,
  total_instructors INTEGER,
  total_aircraft INTEGER,
  is_part_61 BOOLEAN,
  is_part_141 BOOLEAN,
  is_veteran_approved BOOLEAN,
  fsp_avg_hours_to_ppl DECIMAL,
  fsp_avg_hours_to_ir DECIMAL,
  fsp_cancellation_rate DECIMAL,
  fsp_schedule_reliability DECIMAL,
  fsp_student_satisfaction DECIMAL,
  total_programs BIGINT,
  avg_rating DECIMAL,
  total_reviews BIGINT,
  min_program_cost INTEGER,
  max_program_cost INTEGER,
  distance_miles DOUBLE PRECISION
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ss.*,
    ST_Distance(
      ST_MakePoint(ss.longitude::float, ss.latitude::float)::geography,
      ST_MakePoint(lon, lat)::geography
    ) / 1609.34 as distance_miles
  FROM school_summary ss
  WHERE ST_DWithin(
    ST_MakePoint(ss.longitude::float, ss.latitude::float)::geography,
    ST_MakePoint(lon, lat)::geography,
    radius_miles * 1609.34
  )
  ORDER BY distance_miles;
END;
$$ LANGUAGE plpgsql;

-- Verify it worked
SELECT 'View and function created successfully!' as status;
SELECT COUNT(*) as total_schools FROM school_summary;

