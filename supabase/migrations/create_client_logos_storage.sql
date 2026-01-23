-- Create storage bucket for client logos
INSERT INTO storage.buckets (id, name, public)
VALUES ('client-logos', 'client-logos', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Public can view client logos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload client logos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update client logos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete client logos" ON storage.objects;

-- Create policies for client-logos bucket
CREATE POLICY "Public can view client logos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'client-logos');

CREATE POLICY "Authenticated users can upload client logos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'client-logos');

CREATE POLICY "Authenticated users can update client logos"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'client-logos')
WITH CHECK (bucket_id = 'client-logos');

CREATE POLICY "Authenticated users can delete client logos"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'client-logos');
