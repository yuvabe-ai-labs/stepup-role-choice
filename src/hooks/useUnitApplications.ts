import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

type Application = Tables<'applications'>;
type Internship = Tables<'internships'>;
type Profile = Tables<'profiles'>;
type StudentProfile = Tables<'student_profiles'>;

export interface ApplicationWithDetails extends Application {
  internship: Internship;
  profile: Profile;
  studentProfile: StudentProfile;
}

export const useUnitApplications = () => {
  const [applications, setApplications] = useState<ApplicationWithDetails[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    shortlisted: 0,
    interviews: 0,
    hired: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);

        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        // Fetch all internships created by this unit
        const { data: internships, error: internshipsError } = await supabase
          .from('internships')
          .select('id')
          .eq('created_by', user.id);
z
        if (internshipsError) throw internshipsError;

        const internshipIds = internships?.map(i => i.id) || [];
        if (internshipIds.length === 0) {
          setApplications([]);
          setLoading(false);
          return;
        }

        // Fetch applications for these internships
        const { data: applicationsData, error: appsError } = await supabase
          .from('applications')
          .select('*')
          .in('internship_id', internshipIds)
          .order('applied_date', { ascending: false });

        if (appsError) throw appsError;

        // Fetch related data for each application
        const applicationsWithDetails = await Promise.all(
          (applicationsData || []).map(async (app) => {
            const [internshipRes, profileRes, studentProfileRes] = await Promise.all([
              supabase.from('internships').select('*').eq('id', app.internship_id).single(),
              supabase.from('profiles').select('*').eq('id', app.student_id).single(),
              supabase.from('student_profiles').select('*').eq('profile_id', app.student_id).single(),
            ]);

            return {
              ...app,
              internship: internshipRes.data!,
              profile: profileRes.data!,
              studentProfile: studentProfileRes.data!,
            };
          })
        );

        setApplications(applicationsWithDetails);

        // Calculate stats
        const total = applicationsWithDetails.length;
        const shortlisted = applicationsWithDetails.filter(a => a.status === 'shortlisted').length;
        const interviews = applicationsWithDetails.filter(a => a.status === 'interviewed').length;
        const hired = applicationsWithDetails.filter(a => a.status === 'hired').length;

        setStats({ total, shortlisted, interviews, hired });
      } catch (error) {
        console.error('Error fetching applications:', error);
        setError('Failed to fetch applications');
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  return { applications, stats, loading, error };
};
