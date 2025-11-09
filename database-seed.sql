-- Flight Schedule Pro - Sample Seed Data
-- Run this AFTER running database-schema.sql

-- Insert sample locations
INSERT INTO locations (name, code, latitude, longitude, elevation) VALUES
('San Francisco International', 'KSFO', 37.6213, -122.3790, 13),
('Oakland International', 'KOAK', 37.7213, -122.2207, 9),
('San Jose International', 'KSJC', 37.3626, -121.9290, 62),
('Palo Alto Airport', 'KPAO', 37.4611, -122.1150, 4),
('Half Moon Bay Airport', 'KHAF', 37.5134, -122.5009, 66);

-- Insert sample instructors
INSERT INTO instructors (name, email, phone, certifications) VALUES
('John Smith', 'john.smith@flightschool.com', '555-0101', ARRAY['CFI', 'CFII', 'MEI']),
('Sarah Johnson', 'sarah.johnson@flightschool.com', '555-0102', ARRAY['CFI', 'CFII']),
('Michael Chen', 'michael.chen@flightschool.com', '555-0103', ARRAY['CFI', 'CFI-S']),
('Emily Rodriguez', 'emily.rodriguez@flightschool.com', '555-0104', ARRAY['CFI', 'CFII', 'MEI']);

-- Insert sample students
INSERT INTO students (name, email, phone, training_level) VALUES
('Alex Thompson', 'alex.thompson@email.com', '555-1001', 'PPL'),
('Jessica Martinez', 'jessica.martinez@email.com', '555-1002', 'IR'),
('David Kim', 'david.kim@email.com', '555-1003', 'PPL'),
('Rachel Green', 'rachel.green@email.com', '555-1004', 'CPL'),
('Tom Wilson', 'tom.wilson@email.com', '555-1005', 'PPL'),
('Lisa Anderson', 'lisa.anderson@email.com', '555-1006', 'IR');

-- Insert sample aircraft
INSERT INTO aircraft (tail_number, model, category, available) VALUES
('N12345', 'Cessna 172S Skyhawk', 'Single Engine Land', true),
('N67890', 'Piper PA-28 Cherokee', 'Single Engine Land', true),
('N11111', 'Cessna 182T Skylane', 'Single Engine Land', true),
('N22222', 'Diamond DA40', 'Single Engine Land', true),
('N33333', 'Cirrus SR22', 'Single Engine Land', false);

-- Insert sample bookings for today and upcoming days
DO $$
DECLARE
  student_ids UUID[];
  instructor_ids UUID[];
  aircraft_ids UUID[];
  location_ids UUID[];
  i INTEGER;
BEGIN
  -- Get all IDs into arrays
  SELECT ARRAY_AGG(id) INTO student_ids FROM students;
  SELECT ARRAY_AGG(id) INTO instructor_ids FROM instructors;
  SELECT ARRAY_AGG(id) INTO aircraft_ids FROM aircraft WHERE available = true;
  SELECT ARRAY_AGG(id) INTO location_ids FROM locations;

  -- Create bookings for today
  FOR i IN 1..3 LOOP
    INSERT INTO flight_bookings (
      student_id, 
      instructor_id, 
      aircraft_id, 
      departure_location_id, 
      destination_location_id,
      scheduled_time, 
      duration_minutes, 
      status,
      notes
    ) VALUES (
      student_ids[1 + (i % array_length(student_ids, 1))],
      instructor_ids[1 + (i % array_length(instructor_ids, 1))],
      aircraft_ids[1 + (i % array_length(aircraft_ids, 1))],
      location_ids[1],
      location_ids[2 + (i % (array_length(location_ids, 1) - 1))],
      NOW() + (i * INTERVAL '3 hours'),
      90,
      'SCHEDULED',
      'Pattern work and cross-country training'
    );
  END LOOP;

  -- Create bookings for tomorrow
  FOR i IN 1..4 LOOP
    INSERT INTO flight_bookings (
      student_id, 
      instructor_id, 
      aircraft_id, 
      departure_location_id, 
      destination_location_id,
      scheduled_time, 
      duration_minutes, 
      status,
      notes
    ) VALUES (
      student_ids[1 + (i % array_length(student_ids, 1))],
      instructor_ids[1 + (i % array_length(instructor_ids, 1))],
      aircraft_ids[1 + (i % array_length(aircraft_ids, 1))],
      location_ids[1 + (i % array_length(location_ids, 1))],
      location_ids[1 + ((i + 1) % array_length(location_ids, 1))],
      NOW() + INTERVAL '1 day' + (i * INTERVAL '2 hours'),
      120,
      'SCHEDULED',
      CASE 
        WHEN i % 3 = 0 THEN 'Instrument training'
        WHEN i % 3 = 1 THEN 'Night flight training'
        ELSE 'Solo practice flight'
      END
    );
  END LOOP;

  -- Create bookings for next week
  FOR i IN 1..5 LOOP
    INSERT INTO flight_bookings (
      student_id, 
      instructor_id, 
      aircraft_id, 
      departure_location_id, 
      destination_location_id,
      scheduled_time, 
      duration_minutes, 
      status,
      notes
    ) VALUES (
      student_ids[1 + (i % array_length(student_ids, 1))],
      instructor_ids[1 + (i % array_length(instructor_ids, 1))],
      aircraft_ids[1 + (i % array_length(aircraft_ids, 1))],
      location_ids[1 + (i % array_length(location_ids, 1))],
      location_ids[1 + ((i + 2) % array_length(location_ids, 1))],
      NOW() + INTERVAL '7 days' + (i * INTERVAL '4 hours'),
      90,
      'SCHEDULED',
      'Advanced maneuvers and emergency procedures'
    );
  END LOOP;

  RAISE NOTICE 'Created % bookings', i;
