-- Add RLS policies for student_education table
CREATE POLICY "Users can manage their own education records"
ON public.student_education
FOR ALL
USING (profile_id IN (
  SELECT id FROM profiles WHERE user_id = auth.uid()
))
WITH CHECK (profile_id IN (
  SELECT id FROM profiles WHERE user_id = auth.uid()
));

CREATE POLICY "Units can view education of applicants"
ON public.student_education
FOR SELECT
USING (profile_id IN (
  SELECT a.student_id 
  FROM applications a
  JOIN internships i ON i.id = a.internship_id
  WHERE i.created_by = auth.uid()
));

-- Add RLS policies for student_internships table
CREATE POLICY "Users can manage their own internship records"
ON public.student_internships
FOR ALL
USING (profile_id IN (
  SELECT id FROM profiles WHERE user_id = auth.uid()
))
WITH CHECK (profile_id IN (
  SELECT id FROM profiles WHERE user_id = auth.uid()
));

CREATE POLICY "Units can view internships of applicants"
ON public.student_internships
FOR SELECT
USING (profile_id IN (
  SELECT a.student_id 
  FROM applications a
  JOIN internships i ON i.id = a.internship_id
  WHERE i.created_by = auth.uid()
));