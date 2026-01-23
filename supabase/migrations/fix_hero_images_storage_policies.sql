-- Fix storage policies for hero-images bucket
-- Run this if uploads are not working

-- First, drop existing policies if any
DROP POLICY IF EXISTS "Public can view hero images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload hero images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update hero images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete hero images" ON storage.objects;

-- Create new policies with correct bucket filter
CREATE POLICY "Public can view hero images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'hero-images');

CREATE POLICY "Authenticated users can upload hero images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'hero-images');

CREATE POLICY "Authenticated users can update hero images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'hero-images')
WITH CHECK (bucket_id = 'hero-images');

CREATE POLICY "Authenticated users can delete hero images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'hero-images');

-- Make sure the bucket is public
UPDATE storage.buckets 
SET public = true 
WHERE id = 'hero-images';
