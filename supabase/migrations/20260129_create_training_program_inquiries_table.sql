-- Create training_program_inquiries table
CREATE TABLE IF NOT EXISTS training_program_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  contact BIGINT NOT NULL,
  company_name TEXT NOT NULL,
  company_email TEXT NOT NULL CHECK (company_email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}$'),
  industry TEXT,
  no_of_pax INTEGER,
  duration TEXT,
  types_of_training TEXT[],
  estimated_training_month TEXT,
  budget NUMERIC(12,2),
  hrdc BOOLEAN DEFAULT false,
  preferred_location TEXT,
  language TEXT,
  remarks TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'pending'
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_training_inquiries_email ON training_program_inquiries(company_email);
CREATE INDEX IF NOT EXISTS idx_training_inquiries_created_at ON training_program_inquiries(created_at);
CREATE INDEX IF NOT EXISTS idx_training_inquiries_status ON training_program_inquiries(status);

-- Enable Row Level Security
ALTER TABLE training_program_inquiries ENABLE ROW LEVEL SECURITY;

-- Allow public insert (for form submissions)
CREATE POLICY "Allow public insert for training program inquiries"
  ON training_program_inquiries
  FOR INSERT
  WITH CHECK (true);

-- Allow authenticated users to view all inquiries
CREATE POLICY "Allow authenticated users to view training program inquiries"
  ON training_program_inquiries
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow authenticated users to update
CREATE POLICY "Allow authenticated users to update training program inquiries"
  ON training_program_inquiries
  FOR UPDATE
  TO authenticated
  USING (true);
