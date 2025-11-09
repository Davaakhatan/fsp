-- Modified booking system schema to work alongside marketplace
-- This version uses CREATE TABLE IF NOT EXISTS to avoid conflicts

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create ENUM types
DO $$ BEGIN
    CREATE TYPE booking_status AS ENUM ('SCHEDULED', 'IN_FLIGHT', 'COMPLETED', 'CANCELLED', 'WEATHER_HOLD');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE training_level AS ENUM ('PPL', 'IR', 'CPL', 'CFI');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE severity AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE notification_type AS ENUM ('EMAIL', 'SMS', 'PUSH');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE notification_status AS ENUM ('PENDING', 'SENT', 'FAILED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Students table (booking system specific)
CREATE TABLE IF NOT EXISTS students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(50),
  training_level training_level NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Locations table (booking system specific)
CREATE TABLE IF NOT EXISTS locations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  code VARCHAR(10) NOT NULL UNIQUE,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  elevation INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Flight Bookings table
CREATE TABLE IF NOT EXISTS flight_bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  instructor_id UUID REFERENCES instructors(id) ON DELETE SET NULL,
  aircraft_id UUID REFERENCES aircraft(id) ON DELETE SET NULL,
  departure_location_id UUID REFERENCES locations(id) ON DELETE SET NULL,
  destination_location_id UUID REFERENCES locations(id) ON DELETE SET NULL,
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  status booking_status DEFAULT 'SCHEDULED',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Weather Conditions table
CREATE TABLE IF NOT EXISTS weather_conditions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  location_id UUID REFERENCES locations(id) ON DELETE CASCADE,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  visibility_sm DECIMAL(5, 2),
  ceiling_ft INTEGER,
  wind_speed_kt INTEGER,
  wind_gust_kt INTEGER,
  temperature_c DECIMAL(5, 2),
  is_safe_for_training BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Weather Alerts table
CREATE TABLE IF NOT EXISTS weather_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  location_id UUID REFERENCES locations(id) ON DELETE CASCADE,
  severity severity NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  affected_bookings_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- Reschedule Options table
CREATE TABLE IF NOT EXISTS reschedule_options (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID REFERENCES flight_bookings(id) ON DELETE CASCADE,
  suggested_at TIMESTAMP WITH TIME ZONE NOT NULL,
  reason VARCHAR(255),
  generated_by VARCHAR(50) DEFAULT 'AI',
  is_selected BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID,
  type notification_type NOT NULL,
  subject VARCHAR(255) NOT NULL,
  body TEXT NOT NULL,
  status notification_status DEFAULT 'PENDING',
  sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Events table (analytics)
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_type VARCHAR(100) NOT NULL,
  event_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audit Logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  table_name VARCHAR(100) NOT NULL,
  record_id UUID NOT NULL,
  action VARCHAR(50) NOT NULL,
  old_data JSONB,
  new_data JSONB,
  user_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_flight_bookings_scheduled_at ON flight_bookings(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_flight_bookings_status ON flight_bookings(status);
CREATE INDEX IF NOT EXISTS idx_flight_bookings_student_id ON flight_bookings(student_id);
CREATE INDEX IF NOT EXISTS idx_weather_alerts_location_id ON weather_alerts(location_id);
CREATE INDEX IF NOT EXISTS idx_weather_alerts_is_active ON weather_alerts(is_active);
CREATE INDEX IF NOT EXISTS idx_events_event_type ON events(event_type);
CREATE INDEX IF NOT EXISTS idx_events_created_at ON events(created_at);

-- Success message
SELECT 'Booking system schema created successfully (compatible with marketplace)!' as message;

