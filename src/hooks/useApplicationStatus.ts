import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export const useApplicationStatus = (internshipId: string) => {
  const [hasApplied, setHasApplied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const checkApplicationStatus = async () => {
      if (!user || !internshipId) {
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('applications')
          .select('id')
          .eq('student_id', user.id)
          .eq('internship_id', internshipId)
          .maybeSingle();

        if (error) throw error;
        setHasApplied(!!data);
      } catch (error) {
        console.error('Error checking application status:', error);
        setHasApplied(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkApplicationStatus();
  }, [user, internshipId]);

  const markAsApplied = () => {
    setHasApplied(true);
  };

  return { hasApplied, isLoading, markAsApplied };
};