END $$;

-- Insert current weather conditions
DO $$
DECLARE
  location_rec RECORD;
BEGIN
  FOR location_rec IN SELECT id FROM locations LOOP
    INSERT INTO weather_conditions (
      location_id,
      temperature,
      wind_speed,
      wind_direction,
      visibility,
      ceiling,
      conditions,
      timestamp
    ) VALUES (
      location_rec.id,
      15 + (RANDOM() * 10), -- 15-25°C
      5 + (RANDOM() * 15),  -- 5-20 knots
      (RANDOM() * 360)::INTEGER,
      10,  -- 10 statute miles
      3000 + (RANDOM() * 5000)::INTEGER,
      CASE (RANDOM() * 4)::INTEGER
        WHEN 0 THEN 'Clear'
        WHEN 1 THEN 'Few Clouds'
        WHEN 2 THEN 'Scattered Clouds'
        ELSE 'Broken Clouds'
      END,
      NOW()
    );
  END LOOP;
END $$;

-- Insert a sample weather alert (optional - for testing)
DO $$
DECLARE
  first_booking_id UUID;
BEGIN
  SELECT id INTO first_booking_id FROM flight_bookings ORDER BY scheduled_time LIMIT 1;
  
  IF first_booking_id IS NOT NULL THEN
    INSERT INTO weather_alerts (
      booking_id,
      severity,
      violated_minimums,
      current_conditions,
      detected_at
    ) VALUES (
      first_booking_id,
      'MEDIUM',
      ARRAY['Visibility below 5 SM', 'Ceiling below 3000 ft'],
      '{"visibility": 4, "ceiling": 2500, "wind_speed": 18}'::JSONB,
      NOW()
    );
  END IF;
END $$;

-- Success message
DO $$
DECLARE
  student_count INTEGER;
  instructor_count INTEGER;
  aircraft_count INTEGER;
  location_count INTEGER;
  booking_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO student_count FROM students;
  SELECT COUNT(*) INTO instructor_count FROM instructors;
  SELECT COUNT(*) INTO aircraft_count FROM aircraft;
  SELECT COUNT(*) INTO location_count FROM locations;
  SELECT COUNT(*) INTO booking_count FROM flight_bookings;
  
  RAISE NOTICE '====================================';
  RAISE NOTICE 'Seed data inserted successfully!';
  RAISE NOTICE '====================================';
  RAISE NOTICE 'Students: %', student_count;
  RAISE NOTICE 'Instructors: %', instructor_count;
  RAISE NOTICE 'Aircraft: %', aircraft_count;
  RAISE NOTICE 'Locations: %', location_count;
  RAISE NOTICE 'Bookings: %', booking_count;
  RAISE NOTICE '====================================';
  RAISE NOTICE 'You can now start using the application!';
END $$;

