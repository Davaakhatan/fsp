-- =====================================================
-- FIND-A-FLIGHT-SCHOOL MARKETPLACE DATABASE SCHEMA
-- =====================================================
-- Author: FSP Team
-- Purpose: Student-facing flight school marketplace
-- Database: Supabase PostgreSQL
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis"; -- For geographic queries

-- =====================================================
-- CORE TABLES
-- =====================================================

-- Flight Schools (Main Entity)
CREATE TABLE schools (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL, -- For SEO-friendly URLs
  description TEXT,
  website VARCHAR(500),
  phone VARCHAR(50),
  email VARCHAR(255),
  
  -- Location
  address_line1 VARCHAR(255),
  address_line2 VARCHAR(255),
  city VARCHAR(100) NOT NULL,
  state VARCHAR(50) NOT NULL,
  zip_code VARCHAR(20),
  country VARCHAR(100) DEFAULT 'USA',
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  timezone VARCHAR(50),
  
  -- Trust Tier
  trust_tier VARCHAR(50) DEFAULT 'unverified' CHECK (trust_tier IN ('premier', 'verified_fsp', 'community_verified', 'unverified')),
  is_claimed BOOLEAN DEFAULT FALSE,
  claimed_at TIMESTAMP,
  claimed_by UUID, -- Reference to school_admins table
  
  -- Subscription
  subscription_tier VARCHAR(50) DEFAULT 'free' CHECK (subscription_tier IN ('free', 'plus', 'premier')),
  subscription_status VARCHAR(50) DEFAULT 'active' CHECK (subscription_status IN ('active', 'cancelled', 'suspended')),
  subscription_started_at TIMESTAMP,
  subscription_ends_at TIMESTAMP,
  
  -- Operational Data
  founded_year INTEGER,
  total_instructors INTEGER,
  total_aircraft INTEGER,
  total_students INTEGER,
  is_part_61 BOOLEAN DEFAULT TRUE,
  is_part_141 BOOLEAN DEFAULT FALSE,
  is_veteran_approved BOOLEAN DEFAULT FALSE,
  
  -- FSP Signals (for Verified FSP Schools)
  fsp_avg_hours_to_ppl DECIMAL(6, 2),
  fsp_avg_hours_to_ir DECIMAL(6, 2),
  fsp_avg_hours_to_cpl DECIMAL(6, 2),
  fsp_cancellation_rate DECIMAL(5, 2), -- Percentage
  fsp_schedule_reliability DECIMAL(5, 2), -- Percentage
  fsp_student_satisfaction DECIMAL(3, 2), -- Score out of 5
  fsp_training_velocity DECIMAL(5, 2), -- Median hours-to-rating
  fsp_last_updated TIMESTAMP,
  
  -- Metadata
  data_source VARCHAR(100) DEFAULT 'crawl' CHECK (data_source IN ('crawl', 'claim', 'manual')),
  data_last_verified TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Programs Offered (PPL, IR, CPL, etc.)
CREATE TABLE programs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
  
  -- Program Details
  program_type VARCHAR(50) NOT NULL CHECK (program_type IN ('ppl', 'ir', 'cpl', 'cfi', 'cfii', 'mei', 'atp', 'multi', 'seaplane', 'tailwheel', 'aerobatic')),
  program_name VARCHAR(255) NOT NULL, -- E.g., "Private Pilot License (Part 141)"
  description TEXT,
  
  -- Training Type
  training_type VARCHAR(50) CHECK (training_type IN ('part_61', 'part_141', 'both')),
  
  -- Cost (Normalized)
  min_total_cost DECIMAL(10, 2),
  max_total_cost DECIMAL(10, 2),
  cost_assumptions TEXT, -- E.g., "Based on 50 flight hours at $180/hr..."
  cost_breakdown JSONB, -- { "aircraft": 9000, "instructor": 2500, "ground": 500, "materials": 300, "checkride": 700 }
  cost_last_updated TIMESTAMP,
  
  -- Timeline (Normalized)
  min_duration_months DECIMAL(4, 2),
  max_duration_months DECIMAL(4, 2),
  timeline_assumptions TEXT, -- E.g., "2-3 flights per week"
  
  -- Requirements
  minimum_hours DECIMAL(6, 2), -- FAA minimum (e.g., 40 for PPL Part 61)
  typical_hours DECIMAL(6, 2), -- Actual average (e.g., 60-70 for PPL)
  prerequisites TEXT,
  
  -- Financing
  financing_available BOOLEAN DEFAULT FALSE,
  va_approved BOOLEAN DEFAULT FALSE,
  
  -- Metadata
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Aircraft Fleet
CREATE TABLE aircraft (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
  
  -- Aircraft Details
  registration VARCHAR(20), -- N-number (e.g., "N12345")
  make VARCHAR(100) NOT NULL, -- E.g., "Cessna"
  model VARCHAR(100) NOT NULL, -- E.g., "172S Skyhawk"
  year INTEGER,
  
  -- Specifications
  category VARCHAR(50) CHECK (category IN ('single_engine', 'multi_engine', 'helicopter', 'seaplane', 'glider')),
  is_complex BOOLEAN DEFAULT FALSE,
  is_high_performance BOOLEAN DEFAULT FALSE,
  is_tailwheel BOOLEAN DEFAULT FALSE,
  has_glass_cockpit BOOLEAN DEFAULT FALSE, -- G1000, etc.
  avionics_type VARCHAR(100), -- E.g., "Garmin G1000"
  
  -- Pricing
  hourly_rate_solo DECIMAL(8, 2),
  hourly_rate_dual DECIMAL(8, 2),
  
  -- Availability
  is_available BOOLEAN DEFAULT TRUE,
  in_maintenance BOOLEAN DEFAULT FALSE,
  
  -- Photos
  photo_urls TEXT[], -- Array of image URLs
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Simulators
CREATE TABLE simulators (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
  
  -- Simulator Details
  name VARCHAR(255) NOT NULL,
  type VARCHAR(100) CHECK (type IN ('atd', 'batd', 'aatd', 'ffs', 'ftd')),
  manufacturer VARCHAR(100),
  model VARCHAR(100),
  
  -- Capabilities
  simulated_aircraft VARCHAR(100), -- E.g., "Cessna 172"
  has_motion BOOLEAN DEFAULT FALSE,
  has_visual_system BOOLEAN DEFAULT TRUE,
  faa_approved BOOLEAN DEFAULT FALSE,
  loggable_hours BOOLEAN DEFAULT TRUE,
  
  -- Pricing
  hourly_rate DECIMAL(8, 2),
  
  -- Metadata
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Instructors
CREATE TABLE instructors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
  
  -- Personal Info
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  bio TEXT,
  photo_url VARCHAR(500),
  
  -- Certifications
  is_cfi BOOLEAN DEFAULT TRUE,
  is_cfii BOOLEAN DEFAULT FALSE,
  is_mei BOOLEAN DEFAULT FALSE,
  atp BOOLEAN DEFAULT FALSE,
  total_hours DECIMAL(8, 2),
  instructor_hours DECIMAL(8, 2),
  
  -- Pricing
  hourly_rate DECIMAL(8, 2),
  
  -- Availability
  is_available BOOLEAN DEFAULT TRUE,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Student Reviews
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
  
  -- Reviewer Info
  student_name VARCHAR(255) NOT NULL,
  student_email VARCHAR(255), -- For verification
  is_verified BOOLEAN DEFAULT FALSE, -- Did they actually attend?
  program_completed VARCHAR(50), -- What program did they complete?
  
  -- Review Content
  rating DECIMAL(2, 1) NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(255),
  review_text TEXT NOT NULL,
  
  -- Aspect Ratings (Optional)
  rating_instructors DECIMAL(2, 1) CHECK (rating_instructors >= 1 AND rating_instructors <= 5),
  rating_aircraft DECIMAL(2, 1) CHECK (rating_aircraft >= 1 AND rating_aircraft <= 5),
  rating_facilities DECIMAL(2, 1) CHECK (rating_facilities >= 1 AND rating_facilities <= 5),
  rating_value DECIMAL(2, 1) CHECK (rating_value >= 1 AND rating_value <= 5),
  rating_support DECIMAL(2, 1) CHECK (rating_support >= 1 AND rating_support <= 5),
  
  -- Metadata
  helpful_count INTEGER DEFAULT 0, -- How many found this helpful?
  is_approved BOOLEAN DEFAULT FALSE, -- Moderation flag
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- School Photos
CREATE TABLE school_photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
  
  -- Photo Details
  url VARCHAR(500) NOT NULL,
  caption TEXT,
  category VARCHAR(50) CHECK (category IN ('facility', 'aircraft', 'classroom', 'instructors', 'students', 'other')),
  is_primary BOOLEAN DEFAULT FALSE, -- Main photo for school card
  display_order INTEGER DEFAULT 0,
  
  -- Metadata
  uploaded_by UUID, -- Reference to school_admins
  created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- STUDENT/USER TABLES
-- =====================================================

-- Student Profiles (Prospective Students)
CREATE TABLE student_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Contact Info
  email VARCHAR(255) UNIQUE NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone VARCHAR(50),
  
  -- Goals & Preferences (From Questionnaire)
  training_goal VARCHAR(100) CHECK (training_goal IN ('career', 'recreational', 'specific_rating', 'exploring')),
  budget_min DECIMAL(10, 2),
  budget_max DECIMAL(10, 2),
  location_flexibility VARCHAR(50) CHECK (location_flexibility IN ('local', 'regional', 'anywhere')),
  preferred_location_city VARCHAR(100),
  preferred_location_state VARCHAR(50),
  preferred_location_lat DECIMAL(10, 8),
  preferred_location_lon DECIMAL(11, 8),
  timeline_flexibility VARCHAR(50) CHECK (timeline_flexibility IN ('fast_track', 'standard', 'flexible')),
  schedule_availability VARCHAR(50) CHECK (schedule_availability IN ('full_time', 'part_time', 'weekends')),
  aircraft_preference VARCHAR(100),
  financing_needed BOOLEAN DEFAULT FALSE,
  
  -- Match History
  last_matched_at TIMESTAMP,
  match_history JSONB, -- Array of { timestamp, schools, scores }
  
  -- Saved Schools
  saved_school_ids UUID[], -- Array of school IDs
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Inquiries (Student → School)
CREATE TABLE inquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
  student_profile_id UUID REFERENCES student_profiles(id) ON DELETE SET NULL,
  
  -- Inquiry Details
  student_name VARCHAR(255) NOT NULL,
  student_email VARCHAR(255) NOT NULL,
  student_phone VARCHAR(50),
  message TEXT,
  program_interest VARCHAR(50), -- Which program are they interested in?
  
  -- Status
  status VARCHAR(50) DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'tour_scheduled', 'converted', 'lost')),
  school_response TEXT,
  school_responded_at TIMESTAMP,
  
  -- Attribution
  source VARCHAR(100) DEFAULT 'search', -- Where did they come from? (search, ai_match, comparison, etc.)
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- School Admins (For Claimed Profiles)
CREATE TABLE school_admins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
  
  -- Admin Info
  email VARCHAR(255) UNIQUE NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  role VARCHAR(50) DEFAULT 'admin' CHECK (role IN ('owner', 'admin', 'staff')),
  
  -- Auth (Using Supabase Auth)
  auth_user_id UUID, -- Link to Supabase auth.users
  
  -- Permissions
  can_edit_profile BOOLEAN DEFAULT TRUE,
  can_view_leads BOOLEAN DEFAULT TRUE,
  can_manage_subscription BOOLEAN DEFAULT FALSE,
  
  -- Metadata
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- SUPPORTING TABLES
-- =====================================================

-- Financing Partners
CREATE TABLE financing_partners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Partner Details
  name VARCHAR(255) NOT NULL,
  logo_url VARCHAR(500),
  website VARCHAR(500),
  description TEXT,
  
  -- Loan Details
  min_loan_amount DECIMAL(10, 2),
  max_loan_amount DECIMAL(10, 2),
  min_apr DECIMAL(5, 2),
  max_apr DECIMAL(5, 2),
  loan_term_months INTEGER,
  
  -- Requirements
  min_credit_score INTEGER,
  requires_cosigner BOOLEAN DEFAULT FALSE,
  
  -- Metadata
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Scholarships
CREATE TABLE scholarships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Scholarship Details
  name VARCHAR(255) NOT NULL,
  provider VARCHAR(255) NOT NULL,
  description TEXT,
  amount DECIMAL(10, 2),
  deadline DATE,
  application_url VARCHAR(500),
  
  -- Eligibility
  eligibility_criteria TEXT,
  program_types VARCHAR(100)[], -- Array of program types
  
  -- Metadata
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- ANALYTICS & TRACKING
-- =====================================================

-- Page Views (For Analytics)
CREATE TABLE page_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
  student_profile_id UUID REFERENCES student_profiles(id) ON DELETE SET NULL,
  
  -- View Details
  page_type VARCHAR(50), -- 'profile', 'comparison', 'search_result'
  referrer VARCHAR(500),
  user_agent VARCHAR(500),
  ip_address INET,
  
  -- Metadata
  viewed_at TIMESTAMP DEFAULT NOW()
);

