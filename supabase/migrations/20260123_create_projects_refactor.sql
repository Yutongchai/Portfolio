-- Refactor projects schema: normalized project and gallery tables
-- WARNING: Run this in Supabase SQL Editor after taking a backup

-- Ensure pgcrypto for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1) Project types table (for dropdowns / lookups)
CREATE TABLE IF NOT EXISTS project_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type_key TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2) Projects table (main record)
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL,
  description TEXT,
  type_id UUID REFERENCES project_types(id) ON DELETE SET NULL,
  project_date DATE,
  featured_image_url TEXT,
  image_alt TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3) Project gallery table (one-to-many)
CREATE TABLE IF NOT EXISTS project_gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt TEXT,
  caption TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_projects_type_id ON projects(type_id);
CREATE INDEX IF NOT EXISTS idx_gallery_project_id ON project_gallery(project_id);
CREATE INDEX IF NOT EXISTS idx_gallery_display_order ON project_gallery(project_id, display_order);

-- Trigger function to maintain updated_at timestamps
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Attach trigger to tables that have updated_at
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'projects_set_updated_at'
  ) THEN
    CREATE TRIGGER projects_set_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW
    EXECUTE PROCEDURE set_updated_at();
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'project_types_set_updated_at'
  ) THEN
    CREATE TRIGGER project_types_set_updated_at
    BEFORE UPDATE ON project_types
    FOR EACH ROW
    EXECUTE PROCEDURE set_updated_at();
  END IF;
END;
$$;

-- Notes:
-- - `featured_image_url` stores public URL of the main image (uploaded to storage).
-- - Gallery rows are stored in `project_gallery` and linked by `project_id`.
-- - Use `project_types` to store selectable types for dropdowns in the admin UI.
-- - Run this migration after backing up any existing data.
