-- Flight Schedule Pro - Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create ENUM types
CREATE TYPE booking_status AS ENUM ('SCHEDULED', 'IN_FLIGHT', 'COMPLETED', 'CANCELLED', 'WEATHER_HOLD');
CREATE TYPE training_level AS ENUM ('PPL', 'IR', 'CPL', 'CFI');
CREATE TYPE severity AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');
CREATE TYPE notification_type AS ENUM ('EMAIL', 'SMS', 'PUSH');
CREATE TYPE notification_status AS ENUM ('PENDING', 'SENT', 'FAILED');

-- Students table
CREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(50),
  training_level training_level NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Instructors table
CREATE TABLE instructors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(50),
  certifications TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Aircraft table
CREATE TABLE aircraft (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tail_number VARCHAR(50) NOT NULL UNIQUE,
  model VARCHAR(100) NOT NULL,
  category VARCHAR(50) NOT NULL,
  available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Locations table
CREATE TABLE locations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  code VARCHAR(10) NOT NULL UNIQUE,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  elevation INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Flight Bookings table
CREATE TABLE flight_bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  instructor_id UUID NOT NULL REFERENCES instructors(id) ON DELETE CASCADE,
  aircraft_id UUID NOT NULL REFERENCES aircraft(id) ON DELETE CASCADE,
  departure_location_id UUID NOT NULL REFERENCES locations(id),
  destination_location_id UUID REFERENCES locations(id),
  scheduled_time TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER NOT NULL,
  status booking_status NOT NULL DEFAULT 'SCHEDULED',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Weather Conditions table
CREATE TABLE weather_conditions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  location_id UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
  temperature DECIMAL(5, 2),
  wind_speed DECIMAL(5, 2),
  wind_direction INTEGER,
  visibility DECIMAL(5, 2),
  ceiling INTEGER,
  conditions VARCHAR(100),
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Weather Alerts table
CREATE TABLE weather_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES flight_bookings(id) ON DELETE CASCADE,
  severity severity NOT NULL,
  violated_minimums TEXT[],
  current_conditions JSONB,
  detected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reschedule Options table
CREATE TABLE reschedule_options (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES flight_bookings(id) ON DELETE CASCADE,
  proposed_time TIMESTAMP WITH TIME ZONE NOT NULL,
  score DECIMAL(3, 2),
  reasoning TEXT,
  weather_forecast JSONB,
  accepted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications table
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type notification_type NOT NULL,
  status notification_status NOT NULL DEFAULT 'PENDING',
  recipient_email VARCHAR(255),
  recipient_phone VARCHAR(50),
  subject VARCHAR(500),
  body TEXT,
  metadata JSONB,
  sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Events table (for event sourcing)
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_type VARCHAR(100) NOT NULL,
  aggregate_id UUID NOT NULL,
  payload JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audit Logs table
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID,
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(100),
  entity_id UUID,
  changes JSONB,
  ip_address VARCHAR(50),
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_bookings_student ON flight_bookings(student_id);
CREATE INDEX idx_bookings_instructor ON flight_bookings(instructor_id);
CREATE INDEX idx_bookings_aircraft ON flight_bookings(aircraft_id);
CREATE INDEX idx_bookings_scheduled_time ON flight_bookings(scheduled_time);
CREATE INDEX idx_bookings_status ON flight_bookings(status);
CREATE INDEX idx_weather_location ON weather_conditions(location_id);
CREATE INDEX idx_weather_timestamp ON weather_conditions(timestamp);
CREATE INDEX idx_alerts_booking ON weather_alerts(booking_id);
CREATE INDEX idx_alerts_severity ON weather_alerts(severity);
CREATE INDEX idx_events_aggregate ON events(aggregate_id);
CREATE INDEX idx_events_type ON events(event_type);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers to update updated_at automatically
CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON students
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_instructors_updated_at BEFORE UPDATE ON instructors
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_aircraft_updated_at BEFORE UPDATE ON aircraft
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_locations_updated_at BEFORE UPDATE ON locations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_flight_bookings_updated_at BEFORE UPDATE ON flight_bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create views for common queries
CREATE OR REPLACE VIEW active_bookings AS
SELECT 
  fb.*,
  s.name as student_name,
  s.email as student_email,
  i.name as instructor_name,
  a.tail_number,
  a.model as aircraft_model,
  dl.name as departure_location,
  dl.code as departure_code,
  destl.name as destination_location,
  destl.code as destination_code
FROM flight_bookings fb
JOIN students s ON fb.student_id = s.id
JOIN instructors i ON fb.instructor_id = i.id
JOIN aircraft a ON fb.aircraft_id = a.id
JOIN locations dl ON fb.departure_location_id = dl.id
LEFT JOIN locations destl ON fb.destination_location_id = destl.id
WHERE fb.status IN ('SCHEDULED', 'IN_FLIGHT', 'WEATHER_HOLD')
ORDER BY fb.scheduled_time;

CREATE OR REPLACE VIEW active_weather_alerts_view AS
SELECT 
  wa.*,
  fb.scheduled_time,
  s.name as student_name,
  s.email as student_email,
  l.name as location_name,
  l.code as location_code
FROM weather_alerts wa
JOIN flight_bookings fb ON wa.booking_id = fb.id
JOIN students s ON fb.student_id = s.id
JOIN locations l ON fb.departure_location_id = l.id
WHERE wa.resolved_at IS NULL
ORDER BY wa.severity DESC, wa.detected_at DESC;

-- Grant permissions (adjust as needed for your Row Level Security policies)
-- For now, allowing all operations - you should add RLS policies later
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE instructors ENABLE ROW LEVEL SECURITY;
ALTER TABLE aircraft ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE flight_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE weather_conditions ENABLE ROW LEVEL SECURITY;
ALTER TABLE weather_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE reschedule_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Create permissive policies for development (CHANGE THESE FOR PRODUCTION!)
CREATE POLICY "Allow all operations for authenticated users" ON students FOR ALL USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON instructors FOR ALL USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON aircraft FOR ALL USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON locations FOR ALL USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON flight_bookings FOR ALL USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON weather_conditions FOR ALL USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON weather_alerts FOR ALL USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON reschedule_options FOR ALL USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON notifications FOR ALL USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON events FOR ALL USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON audit_logs FOR ALL USING (true);

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Database schema created successfully!';
  RAISE NOTICE 'Next step: Run the seed data script to populate sample data.';
END $$;

