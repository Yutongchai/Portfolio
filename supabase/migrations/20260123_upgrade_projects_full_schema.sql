-- Drop existing projects table if it exists
DROP TABLE IF EXISTS projects CASCADE;

-- Create the full projects table matching database.types.ts
-- Ensure trigger function exists for updated_at
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE projects (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  long_description TEXT NOT NULL,
  featured_image_url TEXT NOT NULL,
  image_alt TEXT,
  -- FK to project_types for dropdown selection
  type_id UUID REFERENCES project_types(id) ON DELETE SET NULL,
  technologies TEXT[] DEFAULT '{}',
  year TEXT NOT NULL,
  client TEXT NOT NULL,
  role TEXT,
  duration TEXT NOT NULL,
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

-- Indexes for performance
CREATE INDEX idx_projects_is_active ON projects(is_active);
CREATE INDEX idx_projects_featured ON projects(featured);
CREATE INDEX idx_projects_display_order ON projects(display_order);
CREATE INDEX idx_projects_category ON projects(category);
CREATE INDEX idx_projects_type_id ON projects(type_id);

-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Allow public read access to active projects"
  ON projects
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Allow authenticated users full access to projects"
  ON projects
  FOR ALL
  USING (auth.role() = 'authenticated');

-- Trigger for updated_at
CREATE TRIGGER projects_set_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

-- Note: project_gallery table remains unchanged and will work with this new schema
