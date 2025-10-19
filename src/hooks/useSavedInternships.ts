import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

type Internship = Tables<'internships'>;

export const useSavedInternships = () => {
  const [savedInternships, setSavedInternships] = useState<(Internship & { saved_at: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSavedInternships = async () => {
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
        .from('saved_internships')
        .select('internship_id, created_at')
        .eq('student_id', profile.id);

      if (fetchError) throw fetchError;

      if (!data || data.length === 0) {
        setSavedInternships([]);
        return;
      }

      const internshipIds = data.map(item => item.internship_id);
      const { data: internships, error: internshipsError } = await supabase
        .from('internships')
        .select('*')
        .in('id', internshipIds);

      if (internshipsError) throw internshipsError;

      const internshipsWithSavedDate = internships?.map(internship => {
        const savedRecord = data.find(item => item.internship_id === internship.id);
        return {
          ...internship,
          saved_at: savedRecord?.created_at || internship.created_at
        };
      }) || [];

      setSavedInternships(internshipsWithSavedDate);
    } catch (err: any) {
      console.error('Error fetching saved internships:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedInternships();
  }, []);

  return { savedInternships, loading, error, refetch: fetchSavedInternships };
};

export const useIsSaved = (internshipId: string) => {
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkSaved = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsSaved(false);
        setLoading(false);
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!profile) {
        setIsSaved(false);
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from('saved_internships')
        .select('id')
        .eq('student_id', profile.id)
        .eq('internship_id', internshipId)
        .maybeSingle();

      setIsSaved(!!data);
    } catch (error) {
      console.error('Error checking saved status:', error);
      setIsSaved(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (internshipId) {
      checkSaved();
    }
  }, [internshipId]);

  return { isSaved, isLoading: loading, refetch: checkSaved };
};
