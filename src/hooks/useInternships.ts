import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

type Internship = Tables<'internships'>;

export const useInternships = () => {
  const [internships, setInternships] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInternships = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('internships')
          .select('*')
          .eq('status', 'active')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setInternships(data || []);
      } catch (error) {
        console.error('Error fetching internships:', error);
        setError('Failed to fetch internships');
      } finally {
        setLoading(false);
      }
    };

    fetchInternships();
  }, []);

  return { internships, loading, error };
};