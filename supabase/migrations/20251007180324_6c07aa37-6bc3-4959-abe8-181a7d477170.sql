-- Fix the units INSERT policy to properly check profile_id through profiles table
DROP POLICY IF EXISTS "Units can create their own profile" ON units;

CREATE POLICY "Units can create their own profile"
ON units
FOR INSERT
TO authenticated
WITH CHECK (
  profile_id IN (
    SELECT id FROM profiles WHERE user_id = auth.uid()
  )
);