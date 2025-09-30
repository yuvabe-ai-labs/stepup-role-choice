-- Add missing fields to units table for Unit View page
ALTER TABLE public.units 
ADD COLUMN IF NOT EXISTS website_url text,
ADD COLUMN IF NOT EXISTS mission text,
ADD COLUMN IF NOT EXISTS values jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS recent_projects jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS description text;

-- Add description to internships if not exists
ALTER TABLE public.internships
ADD COLUMN IF NOT EXISTS company_description text;