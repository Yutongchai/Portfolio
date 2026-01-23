-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- 1. HERO IMAGES TABLE (Personal Story Section)
-- =============================================
CREATE TABLE hero_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Index for faster queries
CREATE INDEX idx_hero_images_active ON hero_images(is_active, display_order);

-- =============================================
-- 2. CLIENT LOGOS TABLE (Client Dome Gallery)
-- =============================================
CREATE TABLE client_logos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_name VARCHAR(255) NOT NULL,
  logo_url TEXT NOT NULL,
  alt_text TEXT,
  website_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

CREATE INDEX idx_client_logos_active ON client_logos(is_active, display_order);

-- =============================================
-- 3. PROJECTS TABLE (Work Showcase)
-- =============================================
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug VARCHAR(255) UNIQUE NOT NULL, -- URL-friendly identifier
  title VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  description TEXT,
  long_description TEXT,
  
  -- Main project image
  featured_image_url TEXT,
  image_alt TEXT,
  
  -- Project details
  year VARCHAR(10),
  client VARCHAR(255),
  role VARCHAR(255),
  duration VARCHAR(100),
  challenge TEXT,
  solution TEXT,
  outcome TEXT,
  
  -- Status and ordering
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

CREATE INDEX idx_projects_active ON projects(is_active, display_order);
CREATE INDEX idx_projects_featured ON projects(is_featured, is_active);
CREATE INDEX idx_projects_category ON projects(category);

-- =============================================
-- 4. PROJECT METRICS TABLE (Related to projects)
-- =============================================
CREATE TABLE project_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  label VARCHAR(255) NOT NULL,
  value VARCHAR(100) NOT NULL,
  icon VARCHAR(50), -- Icon name from your icon library
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_project_metrics_project ON project_metrics(project_id, display_order);

-- =============================================
-- 5. PROJECT TECHNOLOGIES TABLE
-- =============================================
CREATE TABLE project_technologies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  technology_name VARCHAR(100) NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_project_tech_project ON project_technologies(project_id);

-- =============================================
-- 6. PROJECT GALLERY (Additional images for projects)
-- =============================================
CREATE TABLE project_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  caption TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_project_images_project ON project_images(project_id, display_order);

-- =============================================
-- 7. TESTIMONIALS TABLE
-- =============================================
CREATE TABLE testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_name VARCHAR(255) NOT NULL,
  author_title VARCHAR(255),
  company VARCHAR(255),
  avatar_url TEXT,
  quote TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_testimonials_active ON testimonials(is_active, display_order);

-- =============================================
-- 8. SITE SETTINGS TABLE (General content)
-- =============================================
CREATE TABLE site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  setting_key VARCHAR(100) UNIQUE NOT NULL,
  setting_value TEXT,
  setting_type VARCHAR(50) DEFAULT 'text', -- text, json, number, boolean
  description TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id)
);

-- Insert default settings
INSERT INTO site_settings (setting_key, setting_value, setting_type, description) VALUES
  ('site_title', 'EITO Group', 'text', 'Main site title'),
  ('hero_title', 'We Build Unforgettable Team Experiences', 'text', 'Hero section title'),
  ('hero_subtitle', 'For People, For Culture, For Growth', 'text', 'Hero section subtitle'),
  ('contact_email', 'info@eitogroup.com.my', 'text', 'Primary contact email'),
  ('contact_phone', '+1 (555) 987-6543', 'text', 'Primary contact phone');

-- =============================================
-- 9. MEDIA LIBRARY TABLE (Centralized image management)
-- =============================================
CREATE TABLE media_library (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  file_name VARCHAR(255) NOT NULL,
  file_url TEXT NOT NULL,
  file_type VARCHAR(50), -- image, video, document
  mime_type VARCHAR(100),
  file_size INTEGER, -- in bytes
  alt_text TEXT,
  caption TEXT,
  folder VARCHAR(100), -- hero, clients, projects, testimonials, etc.
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  uploaded_by UUID REFERENCES auth.users(id)
);

