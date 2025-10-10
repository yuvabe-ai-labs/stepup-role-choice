import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

type Internship = Tables<'internships'>;

interface InternshipFilters {
  units: string[];
  industries: string[];
  departments: string[];
  coursePeriod: { min: number; max: number };
  postingDate: { from?: string; to?: string };
  interestAreas: string[];
}

const PAGE_SIZE = 9; // 3 columns x 3 rows

export const useInfiniteInternships = (filters: InternshipFilters) => {
  const [internships, setInternships] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);

  console.log('[useInfiniteInternships] Filters:', filters);
  console.log('[useInfiniteInternships] Page:', page);

  const fetchInternships = async (pageNum: number) => {
    try {
      console.log('[useInfiniteInternships] Fetching page:', pageNum);
      setLoading(true);
      setError(null);

      let query = supabase
        .from('internships')
        .select('*')
        .eq('status', 'active');

      // Apply filters
      if (filters.units.length > 0) {
        query = query.in('company_name', filters.units);
      }

      if (filters.industries.length > 0) {
        query = query.in('location', filters.industries); // Using location as industry proxy
      }

      if (filters.departments.length > 0) {
        // Department filter - we'll use title/description search
        // Since there's no explicit department field, we can use contains on title
      }

      if (filters.postingDate.from) {
        query = query.gte('posted_date', filters.postingDate.from);
      }

      if (filters.postingDate.to) {
        query = query.lte('posted_date', filters.postingDate.to);
      }

      // Pagination
      const from = pageNum * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      const { data, error: fetchError, count } = await query
        .order('posted_date', { ascending: false })
        .range(from, to);

      if (fetchError) throw fetchError;

      console.log('[useInfiniteInternships] Fetched:', data?.length, 'internships');

      if (pageNum === 0) {
        setInternships(data || []);
      } else {
        setInternships((prev) => [...prev, ...(data || [])]);
      }

      setHasMore((data?.length || 0) === PAGE_SIZE);
    } catch (err: any) {
      console.error('[useInfiniteInternships] Error:', err);
      setError(err.message || 'Failed to fetch internships');
    } finally {
      setLoading(false);
    }
  };

  // Reset when filters change
  useEffect(() => {
    console.log('[useInfiniteInternships] Filters changed, resetting...');
    setPage(0);
    setInternships([]);
    setHasMore(true);
    fetchInternships(0);
  }, [
    filters.units.join(','),
    filters.industries.join(','),
    filters.departments.join(','),
    filters.coursePeriod.min,
    filters.coursePeriod.max,
    filters.postingDate.from,
    filters.postingDate.to,
    filters.interestAreas.join(','),
  ]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      console.log('[useInfiniteInternships] Loading more, page:', nextPage);
      setPage(nextPage);
      fetchInternships(nextPage);
    }
  }, [loading, hasMore, page]);

  return {
    internships,
    loading,
    error,
    hasMore,
    loadMore,
  };
};
