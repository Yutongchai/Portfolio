-- Create projects table for work showcase
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  long_description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  technologies TEXT[] DEFAULT '{}',
  year TEXT NOT NULL,
  client TEXT NOT NULL,
  role TEXT,
  duration TEXT NOT NULL,
  challenge TEXT NOT NULL,
  solution TEXT NOT NULL,
  outcome TEXT NOT NULL,
  metrics JSONB DEFAULT '[]',
  testimonial JSONB,
  gallery JSONB DEFAULT '[]',
  featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add missing columns if table already exists
DO $$ 
BEGIN
  -- Add featured column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'projects' AND column_name = 'featured') THEN
    ALTER TABLE projects ADD COLUMN featured BOOLEAN DEFAULT false;
  END IF;

  -- Add is_active column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'projects' AND column_name = 'is_active') THEN
    ALTER TABLE projects ADD COLUMN is_active BOOLEAN DEFAULT true;
  END IF;

  -- Add display_order column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'projects' AND column_name = 'display_order') THEN
    ALTER TABLE projects ADD COLUMN display_order INTEGER DEFAULT 0;
  END IF;

  -- Add metrics column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'projects' AND column_name = 'metrics') THEN
    ALTER TABLE projects ADD COLUMN metrics JSONB DEFAULT '[]';
  END IF;

  -- Add testimonial column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'projects' AND column_name = 'testimonial') THEN
    ALTER TABLE projects ADD COLUMN testimonial JSONB;
  END IF;

  -- Add gallery column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'projects' AND column_name = 'gallery') THEN
    ALTER TABLE projects ADD COLUMN gallery JSONB DEFAULT '[]';
  END IF;

  -- Add alt_text column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'projects' AND column_name = 'alt_text') THEN
    ALTER TABLE projects ADD COLUMN alt_text TEXT;
  END IF;

  -- Add technologies column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'projects' AND column_name = 'technologies') THEN
    ALTER TABLE projects ADD COLUMN technologies TEXT[] DEFAULT '{}';
  END IF;

  -- Add role column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'projects' AND column_name = 'role') THEN
    ALTER TABLE projects ADD COLUMN role TEXT;
  END IF;
END $$;

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_projects_is_active ON projects(is_active);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured);
CREATE INDEX IF NOT EXISTS idx_projects_display_order ON projects(display_order);

-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public read access to active projects" ON projects;
DROP POLICY IF EXISTS "Allow authenticated users full access to projects" ON projects;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access to active projects"
  ON projects
  FOR SELECT
  USING (is_active = true);

-- Create policy to allow authenticated users full access (for admin)
CREATE POLICY "Allow authenticated users full access to projects"
  ON projects
  FOR ALL
  USING (auth.role() = 'authenticated');
