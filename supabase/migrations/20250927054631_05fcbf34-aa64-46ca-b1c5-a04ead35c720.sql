-- Add missing fields to internships table for complete design support
ALTER TABLE public.internships 
ADD COLUMN benefits jsonb DEFAULT '[]'::jsonb,
ADD COLUMN company_logo text,
ADD COLUMN company_email text,
ADD COLUMN is_paid boolean DEFAULT false,
ADD COLUMN application_url text;

-- Update the table comment
COMMENT ON COLUMN public.internships.benefits IS 'Array of benefits offered to interns (What You Will Get section)';
COMMENT ON COLUMN public.internships.company_logo IS 'URL or path to company logo image';
COMMENT ON COLUMN public.internships.company_email IS 'Company contact email for internship inquiries';
COMMENT ON COLUMN public.internships.is_paid IS 'Whether the internship is paid or unpaid';
COMMENT ON COLUMN public.internships.application_url IS 'External URL for application if not handled internally';