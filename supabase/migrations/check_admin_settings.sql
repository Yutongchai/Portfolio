-- Check and fix site_settings table for admin authentication
-- Run this to diagnose/fix slow admin checks

-- 1. Check if site_settings table exists and has data
SELECT * FROM site_settings WHERE setting_key = 'admin_emails';

-- If the above returns no rows, insert a record with your admin email:
-- Replace 'your-email@example.com' with your actual admin email
INSERT INTO site_settings (setting_key, setting_value, description)
VALUES (
  'admin_emails',
  '["your-email@example.com"]',
  'List of admin email addresses with CMS access'
)
ON CONFLICT (setting_key) DO UPDATE
SET setting_value = EXCLUDED.setting_value;

-- 2. Check RLS policies on site_settings
SELECT * FROM pg_policies WHERE tablename = 'site_settings';

-- 3. Make sure the policy allows anon and authenticated to read
DROP POLICY IF EXISTS "Public can view site settings" ON site_settings;

CREATE POLICY "Public can view site settings"
ON site_settings
FOR SELECT
TO anon, authenticated
USING (true);

-- 4. Verify the policy is working
SELECT * FROM site_settings WHERE setting_key = 'admin_emails';
