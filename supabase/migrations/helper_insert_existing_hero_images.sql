-- Helper SQL to insert existing hero images into the database
-- Run this in your Supabase SQL Editor AFTER running the storage migration

-- Insert existing hero images
-- Note: Replace '/Portfolio/' with the full public URL path after images are uploaded to Supabase Storage

INSERT INTO hero_images (title, image_url, alt_text, is_active) VALUES
  ('JIN3046', '/Portfolio/_JIN3046.jpg', 'Team building activity', true),
  ('Different', '/Portfolio/different.jpg', 'Diverse team collaboration', true),
  ('Collage', '/Portfolio/collage.jpg', 'Event collage', true),
  ('Main Picture', '/Portfolio/mainPic.jpg', 'Main team photo', true),
  ('Training', '/Portfolio/training.jpg', 'Training session', true),
  ('Discuss', '/Portfolio/discuss.jpg', 'Team discussion', true),
  ('Teamwork', '/Portfolio/teamwork.jpg', 'Teamwork outdoor activity', true);

-- Note: You can delete these records and upload new images via the admin panel
-- This is just to get started with existing images
