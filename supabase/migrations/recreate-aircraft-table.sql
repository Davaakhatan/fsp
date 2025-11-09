-- Drop and recreate aircraft table with full marketplace schema

DROP TABLE IF EXISTS aircraft CASCADE;

-- Recreate with marketplace schema (includes school_id and all fields)
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
  hourly_rate DECIMAL(10, 2),
  avionics TEXT,
  maintenance_status VARCHAR(50) CHECK (maintenance_status IN ('excellent', 'good', 'fair', 'maintenance_required')),
  
  -- Usage Tracking
  total_hours DECIMAL(10, 2),
  last_inspection TIMESTAMP,
  
  -- Media
  image_url TEXT,
  
  -- Availability
  is_available BOOLEAN DEFAULT TRUE,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Add indexes
CREATE INDEX idx_aircraft_school_id ON aircraft(school_id);
CREATE INDEX idx_aircraft_category ON aircraft(category);
CREATE INDEX idx_aircraft_available ON aircraft(is_available);

-- Also need tail_number for portal compatibility
ALTER TABLE aircraft ADD COLUMN tail_number VARCHAR(20);

-- Success message
SELECT 'Aircraft table recreated with full marketplace schema!' as message;

