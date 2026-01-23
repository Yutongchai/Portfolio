-- Archive legacy image fields then drop them from projects
-- WARNING: Run in Supabase SQL Editor after taking a backup

-- Create an archive table for safety (only once)
CREATE TABLE IF NOT EXISTS projects_legacy_images (
  archived_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  project_id TEXT,
  image_url TEXT,
  alt_text TEXT
);

-- Copy existing non-null legacy values into archive
INSERT INTO projects_legacy_images (project_id, image_url, alt_text)
SELECT id, image_url, alt_text
FROM projects
WHERE image_url IS NOT NULL OR alt_text IS NOT NULL;

-- Drop legacy columns (safe with IF EXISTS)
ALTER TABLE projects
  DROP COLUMN IF EXISTS image_url,
  DROP COLUMN IF EXISTS alt_text;

-- Update updated_at to now() for audited change
UPDATE projects SET updated_at = NOW();

-- Note: If you prefer to rename instead of drop, use ALTER TABLE ... RENAME COLUMN.
-- Verify the archive table contents before dropping in production.
