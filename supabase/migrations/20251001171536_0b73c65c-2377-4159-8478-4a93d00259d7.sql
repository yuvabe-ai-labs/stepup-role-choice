-- Add missing fields to student_profiles for Candidate Profile page
ALTER TABLE public.student_profiles 
ADD COLUMN IF NOT EXISTS bio text,
ADD COLUMN IF NOT EXISTS location text,
ADD COLUMN IF NOT EXISTS achievements jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS linkedin_url text,
ADD COLUMN IF NOT EXISTS behance_url text,
ADD COLUMN IF NOT EXISTS dribbble_url text,
ADD COLUMN IF NOT EXISTS website_url text,
ADD COLUMN IF NOT EXISTS avatar_url text;

-- Add profile_match_score to applications table
ALTER TABLE public.applications
ADD COLUMN IF NOT EXISTS profile_match_score integer DEFAULT 0;

-- Add proficiency level to skills in student_profiles (we'll store skills as objects with name and level)
-- The skills field will be updated to store: [{"name": "Figma", "level": "Expert"}, ...]

-- Update RLS policies to ensure units can view full student profiles for their applications
-- This policy already exists but let's ensure it's comprehensive