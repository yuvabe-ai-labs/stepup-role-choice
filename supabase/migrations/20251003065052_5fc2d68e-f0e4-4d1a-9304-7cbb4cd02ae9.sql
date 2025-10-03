-- Fix RLS policies for applications table to use profile_id instead of auth.uid()

-- Drop existing policies
DROP POLICY IF EXISTS "Students can create applications" ON public.applications;
DROP POLICY IF EXISTS "Students can view their own applications" ON public.applications;
DROP POLICY IF EXISTS "Students can update their own applications" ON public.applications;

-- Create new policies that check via profiles table
CREATE POLICY "Students can create applications"
ON public.applications
FOR INSERT
WITH CHECK (
  student_id IN (
    SELECT id FROM public.profiles WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Students can view their own applications"
ON public.applications
FOR SELECT
USING (
  student_id IN (
    SELECT id FROM public.profiles WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Students can update their own applications"
ON public.applications
FOR UPDATE
USING (
  student_id IN (
    SELECT id FROM public.profiles WHERE user_id = auth.uid()
  )
);