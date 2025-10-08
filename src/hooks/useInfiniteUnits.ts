import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

type Unit = Tables<'units'>;

interface Filters {
  units: string[];
  industries: string[];
  departments: string[];
  isAurovillian: boolean | null;
  postedDate: string;
  interestAreas: string[];
}

const ITEMS_PER_PAGE = 9;

export const useInfiniteUnits = (filters: Filters) => {
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);

  const fetchUnits = useCallback(async (pageNum: number, currentFilters: Filters) => {
    try {
      console.log('[useInfiniteUnits] Fetching page:', pageNum, 'with filters:', currentFilters);
      setLoading(true);

      let query = supabase
        .from('units')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(pageNum * ITEMS_PER_PAGE, (pageNum + 1) * ITEMS_PER_PAGE - 1);

      // Apply unit name filter
      if (currentFilters.units.length > 0) {
        query = query.in('unit_name', currentFilters.units);
      }

      // Apply industry filter
      if (currentFilters.industries.length > 0) {
        query = query.in('industry', currentFilters.industries);
      }

      // Apply Aurovillian filter
      if (currentFilters.isAurovillian !== null) {
        query = query.eq('is_aurovillian', currentFilters.isAurovillian);
      }

      // Apply posted date filter
      if (currentFilters.postedDate) {
        const now = new Date();
        let dateThreshold: Date;
        
        switch (currentFilters.postedDate) {
          case 'today':
            dateThreshold = new Date(now.setHours(0, 0, 0, 0));
            break;
          case 'week':
            dateThreshold = new Date(now.setDate(now.getDate() - 7));
            break;
          case 'month':
            dateThreshold = new Date(now.setMonth(now.getMonth() - 1));
            break;
          default:
            dateThreshold = new Date(0);
        }
        
        query = query.gte('created_at', dateThreshold.toISOString());
      }

      const { data, error, count } = await query;

      if (error) {
        console.error('[useInfiniteUnits] Error:', error);
        throw error;
      }

      console.log('[useInfiniteUnits] Fetched:', data?.length, 'units, total count:', count);

      if (pageNum === 0) {
        setUnits(data || []);
      } else {
        setUnits(prev => [...prev, ...(data || [])]);
      }

      setHasMore((data?.length || 0) === ITEMS_PER_PAGE && (count || 0) > (pageNum + 1) * ITEMS_PER_PAGE);
      setError(null);
    } catch (err) {
      console.error('[useInfiniteUnits] Fetch error:', err);
      setError('Failed to fetch units');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    console.log('[useInfiniteUnits] Filters changed, resetting...');
    setPage(0);
    setUnits([]);
    setHasMore(true);
    fetchUnits(0, filters);
  }, [filters, fetchUnits]);

  const loadMore = useCallback(() => {
    const nextPage = page + 1;
    console.log('[useInfiniteUnits] Loading more, next page:', nextPage);
    setPage(nextPage);
    fetchUnits(nextPage, filters);
  }, [page, filters, fetchUnits]);

  return { units, loading, error, hasMore, loadMore };
};