-- Comparison Events
CREATE TABLE comparison_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_profile_id UUID REFERENCES student_profiles(id) ON DELETE SET NULL,
  
  -- Schools Compared
  school_ids UUID[], -- Array of school IDs compared
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW()
);

-- AI Match Events
CREATE TABLE ai_match_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_profile_id UUID REFERENCES student_profiles(id) ON DELETE SET NULL,
  
  -- Match Results
  matched_school_ids UUID[], -- Array of top 5 schools
  match_scores JSONB, -- { school_id: score } mapping
  match_reasoning JSONB, -- { school_id: reasoning } mapping
  
  -- Input
  questionnaire_answers JSONB,
  
  -- AI Metadata
  model_used VARCHAR(100),
  generation_time_ms INTEGER,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Schools
CREATE INDEX idx_schools_city_state ON schools(city, state);
CREATE INDEX idx_schools_trust_tier ON schools(trust_tier);
CREATE INDEX idx_schools_subscription_tier ON schools(subscription_tier);
CREATE INDEX idx_schools_is_claimed ON schools(is_claimed);
CREATE INDEX idx_schools_is_active ON schools(is_active);
CREATE INDEX idx_schools_location ON schools USING GIST(ST_MakePoint(longitude, latitude));

-- Programs
CREATE INDEX idx_programs_school_id ON programs(school_id);
CREATE INDEX idx_programs_program_type ON programs(program_type);
CREATE INDEX idx_programs_training_type ON programs(training_type);
CREATE INDEX idx_programs_cost ON programs(min_total_cost, max_total_cost);

