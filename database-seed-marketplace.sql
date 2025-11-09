-- =====================================================
-- FIND-A-FLIGHT-SCHOOL MARKETPLACE - SEED DATA
-- =====================================================
-- Purpose: Populate database with realistic mock data
-- Note: This is MVP seed data for testing and demonstration
-- =====================================================

-- =====================================================
-- 1. FLIGHT SCHOOLS
-- =====================================================

-- San Diego Flight Training International (Premier Tier)
INSERT INTO schools (id, name, slug, description, website, phone, email, address_line1, city, state, zip_code, latitude, longitude, timezone, trust_tier, is_claimed, subscription_tier, founded_year, total_instructors, total_aircraft, total_students, is_part_61, is_part_141, is_veteran_approved, fsp_avg_hours_to_ppl, fsp_avg_hours_to_ir, fsp_cancellation_rate, fsp_schedule_reliability, fsp_student_satisfaction, fsp_training_velocity, data_source) VALUES
('11111111-1111-1111-1111-111111111111', 'San Diego Flight Training International', 'san-diego-flight-training-international', 'Premier Part 141 flight school with modern glass cockpit fleet and accelerated programs. Known for exceptional training velocity and student outcomes.', 'https://sdfti.com', '(619) 555-1000', 'info@sdfti.com', '8885 Gibbs Drive', 'San Diego', 'CA', '92123', 32.7338, -117.1945, 'America/Los_Angeles', 'premier', TRUE, 'premier', 2005, 18, 12, 150, TRUE, TRUE, TRUE, 58.5, 52.3, 6.2, 94.5, 4.7, 60.2, 'claim');

-- Phoenix Aviation Academy (Verified FSP)
INSERT INTO schools (id, name, slug, description, website, phone, email, address_line1, city, state, zip_code, latitude, longitude, timezone, trust_tier, is_claimed, subscription_tier, founded_year, total_instructors, total_aircraft, total_students, is_part_61, is_part_141, is_veteran_approved, fsp_avg_hours_to_ppl, fsp_cancellation_rate, fsp_schedule_reliability, fsp_student_satisfaction, data_source) VALUES
('22222222-2222-2222-2222-222222222222', 'Phoenix Aviation Academy', 'phoenix-aviation-academy', 'Family-owned flight school serving the Phoenix area for over 30 years. Excellent instructors and well-maintained fleet.', 'https://phoenixaviation.com', '(602) 555-2000', 'contact@phoenixaviation.com', '4000 E Sky Harbor Blvd', 'Phoenix', 'AZ', '85034', 33.4273, -111.9971, 'America/Phoenix', 'verified_fsp', TRUE, 'plus', 1990, 12, 8, 85, TRUE, FALSE, TRUE, 65.2, 8.5, 91.0, 4.5, 'claim');

-- Austin Flight School (Community Verified)
INSERT INTO schools (id, name, slug, description, website, phone, email, address_line1, city, state, zip_code, latitude, longitude, timezone, trust_tier, is_claimed, subscription_tier, founded_year, total_instructors, total_aircraft, total_students, is_part_61, is_part_141, is_veteran_approved, data_source) VALUES
('33333333-3333-3333-3333-333333333333', 'Austin Flight School', 'austin-flight-school', 'Affordable Part 61 training in the heart of Texas. Flexible scheduling and personalized instruction.', 'https://austinflightschool.com', '(512) 555-3000', 'info@austinflightschool.com', '3600 Presidential Blvd', 'Austin', 'TX', '78719', 30.1945, -97.6707, 'America/Chicago', 'community_verified', TRUE, 'free', 2012, 6, 4, 40, TRUE, FALSE, FALSE, 'claim');

-- Mile High Aviation (Unverified)
INSERT INTO schools (id, name, slug, description, website, phone, email, address_line1, city, state, zip_code, latitude, longitude, timezone, trust_tier, is_claimed, subscription_tier, founded_year, total_instructors, total_aircraft, is_part_61, data_source) VALUES
('44444444-4444-4444-4444-444444444444', 'Mile High Aviation', 'mile-high-aviation', 'Mountain flying specialists offering tailwheel and mountain flying endorsements.', 'https://milehighaviation.com', '(303) 555-4000', 'fly@milehighaviation.com', '12800 Tower Rd', 'Denver', 'CO', '80249', 39.8561, -104.6737, 'America/Denver', 'unverified', FALSE, 'free', 2015, 5, 3, TRUE, 'crawl');

