-- Create team_building_inquiries table
CREATE TABLE IF NOT EXISTS team_building_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  contact BIGINT NOT NULL,
  company_name TEXT NOT NULL,
  company_email TEXT NOT NULL CHECK (company_email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}$'),
  industry TEXT,
  no_of_pax INTEGER,
  duration TEXT,
  estimated_event_month TEXT,
  budget TEXT,
  hrdc BOOLEAN DEFAULT false,
  preferred_location TEXT,
  language TEXT,
  remarks TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'pending'
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_team_building_inquiries_email ON team_building_inquiries(company_email);
CREATE INDEX IF NOT EXISTS idx_team_building_inquiries_created_at ON team_building_inquiries(created_at);
CREATE INDEX IF NOT EXISTS idx_team_building_inquiries_status ON team_building_inquiries(status);

-- Enable Row Level Security
ALTER TABLE team_building_inquiries ENABLE ROW LEVEL SECURITY;

-- Allow public insert (for form submissions)
CREATE POLICY "Allow public insert for team building inquiries"
  ON team_building_inquiries
  FOR INSERT
  WITH CHECK (true);

-- Allow authenticated users to view all inquiries
CREATE POLICY "Allow authenticated users to view team building inquiries"
  ON team_building_inquiries
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow authenticated users to update
CREATE POLICY "Allow authenticated users to update team building inquiries"
  ON team_building_inquiries
  FOR UPDATE
  TO authenticated
  USING (true);
