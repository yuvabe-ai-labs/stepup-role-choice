-- Add missing fields to student_profiles table for Personal Details dialog
ALTER TABLE public.student_profiles 
ADD COLUMN IF NOT EXISTS headline TEXT,
ADD COLUMN IF NOT EXISTS marital_status TEXT,
ADD COLUMN IF NOT EXISTS is_differently_abled BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS has_career_break BOOLEAN DEFAULT false;