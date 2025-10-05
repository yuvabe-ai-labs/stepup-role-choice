-- Add language_requirements field to internships table
ALTER TABLE public.internships 
ADD COLUMN IF NOT EXISTS language_requirements jsonb DEFAULT '[]'::jsonb;