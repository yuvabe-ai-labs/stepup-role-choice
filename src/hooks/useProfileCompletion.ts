import { useMemo } from 'react';

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
      studentProfile.skills && JSON.parse(studentProfile.skills || '[]').length > 0,
      studentProfile.education && JSON.parse(studentProfile.education || '[]').length > 0,
      studentProfile.projects && JSON.parse(studentProfile.projects || '[]').length > 0,
      studentProfile.interests && JSON.parse(studentProfile.interests || '[]').length > 0,
      studentProfile.languages && JSON.parse(studentProfile.languages || '[]').length > 0,
      studentProfile.completed_courses && JSON.parse(studentProfile.completed_courses || '[]').length > 0,
    ];

    const filledFields = fields.filter(Boolean).length;
    return Math.round((filledFields / fields.length) * 100);
  }, [profile, studentProfile]);

  return completion;
};