-- Miami Flight Center (Community Verified)
INSERT INTO schools (id, name, slug, description, website, phone, email, address_line1, city, state, zip_code, latitude, longitude, timezone, trust_tier, is_claimed, subscription_tier, founded_year, total_instructors, total_aircraft, total_students, is_part_61, is_part_141, is_veteran_approved, data_source) VALUES
('55555555-5555-5555-5555-555555555555', 'Miami Flight Center', 'miami-flight-center', 'Year-round flying weather and international training experience. Multi-engine and seaplane training available.', 'https://miamiflightcenter.com', '(305) 555-5000', 'info@miamiflightcenter.com', '1395 NW 57th Ave', 'Miami', 'FL', '33126', 25.7907, -80.2906, 'America/New_York', 'community_verified', TRUE, 'plus', 2008, 10, 7, 90, TRUE, TRUE, FALSE, 'claim');

-- Chicago Flight Academy (Verified FSP)
INSERT INTO schools (id, name, slug, description, website, phone, email, address_line1, city, state, zip_code, latitude, longitude, timezone, trust_tier, is_claimed, subscription_tier, founded_year, total_instructors, total_aircraft, total_students, is_part_61, is_part_141, is_veteran_approved, fsp_avg_hours_to_ppl, fsp_cancellation_rate, fsp_schedule_reliability, fsp_student_satisfaction, data_source) VALUES
('66666666-6666-6666-6666-666666666666', 'Chicago Flight Academy', 'chicago-flight-academy', 'Premier training facility serving the Chicago metropolitan area. Part 141 accelerated programs available.', 'https://chicagoflightacademy.com', '(312) 555-6000', 'academy@chicagoflightacademy.com', '3230 N Rockwell St', 'Chicago', 'IL', '60618', 41.9403, -87.6940, 'America/Chicago', 'verified_fsp', TRUE, 'plus', 2010, 14, 10, 110, TRUE, TRUE, TRUE, 62.8, 7.8, 92.3, 4.6, 'claim');

-- =====================================================
-- 2. PROGRAMS
-- =====================================================

