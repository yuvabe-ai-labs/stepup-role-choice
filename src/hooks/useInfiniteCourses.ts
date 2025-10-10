import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

type Course = Tables<'courses'>;

interface Filters {
  difficulty: string[];
  duration: string[];
  postedDate: string;
}

const ITEMS_PER_PAGE = 9;

export const useInfiniteCourses = (filters: Filters) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);

  const fetchCourses = useCallback(async (pageNum: number, currentFilters: Filters) => {
    try {
      console.log('[useInfiniteCourses] Fetching page:', pageNum, 'with filters:', currentFilters);
      setLoading(true);

      let query = supabase
        .from('courses')
        .select('*', { count: 'exact' })
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .range(pageNum * ITEMS_PER_PAGE, (pageNum + 1) * ITEMS_PER_PAGE - 1);

      // Apply difficulty filter
      if (currentFilters.difficulty.length > 0) {
        query = query.in('difficulty_level', currentFilters.difficulty);
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
        console.error('[useInfiniteCourses] Error:', error);
        throw error;
      }

      console.log('[useInfiniteCourses] Fetched:', data?.length, 'courses, total count:', count);

      if (pageNum === 0) {
        setCourses(data || []);
      } else {
        setCourses(prev => [...prev, ...(data || [])]);
      }

      setHasMore((data?.length || 0) === ITEMS_PER_PAGE && (count || 0) > (pageNum + 1) * ITEMS_PER_PAGE);
      setError(null);
    } catch (err) {
      console.error('[useInfiniteCourses] Fetch error:', err);
      setError('Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    console.log('[useInfiniteCourses] Filters changed, resetting...');
    setPage(0);
    setCourses([]);
    setHasMore(true);
    fetchCourses(0, filters);
  }, [filters, fetchCourses]);

  const loadMore = useCallback(() => {
    const nextPage = page + 1;
    console.log('[useInfiniteCourses] Loading more, next page:', nextPage);
    setPage(nextPage);
    fetchCourses(nextPage, filters);
  }, [page, filters, fetchCourses]);

  return { courses, loading, error, hasMore, loadMore };
};
