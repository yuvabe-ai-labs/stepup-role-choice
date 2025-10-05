-- Fix RLS policies for applications table to work with profile IDs

-- Drop existing policies that use auth.uid() incorrectly
DROP POLICY IF EXISTS "Units can view applications to their internships" ON applications;
DROP POLICY IF EXISTS "Units can update applications to their internships" ON applications;

-- Create corrected policies that properly map user_id to profile_id
CREATE POLICY "Units can view applications to their internships" 
ON applications 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 
    FROM internships i
    INNER JOIN profiles p ON i.created_by = p.id
    WHERE i.id = applications.internship_id 
    AND p.user_id = auth.uid()
  )
);

CREATE POLICY "Units can update applications to their internships" 
ON applications 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 
    FROM internships i
    INNER JOIN profiles p ON i.created_by = p.id
    WHERE i.id = applications.internship_id 
    AND p.user_id = auth.uid()
  )
);