-- San Diego FTI Programs
INSERT INTO programs (id, school_id, program_type, program_name, description, training_type, min_total_cost, max_total_cost, cost_assumptions, min_duration_months, max_duration_months, timeline_assumptions, minimum_hours, typical_hours, financing_available, va_approved) VALUES
('a1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'ppl', 'Private Pilot License (Part 141)', 'Comprehensive PPL program with structured curriculum and accelerated track options.', 'part_141', 11500, 14500, 'Based on 50 hours dual, 10 hours solo in C172S G1000 at $185/hr, instructor $65/hr, materials $800, checkride $700', 3, 5, '3-4 flights per week, full-time student', 35, 50, TRUE, TRUE),
('a1111112-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'ir', 'Instrument Rating (Part 141)', 'Accelerated instrument training with G1000 glass cockpit aircraft.', 'part_141', 9500, 12000, 'Based on 35 hours dual in C172S G1000, simulator $3000, materials $600, checkride $700', 2, 3, 'Full-time accelerated track', 35, 45, TRUE, TRUE),
('a1111113-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'cpl', 'Commercial Pilot License (Part 141)', 'Professional pilot training with multi-engine option.', 'part_141', 25000, 35000, 'Based on 120 hours complex/multi, instructor time, materials', 4, 7, 'Part-time to full-time', 190, 210, TRUE, TRUE),
('a1111114-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'cfi', 'Certified Flight Instructor', 'Build hours and start your aviation career as a CFI.', 'part_61', 5500, 7500, 'Based on 25 hours dual, materials, checkride', 2, 3, 'Already holds CPL', 0, 25, TRUE, FALSE);

-- Phoenix Aviation Programs
INSERT INTO programs (id, school_id, program_type, program_name, description, training_type, min_total_cost, max_total_cost, cost_assumptions, min_duration_months, max_duration_months, timeline_assumptions, minimum_hours, typical_hours, financing_available, va_approved) VALUES
('a2222221-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'ppl', 'Private Pilot License (Part 61)', 'Flexible Part 61 training tailored to your schedule.', 'part_61', 10000, 13000, 'Based on 70 hours in C172 at $150/hr, instructor $60/hr, materials $600', 4, 8, '2-3 flights per week, part-time', 40, 70, TRUE, TRUE),
('a2222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'ir', 'Instrument Rating (Part 61)', 'Instrument training with flexible scheduling and experienced instructors.', 'part_61', 8500, 10500, 'Based on 50 hours dual, simulator time, materials', 3, 5, 'Part-time schedule', 40, 50, TRUE, TRUE);

-- Austin Flight School Programs
INSERT INTO programs (id, school_id, program_type, program_name, description, training_type, min_total_cost, max_total_cost, cost_assumptions, min_duration_months, max_duration_months, timeline_assumptions, minimum_hours, typical_hours, financing_available, va_approved) VALUES
('a3333331-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333', 'ppl', 'Private Pilot License (Part 61)', 'Budget-friendly PPL training with personalized instruction.', 'part_61', 8500, 11000, 'Based on 65 hours in C152/C172 at $120-$145/hr, instructor $50/hr', 5, 10, '1-2 flights per week, weekend warrior', 40, 65, FALSE, FALSE);

-- Mile High Aviation Programs
INSERT INTO programs (id, school_id, program_type, program_name, description, training_type, min_total_cost, max_total_cost, cost_assumptions, min_duration_months, max_duration_months, minimum_hours, typical_hours, financing_available, va_approved) VALUES
('a4444441-4444-4444-4444-444444444444', '44444444-4444-4444-4444-444444444444', 'ppl', 'Private Pilot License (Part 61)', 'Mountain flying training with emphasis on high-altitude operations.', 'part_61', 11000, 14000, 'Based on 70 hours, mountain terrain', 6, 12, 40, 70, FALSE, FALSE),
('a4444442-4444-4444-4444-444444444444', '44444444-4444-4444-4444-444444444444', 'tailwheel', 'Tailwheel Endorsement', 'Learn to fly conventional gear aircraft.', 'part_61', 1500, 2500, 'Based on 10-15 hours dual', 0.5, 1, 0, 12, FALSE, FALSE);

-- Miami Flight Center Programs
INSERT INTO programs (id, school_id, program_type, program_name, description, training_type, min_total_cost, max_total_cost, cost_assumptions, min_duration_months, max_duration_months, timeline_assumptions, minimum_hours, typical_hours, financing_available, va_approved) VALUES
('a5555551-5555-5555-5555-555555555555', '55555555-5555-5555-5555-555555555555', 'ppl', 'Private Pilot License (Part 141)', 'Structured Part 141 training with year-round flying weather.', 'part_141', 11000, 14000, 'Based on 45 hours in C172, accelerated program', 3, 6, 'Full-time accelerated', 35, 48, TRUE, FALSE),
('a5555552-5555-5555-5555-555555555555', '55555555-5555-5555-5555-555555555555', 'multi', 'Multi-Engine Rating', 'Multi-engine training in Piper Seminole.', 'part_61', 4500, 6500, 'Based on 12-15 hours dual in Seminole', 1, 2, 'Add-on rating', 10, 13, TRUE, FALSE),
('a5555553-5555-5555-5555-555555555555', '55555555-5555-5555-5555-555555555555', 'seaplane', 'Seaplane Rating', 'Seaplane training in beautiful South Florida.', 'part_61', 3500, 4500, 'Based on 10 hours in seaplane', 0.5, 1, 'Add-on rating', 5, 10, FALSE, FALSE);

-- Chicago Flight Academy Programs
INSERT INTO programs (id, school_id, program_type, program_name, description, training_type, min_total_cost, max_total_cost, cost_assumptions, min_duration_months, max_duration_months, timeline_assumptions, minimum_hours, typical_hours, financing_available, va_approved) VALUES
('a6666661-6666-6666-6666-666666666666', '66666666-6666-6666-6666-666666666666', 'ppl', 'Private Pilot License (Part 141)', 'Comprehensive Part 141 training with modern fleet.', 'part_141', 12000, 15000, 'Based on 50 hours in C172SP, structured curriculum', 3, 6, '3-4 flights per week', 35, 52, TRUE, TRUE),
('a6666662-6666-6666-6666-666666666666', '66666666-6666-6666-6666-666666666666', 'ir', 'Instrument Rating (Part 141)', 'Accelerated instrument training with simulator integration.', 'part_141', 9000, 11500, 'Based on 40 hours dual, simulator', 2, 4, 'Accelerated program', 35, 42, TRUE, TRUE);

-- =====================================================
-- 3. AIRCRAFT
-- =====================================================

-- San Diego FTI Fleet
INSERT INTO aircraft (id, school_id, registration, make, model, year, category, has_glass_cockpit, avionics_type, hourly_rate_dual, hourly_rate_solo, is_available) VALUES
('a1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'N4572S', 'Cessna', '172S Skyhawk (G1000)', 2018, 'single_engine', TRUE, 'Garmin G1000', 185, 175, TRUE),
('a1111112-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'N3845T', 'Cessna', '172S Skyhawk (G1000)', 2019, 'single_engine', TRUE, 'Garmin G1000', 185, 175, TRUE),
('a1111113-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'N2163P', 'Cessna', '172S Skyhawk (G1000)', 2020, 'single_engine', TRUE, 'Garmin G1000', 190, 180, TRUE),
('a1111114-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'N8452R', 'Piper', 'Archer III (G1000)', 2019, 'single_engine', TRUE, 'Garmin G1000', 180, 170, TRUE),
('a1111115-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'N7391T', 'Cessna', '172RG Cutlass (Complex)', 2017, 'single_engine', FALSE, 'Garmin 430', 210, 200, TRUE),
('a1111116-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'N5284M', 'Piper', 'Seminole (Multi)', 2018, 'multi_engine', TRUE, 'Garmin G500', 385, 375, TRUE);

-- Phoenix Aviation Fleet
INSERT INTO aircraft (id, school_id, registration, make, model, year, category, has_glass_cockpit, avionics_type, hourly_rate_dual, hourly_rate_solo, is_available) VALUES
('a2222221-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'N1234A', 'Cessna', '172N Skyhawk', 2010, 'single_engine', FALSE, 'Garmin 430', 150, 140, TRUE),
('a2222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'N5678B', 'Cessna', '172SP Skyhawk', 2015, 'single_engine', FALSE, 'Garmin 430', 160, 150, TRUE),
('a2222223-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'N9012C', 'Piper', 'Warrior III', 2012, 'single_engine', FALSE, 'Garmin 430', 155, 145, TRUE);

-- Austin Flight School Fleet
INSERT INTO aircraft (id, school_id, registration, make, model, year, category, has_glass_cockpit, avionics_type, hourly_rate_dual, hourly_rate_solo, is_available) VALUES
('a3333331-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333', 'N3456D', 'Cessna', '152', 2008, 'single_engine', FALSE, 'Standard Six Pack', 120, 110, TRUE),
('a3333332-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333', 'N7890E', 'Cessna', '172M Skyhawk', 2009, 'single_engine', FALSE, 'Garmin 430', 145, 135, TRUE);

-- Mile High Aviation Fleet
INSERT INTO aircraft (id, school_id, registration, make, model, year, category, has_glass_cockpit, avionics_type, hourly_rate_dual, hourly_rate_solo, is_available) VALUES
('a4444441-4444-4444-4444-444444444444', '44444444-4444-4444-4444-444444444444', 'N1122F', 'Cessna', '172N Skyhawk', 2011, 'single_engine', FALSE, 'Garmin 430', 155, 145, TRUE),
('a4444442-4444-4444-4444-444444444444', '44444444-4444-4444-4444-444444444444', 'N3344G', 'Citabria', '7GCBC Scout (Tailwheel)', 2010, 'single_engine', FALSE, 'Standard', 165, 155, TRUE);

-- Miami Flight Center Fleet
INSERT INTO aircraft (id, school_id, registration, make, model, year, category, has_glass_cockpit, avionics_type, hourly_rate_dual, hourly_rate_solo, is_available) VALUES
('a5555551-5555-5555-5555-555555555555', '55555555-5555-5555-5555-555555555555', 'N5566H', 'Cessna', '172SP Skyhawk', 2016, 'single_engine', FALSE, 'Garmin 430', 165, 155, TRUE),
('a5555552-5555-5555-5555-555555555555', '55555555-5555-5555-5555-555555555555', 'N7788I', 'Piper', 'Seminole (Multi)', 2014, 'multi_engine', FALSE, 'Garmin 430', 350, 340, TRUE),
('a5555553-5555-5555-5555-555555555555', '55555555-5555-5555-5555-555555555555', 'N9900J', 'Cessna', '172 Skyhawk (Seaplane)', 2012, 'single_engine', FALSE, 'Standard', 195, 185, TRUE);

-- Chicago Flight Academy Fleet
INSERT INTO aircraft (id, school_id, registration, make, model, year, category, has_glass_cockpit, avionics_type, hourly_rate_dual, hourly_rate_solo, is_available) VALUES
('a6666661-6666-6666-6666-666666666666', '66666666-6666-6666-6666-666666666666', 'N1357K', 'Cessna', '172SP Skyhawk', 2017, 'single_engine', FALSE, 'Garmin 430', 170, 160, TRUE),
('a6666662-6666-6666-6666-666666666666', '66666666-6666-6666-6666-666666666666', 'N2468L', 'Cessna', '172S Skyhawk (G1000)', 2019, 'single_engine', TRUE, 'Garmin G1000', 190, 180, TRUE),
('a6666663-6666-6666-6666-666666666666', '66666666-6666-6666-6666-666666666666', 'N3579M', 'Piper', 'Archer III', 2015, 'single_engine', FALSE, 'Garmin 430', 165, 155, TRUE);

-- =====================================================
-- 4. SIMULATORS
-- =====================================================

INSERT INTO simulators (id, school_id, name, type, manufacturer, model, simulated_aircraft, has_motion, faa_approved, loggable_hours, hourly_rate) VALUES
('c1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Redbird FMX', 'aatd', 'Redbird', 'FMX', 'Cessna 172', TRUE, TRUE, TRUE, 75),
('c2222221-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'Frasca 141', 'batd', 'Frasca', '141', 'Generic Single-Engine', FALSE, TRUE, TRUE, 50),
('c6666661-6666-6666-6666-666666666666', '66666666-6666-6666-6666-666666666666', 'Precision Flight Controls', 'aatd', 'Precision', 'PFTC-142', 'Cessna 172SP', FALSE, TRUE, TRUE, 65);

-- =====================================================
-- 5. REVIEWS
-- =====================================================

-- San Diego FTI Reviews
INSERT INTO reviews (id, school_id, student_name, program_completed, rating, title, review_text, rating_instructors, rating_aircraft, rating_facilities, rating_value, rating_support, is_verified, is_approved) VALUES
('b1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Michael Johnson', 'ppl', 5.0, 'Best decision I ever made!', 'I completed my PPL here in just 4 months! The instructors are top-notch, the aircraft are new and well-maintained, and the structured curriculum kept me on track. Worth every penny.', 5.0, 5.0, 5.0, 4.5, 5.0, TRUE, TRUE),
('b1111112-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Sarah Chen', 'ir', 4.8, 'Excellent instrument training', 'The G1000 fleet made instrument training so much easier. My instructor was patient and thorough. Passed my checkride on the first try!', 5.0, 5.0, 4.5, 4.5, 5.0, TRUE, TRUE),
('b1111113-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'David Martinez', 'cpl', 4.7, 'Great professional training', 'If you want to become a career pilot, this is the place. They prepare you for the real world of aviation.', 4.5, 5.0, 4.5, 4.5, 5.0, TRUE, TRUE);

-- Phoenix Aviation Reviews
INSERT INTO reviews (id, school_id, student_name, program_completed, rating, title, review_text, rating_instructors, rating_aircraft, rating_facilities, rating_value, rating_support, is_verified, is_approved) VALUES
('b2222221-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'Jennifer Williams', 'ppl', 4.6, 'Solid training, flexible schedule', 'As a part-time student, I appreciated the flexible scheduling. Took me about 7 months but the instructors were always accommodating.', 4.5, 4.5, 4.0, 5.0, 4.5, TRUE, TRUE),
('b2222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'Robert Taylor', 'ir', 4.5, 'Good instrument program', 'Great instructors with lots of real-world experience. Aircraft are older but well-maintained.', 5.0, 4.0, 4.0, 4.5, 4.5, TRUE, TRUE);

-- Austin Flight School Reviews
INSERT INTO reviews (id, school_id, student_name, program_completed, rating, title, review_text, rating_instructors, rating_aircraft, rating_facilities, is_verified, is_approved) VALUES
('b3333331-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333', 'Emily Anderson', 'ppl', 4.3, 'Budget-friendly option', 'If you''re looking to save money, this is a great choice. The training is solid, just be patient with scheduling.', 4.0, 4.0, 3.5, 5.0, 4.0, TRUE, TRUE);

-- Miami Flight Center Reviews
INSERT INTO reviews (id, school_id, student_name, program_completed, rating, title, review_text, rating_instructors, rating_aircraft, rating_facilities, rating_value, is_verified, is_approved) VALUES
('b5555551-5555-5555-5555-555555555555', '55555555-5555-5555-5555-555555555555', 'Carlos Rodriguez', 'ppl', 4.7, 'Great weather, great training', 'You can fly almost every day here! Finished my PPL in 4 months with no weather delays. The multi-engine training is excellent too.', 4.5, 4.5, 4.5, 4.5, 5.0, TRUE, TRUE);

-- Chicago Flight Academy Reviews
INSERT INTO reviews (id, school_id, student_name, program_completed, rating, title, review_text, rating_instructors, rating_aircraft, rating_facilities, rating_value, is_verified, is_approved) VALUES
('b6666661-6666-6666-6666-666666666666', '66666666-6666-6666-6666-666666666666', 'Jessica Brown', 'ppl', 4.6, 'Professional and organized', 'Very well-organized school with professional staff. Weather can be challenging in winter but they make the most of good days.', 4.5, 4.5, 5.0, 4.5, 4.5, TRUE, TRUE);

-- =====================================================
-- 6. FINANCING PARTNERS
-- =====================================================

INSERT INTO financing_partners (id, name, logo_url, website, description, min_loan_amount, max_loan_amount, min_apr, max_apr, loan_term_months, min_credit_score, requires_cosigner) VALUES
('f1111111-1111-1111-1111-111111111111', 'Aviation Finance Corp', 'https://example.com/afc-logo.png', 'https://aviationfinance.com', 'Specialized flight training loans with competitive rates for qualified borrowers.', 5000, 100000, 6.99, 14.99, 84, 650, FALSE),
('f2222222-2222-2222-2222-222222222222', 'Pilot Path Lending', 'https://example.com/ppl-logo.png', 'https://pilotpathlending.com', 'Flexible loan options for aspiring pilots, including cosigner programs for students.', 3000, 75000, 7.99, 16.99, 60, 580, TRUE),
('f3333333-3333-3333-3333-333333333333', 'Stratus Financial', 'https://example.com/stratus-logo.png', 'https://stratusfinancial.com', 'Industry leader in flight training financing with fast approvals.', 2500, 150000, 6.49, 13.99, 120, 680, FALSE);

-- =====================================================
-- 7. SCHOLARSHIPS
-- =====================================================

INSERT INTO scholarships (id, name, provider, description, amount, deadline, application_url, eligibility_criteria, program_types) VALUES
('sc111111-1111-1111-1111-111111111111', 'AOPA Flight Training Scholarship', 'Aircraft Owners and Pilots Association', 'Scholarships for high school students pursuing their private pilot license.', 10000, '2025-03-31', 'https://aopa.org/scholarships', 'High school students aged 15-18, good academic standing', ARRAY['ppl']),
('sc222222-2222-2222-2222-222222222222', 'Women in Aviation International Scholarship', 'Women in Aviation International', 'Scholarships for women pursuing aviation careers at all levels.', 5000, '2025-06-30', 'https://wai.org/scholarships', 'Female students, all ratings', ARRAY['ppl', 'ir', 'cpl', 'cfi']),
('sc333333-3333-3333-3333-333333333333', 'EAA Young Eagles Scholarship', 'Experimental Aircraft Association', 'Flight training scholarships for Young Eagles participants.', 8000, '2025-05-15', 'https://eaa.org/scholarships', 'Young Eagles participants aged 16-19', ARRAY['ppl']);

-- =====================================================
-- END OF SEED DATA
-- =====================================================

