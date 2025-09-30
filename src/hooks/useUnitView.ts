import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

type Unit = Tables<'units'>;
type Internship = Tables<'internships'>;

export const useUnitView = (unitId: string) => {
  const [unit, setUnit] = useState<Unit | null>(null);
  const [internships, setInternships] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUnitData = async () => {
      try {
        setLoading(true);
        
        // Fetch unit details
        const { data: unitData, error: unitError } = await supabase
          .from('units')
          .select('*')
          .eq('id', unitId)
          .maybeSingle();

        if (unitError) throw unitError;
        if (!unitData) {
          setError('Unit not found');
          return;
        }

        setUnit(unitData);

        // Fetch internships posted by this unit
        const { data: internshipsData, error: internshipsError } = await supabase
          .from('internships')
          .select('*')
          .eq('created_by', unitData.profile_id)
          .eq('status', 'active')
          .order('created_at', { ascending: false });

        if (internshipsError) throw internshipsError;
        setInternships(internshipsData || []);
      } catch (error) {
        console.error('Error fetching unit data:', error);
        setError('Failed to fetch unit data');
      } finally {
        setLoading(false);
      }
    };

    if (unitId) {
      fetchUnitData();
    }
  }, [unitId]);

  return { unit, internships, loading, error };
};
