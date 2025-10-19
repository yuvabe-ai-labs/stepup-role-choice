-- Create saved_internships table
CREATE TABLE IF NOT EXISTS public.saved_internships (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id uuid NOT NULL,
  internship_id uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(student_id, internship_id)
);

-- Enable RLS
ALTER TABLE public.saved_internships ENABLE ROW LEVEL SECURITY;

-- Students can view their own saved internships
CREATE POLICY "Students can view their own saved internships"
ON public.saved_internships
FOR SELECT
USING (
  student_id IN (
    SELECT id FROM profiles WHERE user_id = auth.uid()
  )
);

-- Students can save internships
CREATE POLICY "Students can save internships"
ON public.saved_internships
FOR INSERT
WITH CHECK (
  student_id IN (
    SELECT id FROM profiles WHERE user_id = auth.uid()
  )
);

-- Students can delete their saved internships
CREATE POLICY "Students can delete their saved internships"
ON public.saved_internships
FOR DELETE
USING (
  student_id IN (
    SELECT id FROM profiles WHERE user_id = auth.uid()
  )
);

-- Units can view saved internships for their internships
CREATE POLICY "Units can view saved internships for their listings"
ON public.saved_internships
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM internships i
    WHERE i.id = saved_internships.internship_id
    AND i.created_by IN (
      SELECT id FROM profiles WHERE user_id = auth.uid()
    )
  )
);