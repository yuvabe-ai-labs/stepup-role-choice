-- Add banner_url to student_profiles
ALTER TABLE student_profiles ADD COLUMN IF NOT EXISTS banner_url TEXT;

-- Add banner_url to units
ALTER TABLE units ADD COLUMN IF NOT EXISTS banner_url TEXT;

-- Create banners storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('banners', 'banners', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for banners bucket
CREATE POLICY "Users can upload their own banner"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'banners' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own banner"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'banners' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own banner"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'banners' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Banners are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'banners');

-- Update avatars bucket policies for units
CREATE POLICY "Units can upload avatars"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Units can update avatars"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Units can delete avatars"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);