CREATE INDEX idx_media_library_folder ON media_library(folder);
CREATE INDEX idx_media_library_type ON media_library(file_type);

-- =============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================

-- Enable RLS on all tables
ALTER TABLE hero_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_logos ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_technologies ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_library ENABLE ROW LEVEL SECURITY;

-- Public read access for active content
CREATE POLICY "Public can view active hero images" ON hero_images FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view active client logos" ON client_logos FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view active projects" ON projects FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view project metrics" ON project_metrics FOR SELECT USING (true);
CREATE POLICY "Public can view project technologies" ON project_technologies FOR SELECT USING (true);
CREATE POLICY "Public can view project images" ON project_images FOR SELECT USING (true);
CREATE POLICY "Public can view active testimonials" ON testimonials FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view site settings" ON site_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public can view media" ON media_library FOR SELECT USING (true);

-- Authenticated users can do everything
CREATE POLICY "Authenticated users can manage hero images" ON hero_images FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage client logos" ON client_logos FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage projects" ON projects FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage project metrics" ON project_metrics FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage project technologies" ON project_technologies FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage project images" ON project_images FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage testimonials" ON testimonials FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage site settings" ON site_settings FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage media" ON media_library FOR ALL USING (auth.role() = 'authenticated');

-- =============================================
-- FUNCTIONS FOR AUTOMATIC UPDATED_AT
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers
CREATE TRIGGER update_hero_images_updated_at BEFORE UPDATE ON hero_images FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_client_logos_updated_at BEFORE UPDATE ON client_logos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_testimonials_updated_at BEFORE UPDATE ON testimonials FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON site_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- SAMPLE DATA FOR TESTING
-- =============================================

-- Sample Hero Images
INSERT INTO hero_images (title, image_url, alt_text, display_order, is_active) VALUES
  ('Team Building Event', '/Portfolio/events/teamwork.jpg', 'Team working together outdoors', 1, true),
  ('Corporate Workshop', '/Portfolio/events/training.jpg', 'Corporate training session', 2, true);

-- Sample Client Logos
INSERT INTO client_logos (company_name, logo_url, alt_text, display_order, is_active) VALUES
  ('Microsoft', '/Portfolio/customers/microsoft.png', 'Microsoft logo', 1, true),
  ('Google', '/Portfolio/customers/google.png', 'Google logo', 2, true);

-- Sample Project
INSERT INTO projects (slug, title, category, description, long_description, featured_image_url, image_alt, year, client, role, duration, challenge, solution, outcome, is_active, is_featured)
VALUES (
  'advelsoft-team-building',
  'Advelsoft Team Building',
  'Team Building',
  'Empowering teams to make a positive impact through community service and social responsibility projects.',
  'Our CSR programs engage teams in meaningful activities that benefit local communities, foster empathy, and build a sense of purpose. From volunteering to fundraising, we help organizations create lasting change together.',
  '/Portfolio/events/_JIN3517.jpg',
  'Team participating in a CSR event outdoors',
  '2025',
  'Advelsoft',
  'CSR Facilitator',
  'Increased employee engagement by 50% and raised $20,000 for local charities.',
  true,
  true
);

-- Add metrics for the sample project
INSERT INTO project_metrics (project_id, label, value, icon, display_order)
SELECT id, 'Engagement Increase', '50%', 'TrendingUp', 1 FROM projects WHERE slug = 'advelsoft-team-building'
UNION ALL
SELECT id, 'Funds Raised', '$20,000', 'Gift', 2 FROM projects WHERE slug = 'advelsoft-team-building';

-- Add technologies for the sample project
INSERT INTO project_technologies (project_id, technology_name, display_order)
SELECT id, 'Community Engagement', 1 FROM projects WHERE slug = 'advelsoft-team-building'
UNION ALL
SELECT id, 'Volunteering', 2 FROM projects WHERE slug = 'advelsoft-team-building'
UNION ALL
SELECT id, 'Fundraising', 3 FROM projects WHERE slug = 'advelsoft-team-building';