-- Aircraft
CREATE INDEX idx_aircraft_school_id ON aircraft(school_id);
CREATE INDEX idx_aircraft_category ON aircraft(category);
CREATE INDEX idx_aircraft_is_available ON aircraft(is_available);

-- Reviews
CREATE INDEX idx_reviews_school_id ON reviews(school_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);
CREATE INDEX idx_reviews_is_approved ON reviews(is_approved);

-- Inquiries
CREATE INDEX idx_inquiries_school_id ON inquiries(school_id);
CREATE INDEX idx_inquiries_status ON inquiries(status);
CREATE INDEX idx_inquiries_created_at ON inquiries(created_at DESC);

-- Student Profiles
CREATE INDEX idx_student_profiles_email ON student_profiles(email);
CREATE INDEX idx_student_profiles_location ON student_profiles USING GIST(ST_MakePoint(preferred_location_lon, preferred_location_lat));

-- Page Views
CREATE INDEX idx_page_views_school_id ON page_views(school_id);
CREATE INDEX idx_page_views_viewed_at ON page_views(viewed_at DESC);

-- =====================================================
-- VIEWS FOR COMMON QUERIES
-- =====================================================

-- School Summary View (For Search Results)
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
  COALESCE(AVG(r.rating), 0) AS avg_rating,
  COUNT(DISTINCT r.id) AS review_count,
  MIN(p.min_total_cost) AS min_program_cost,
  MAX(p.max_total_cost) AS max_program_cost,
  array_agg(DISTINCT p.program_type) AS programs_offered,
  COUNT(DISTINCT a.id) AS aircraft_count
