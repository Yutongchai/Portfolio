-- Create storage bucket for hero images
INSERT INTO storage.buckets (id, name, public) VALUES ('hero-images', 'hero-images', true);

-- Allow public access to read hero images
CREATE POLICY "Public can view hero images" ON storage.objects FOR SELECT USING (bucket_id = 'hero-images');

-- Allow authenticated users to upload hero images
CREATE POLICY "Authenticated users can upload hero images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'hero-images' AND auth.role() = 'authenticated');

-- Allow authenticated users to update hero images
CREATE POLICY "Authenticated users can update hero images" ON storage.objects FOR UPDATE USING (bucket_id = 'hero-images' AND auth.role() = 'authenticated');

-- Allow authenticated users to delete hero images
CREATE POLICY "Authenticated users can delete hero images" ON storage.objects FOR DELETE USING (bucket_id = 'hero-images' AND auth.role() = 'authenticated');
