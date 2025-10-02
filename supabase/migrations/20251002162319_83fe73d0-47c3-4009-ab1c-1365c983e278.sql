-- Add fields to profiles table for additional personal details
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS address text,
ADD COLUMN IF NOT EXISTS marital_status text,
ADD COLUMN IF NOT EXISTS differently_abled boolean DEFAULT false;

-- Add included_sections to applications table to store which sections were sent
ALTER TABLE public.applications
ADD COLUMN IF NOT EXISTS included_sections jsonb DEFAULT '["personal_details", "profile_summary", "courses", "key_skills", "education", "interests"]'::jsonb;