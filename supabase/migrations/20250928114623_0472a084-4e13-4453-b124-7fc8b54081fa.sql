-- Add missing fields to profiles table for internship applications
ALTER TABLE public.profiles 
ADD COLUMN IF NOT exists email text,
ADD COLUMN IF NOT exists date_of_birth date,
ADD COLUMN IF NOT exists address text;

-- Add missing fields to student_profiles table
ALTER TABLE public.student_profiles 
ADD COLUMN IF NOT exists resume_url text,
ADD COLUMN IF NOT exists portfolio_url text,
ADD COLUMN IF NOT exists cover_letter text;