FROM schools s
LEFT JOIN reviews r ON r.school_id = s.id AND r.is_approved = TRUE
LEFT JOIN programs p ON p.school_id = s.id AND p.is_active = TRUE
LEFT JOIN aircraft a ON a.school_id = s.id AND a.is_available = TRUE
WHERE s.is_active = TRUE
GROUP BY s.id;

-- School Analytics View (For School Admins)
CREATE VIEW school_analytics AS
SELECT 
  s.id AS school_id,
  s.name AS school_name,
  COUNT(DISTINCT pv.id) AS total_views_30d,
  COUNT(DISTINCT i.id) AS total_inquiries_30d,
  COUNT(DISTINCT i.id) FILTER (WHERE i.status IN ('tour_scheduled', 'converted')) AS qualified_inquiries_30d,
  CASE 
    WHEN COUNT(DISTINCT i.id) > 0 
    THEN (COUNT(DISTINCT i.id) FILTER (WHERE i.status IN ('tour_scheduled', 'converted'))::DECIMAL / COUNT(DISTINCT i.id) * 100)
    ELSE 0 
  END AS conversion_rate_30d
FROM schools s
LEFT JOIN page_views pv ON pv.school_id = s.id AND pv.viewed_at >= NOW() - INTERVAL '30 days'
LEFT JOIN inquiries i ON i.school_id = s.id AND i.created_at >= NOW() - INTERVAL '30 days'
GROUP BY s.id, s.name;

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE aircraft ENABLE ROW LEVEL SECURITY;
ALTER TABLE simulators ENABLE ROW LEVEL SECURITY;
ALTER TABLE instructors ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_admins ENABLE ROW LEVEL SECURITY;

