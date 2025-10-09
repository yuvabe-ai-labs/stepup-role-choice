-- Allow units to view profiles of applicants to their internships
-- This policy grants SELECT on profiles when the current user owns the internship that the student applied to.

create policy "Units can view applicant profiles"
on public.profiles
for select
using (
  exists (
    select 1
    from public.applications a
    join public.internships i on i.id = a.internship_id
    join public.profiles up on up.id = i.created_by
    where a.student_id = profiles.id
      and up.user_id = auth.uid()
  )
);
