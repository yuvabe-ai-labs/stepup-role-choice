import { useMemo } from 'react';
import type { Tables } from '@/integrations/supabase/types';

type Internship = Tables<'internships'>;
type Course = Tables<'courses'>;

interface InternshipWithScore extends Internship {
  matchScore: number;
  matchPercentage: number;
}

interface CourseWithScore extends Course {
  matchScore: number;
}

export const useInternshipRecommendations = (
  internships: Internship[],
  userSkills: string[]
): InternshipWithScore[] => {
  return useMemo(() => {
    if (!userSkills || userSkills.length === 0) {
      return internships.slice(0, 6).map(i => ({
        ...i,
        matchScore: 0,
        matchPercentage: 0,
      }));
    }

    const normalizedUserSkills = userSkills.map(s => s.toLowerCase().trim());

    const scored = internships.map(internship => {
      let skillsRequired: any[] = [];
      
      try {
        if (typeof internship.skills_required === 'string') {
          skillsRequired = JSON.parse(internship.skills_required);
        } else if (internship.skills_required && typeof internship.skills_required === 'object') {
          skillsRequired = Array.isArray(internship.skills_required) ? internship.skills_required : [];
        }
      } catch {
        skillsRequired = [];
      }

      const normalizedRequired = skillsRequired
        .filter((s): s is string => typeof s === 'string')
        .map(s => s.toLowerCase().trim());

      const matchCount = normalizedUserSkills.filter(userSkill =>
        normalizedRequired.some(reqSkill => 
          reqSkill.includes(userSkill) || userSkill.includes(reqSkill)
        )
      ).length;

      const matchPercentage = normalizedRequired.length > 0
        ? (matchCount / normalizedRequired.length) * 100
        : 0;

      return {
        ...internship,
        matchScore: matchCount,
        matchPercentage,
      };
    });

    return scored
      .sort((a, b) => {
        if (b.matchScore !== a.matchScore) {
          return b.matchScore - a.matchScore;
        }
        return b.matchPercentage - a.matchPercentage;
      })
      .slice(0, 6);
  }, [internships, userSkills]);
};

export const useCourseRecommendations = (
  courses: Course[],
  userSkills: string[]
): CourseWithScore[] => {
  return useMemo(() => {
    if (!userSkills || userSkills.length === 0) {
      return courses.slice(0, 6).map(c => ({
        ...c,
        matchScore: 0,
      }));
    }

    const normalizedUserSkills = userSkills.map(s => s.toLowerCase().trim());

    const scored = courses.map(course => {
      const category = course.category?.toLowerCase() || '';
      const title = course.title?.toLowerCase() || '';
      
      const matchCount = normalizedUserSkills.filter(userSkill =>
        category.includes(userSkill) || 
        title.includes(userSkill) ||
        userSkill.includes(category)
      ).length;

      return {
        ...course,
        matchScore: matchCount,
      };
    });

    return scored
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 6);
  }, [courses, userSkills]);
};
