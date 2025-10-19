import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

type Internship = Tables<'internships'>;

export const useAppliedInternships = () => {
  const [appliedInternships, setAppliedInternships] = useState<(Internship & { applied_at: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAppliedInternships = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!profile) throw new Error('Profile not found');

      const { data, error: fetchError } = await supabase
        .from('applications')
        .select('internship_id, applied_date')
        .eq('student_id', profile.id);

      if (fetchError) throw fetchError;

      if (!data || data.length === 0) {
        setAppliedInternships([]);
        return;
      }

      const internshipIds = data.map(item => item.internship_id);
      const { data: internships, error: internshipsError } = await supabase
        .from('internships')
        .select('*')
        .in('id', internshipIds);

      if (internshipsError) throw internshipsError;

      const internshipsWithAppliedDate = internships?.map(internship => {
        const appliedRecord = data.find(item => item.internship_id === internship.id);
        return {
          ...internship,
          applied_at: appliedRecord?.applied_date || internship.created_at
        };
      }) || [];

      setAppliedInternships(internshipsWithAppliedDate);
    } catch (err: any) {
      console.error('Error fetching applied internships:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppliedInternships();
  }, []);

  return { appliedInternships, loading, error, refetch: fetchAppliedInternships };
};
