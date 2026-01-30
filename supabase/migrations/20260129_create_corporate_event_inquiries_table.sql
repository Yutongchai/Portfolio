-- Create corporate_event_inquiries table
CREATE TABLE IF NOT EXISTS corporate_event_inquiries (
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
CREATE INDEX IF NOT EXISTS idx_corporate_event_inquiries_email ON corporate_event_inquiries(company_email);
CREATE INDEX IF NOT EXISTS idx_corporate_event_inquiries_created_at ON corporate_event_inquiries(created_at);
CREATE INDEX IF NOT EXISTS idx_corporate_event_inquiries_status ON corporate_event_inquiries(status);

-- Enable Row Level Security
ALTER TABLE corporate_event_inquiries ENABLE ROW LEVEL SECURITY;

-- Allow public insert (for form submissions)
CREATE POLICY "Allow public insert for corporate event inquiries"
  ON corporate_event_inquiries
  FOR INSERT
  WITH CHECK (true);

-- Allow authenticated users to view all inquiries
CREATE POLICY "Allow authenticated users to view corporate event inquiries"
  ON corporate_event_inquiries
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow authenticated users to update
CREATE POLICY "Allow authenticated users to update corporate event inquiries"
  ON corporate_event_inquiries
  FOR UPDATE
  TO authenticated
  USING (true);
