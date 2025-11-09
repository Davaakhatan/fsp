-- =====================================================
-- CRITICAL FIX: Create missing database view and function
-- =====================================================
-- Run this in Supabase SQL Editor IMMEDIATELY
-- =====================================================

-- Create the school_summary view (used by search)
CREATE OR REPLACE VIEW school_summary AS
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
  COALESCE(AVG(r.rating), 0) AS avg_rating,
  COUNT(DISTINCT r.id) AS review_count,
  MIN(p.min_total_cost) AS min_program_cost,
  MAX(p.max_total_cost) AS max_program_cost,
  array_agg(DISTINCT p.program_type) FILTER (WHERE p.program_type IS NOT NULL) AS programs_offered,
  COUNT(DISTINCT a.id) AS aircraft_count
FROM schools s
LEFT JOIN reviews r ON r.school_id = s.id AND r.is_approved = TRUE
LEFT JOIN programs p ON p.school_id = s.id AND p.is_active = TRUE
LEFT JOIN aircraft a ON a.school_id = s.id AND a.is_available = TRUE
WHERE s.is_active = TRUE
GROUP BY s.id;

-- Create PostGIS function for distance search
CREATE OR REPLACE FUNCTION schools_within_radius(
  search_lat DECIMAL,
  search_lon DECIMAL,
  radius_meters DECIMAL
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
  avg_rating DECIMAL,
  review_count BIGINT,
  min_program_cost DECIMAL,
  max_program_cost DECIMAL,
  programs_offered TEXT[],
  aircraft_count BIGINT,
  distance_miles DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ss.*,
    ROUND(
      ST_Distance(
        ST_MakePoint(ss.longitude, ss.latitude)::geography,
        ST_MakePoint(search_lon, search_lat)::geography
      ) / 1609.34, 1
    ) AS distance_miles
  FROM school_summary ss
  WHERE ST_DWithin(
    ST_MakePoint(ss.longitude, ss.latitude)::geography,
    ST_MakePoint(search_lon, search_lat)::geography,
    radius_meters
  )
  ORDER BY distance_miles;
END;
$$ LANGUAGE plpgsql;

-- Success message
SELECT 'View and function created successfully! Try searching again.' AS status;