-- Public read access for active schools and related data
CREATE POLICY "Public can view active schools" ON schools FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Public can view active programs" ON programs FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Public can view available aircraft" ON aircraft FOR SELECT USING (is_available = TRUE);
CREATE POLICY "Public can view available simulators" ON simulators FOR SELECT USING (is_available = TRUE);
CREATE POLICY "Public can view available instructors" ON instructors FOR SELECT USING (is_available = TRUE);
CREATE POLICY "Public can view approved reviews" ON reviews FOR SELECT USING (is_approved = TRUE);
CREATE POLICY "Public can view school photos" ON school_photos FOR SELECT USING (TRUE);

-- School admins can manage their own school's data
CREATE POLICY "School admins can update their school" ON schools FOR UPDATE 
USING (id IN (SELECT school_id FROM school_admins WHERE auth_user_id = auth.uid()));

CREATE POLICY "School admins can insert programs" ON programs FOR INSERT 
WITH CHECK (school_id IN (SELECT school_id FROM school_admins WHERE auth_user_id = auth.uid()));

CREATE POLICY "School admins can update programs" ON programs FOR UPDATE 
USING (school_id IN (SELECT school_id FROM school_admins WHERE auth_user_id = auth.uid()));

CREATE POLICY "School admins can view their inquiries" ON inquiries FOR SELECT 
USING (school_id IN (SELECT school_id FROM school_admins WHERE auth_user_id = auth.uid()));

-- Students can manage their own profiles
CREATE POLICY "Students can view their own profile" ON student_profiles FOR SELECT 
USING (id = (SELECT id FROM student_profiles WHERE auth_user_id = auth.uid()));

CREATE POLICY "Students can update their own profile" ON student_profiles FOR UPDATE 
USING (id = (SELECT id FROM student_profiles WHERE auth_user_id = auth.uid()));

-- Anyone can submit inquiries and reviews (with moderation)
CREATE POLICY "Anyone can submit inquiries" ON inquiries FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Anyone can submit reviews" ON reviews FOR INSERT WITH CHECK (TRUE);

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at
CREATE TRIGGER update_schools_updated_at BEFORE UPDATE ON schools FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_programs_updated_at BEFORE UPDATE ON programs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_aircraft_updated_at BEFORE UPDATE ON aircraft FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_simulators_updated_at BEFORE UPDATE ON simulators FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_instructors_updated_at BEFORE UPDATE ON instructors FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_student_profiles_updated_at BEFORE UPDATE ON student_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_inquiries_updated_at BEFORE UPDATE ON inquiries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_school_admins_updated_at BEFORE UPDATE ON school_admins FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- END OF SCHEMA
-- =====================================================

