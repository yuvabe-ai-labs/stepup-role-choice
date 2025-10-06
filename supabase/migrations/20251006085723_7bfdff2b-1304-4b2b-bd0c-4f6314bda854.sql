-- Drop the existing RLS policy that incorrectly checks auth.uid() against profile ID
DROP POLICY IF EXISTS "Units can manage their own internships" ON public.internships;

-- Create corrected RLS policy that properly joins with profiles table
CREATE POLICY "Units can manage their own internships" 
ON public.internships 
FOR ALL 
USING (
  created_by IN (
    SELECT id FROM public.profiles WHERE user_id = auth.uid()
  )
);

-- Update the policy for viewing active internships (this one is fine but recreating for consistency)
DROP POLICY IF EXISTS "Everyone can view active internships" ON public.internships;

CREATE POLICY "Everyone can view active internships" 
ON public.internships 
FOR SELECT 
USING (status = 'active'::internship_status);