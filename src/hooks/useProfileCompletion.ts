import { useMemo } from "react";

interface ProfileCompletionProps {
  profile: any;
  studentProfile: any;
}

export const useProfileCompletion = ({ profile, studentProfile }: ProfileCompletionProps) => {
  const completion = useMemo(() => {
    if (!profile || !studentProfile) return 0;

    const fields = [
      profile.full_name,
      profile.email,
      profile.phone,
      profile.date_of_birth,
      profile.gender,
      studentProfile.avatar_url,
      studentProfile.cover_letter,
      Array.isArray(studentProfile.skills) && studentProfile.skills.length > 0,
      Array.isArray(studentProfile.education) && studentProfile.education.length > 0,
      Array.isArray(studentProfile.projects) && studentProfile.projects.length > 0,
      Array.isArray(studentProfile.interests) && studentProfile.interests.length > 0,
      Array.isArray(studentProfile.languages) && studentProfile.languages.length > 0,
      Array.isArray(studentProfile.completed_courses) && studentProfile.completed_courses.length > 0,
    ];

    const filledFields = fields.filter(Boolean).length;
    return Math.round((filledFields / fields.length) * 100);
  }, [profile, studentProfile]);

  return completion;
};
