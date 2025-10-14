/**
 * Calculate profile match score based on student skills vs internship requirements
 * Returns a percentage (0-100) indicating how well the student matches the internship
 */
export const calculateMatchScore = (
  studentSkills: any,
  internshipSkillsRequired: any
): number => {
  // Parse skills arrays to ensure they're arrays of strings
  const parseSkills = (skills: any): string[] => {
    if (!skills) return [];
    
    // If already an array
    if (Array.isArray(skills)) {
      return skills.map(skill => {
        if (typeof skill === 'string') return skill.toLowerCase().trim();
        if (typeof skill === 'object' && skill.name) return skill.name.toLowerCase().trim();
        if (typeof skill === 'object' && skill.title) return skill.title.toLowerCase().trim();
        return '';
      }).filter(Boolean);
    }
    
    // If it's a string, try to parse it
    if (typeof skills === 'string') {
      try {
        const parsed = JSON.parse(skills);
        return parseSkills(parsed);
      } catch {
        // If it's a comma-separated string
        return skills.split(',').map(s => s.toLowerCase().trim()).filter(Boolean);
      }
    }
    
    return [];
  };

  const studentSkillsNormalized = parseSkills(studentSkills);
  const internshipSkillsNormalized = parseSkills(internshipSkillsRequired);

  // If internship has no skills required, return 0 (can't match)
  if (internshipSkillsNormalized.length === 0) {
    return 0;
  }

  // If student has no skills, return 0
  if (studentSkillsNormalized.length === 0) {
    return 0;
  }

  // Calculate matching skills
  let matchCount = 0;
  const matchedSkills = new Set<string>();

  for (const studentSkill of studentSkillsNormalized) {
    for (const internshipSkill of internshipSkillsNormalized) {
      // Check for exact match or partial match (e.g., "web development" matches "web dev")
      if (
        studentSkill === internshipSkill ||
        studentSkill.includes(internshipSkill) ||
        internshipSkill.includes(studentSkill)
      ) {
        if (!matchedSkills.has(internshipSkill)) {
          matchCount++;
          matchedSkills.add(internshipSkill);
        }
      }
    }
  }

  // Calculate percentage based on internship requirements
  const matchPercentage = Math.round((matchCount / internshipSkillsNormalized.length) * 100);

  return Math.min(matchPercentage, 100); // Cap at 100%
};

// Comprehensive match score considering multiple profile and internship attributes
// Weights: skills 50%, languages 10%, location 10%, education 15%, experience 10%, courses 5%
export const calculateComprehensiveMatchScore = (
  student: any,
  internship: any
): number => {
  try {
    const toArray = (v: any): any[] => {
      if (!v) return [];
      if (Array.isArray(v)) return v;
      if (typeof v === 'string') {
        try { return JSON.parse(v); } catch { return v.split(','); }
      }
      if (typeof v === 'object') return [v];
      return [];
    };

    const extractStrings = (input: any): string[] => {
      return toArray(input)
        .map((item) => {
          if (typeof item === 'string') return item.toLowerCase().trim();
          if (typeof item === 'number') return String(item);
          if (typeof item === 'object' && item) {
            const keys = ['name','title','label','value','skill','degree','role','company','text'];
            for (const k of keys) {
              if (item[k]) return String(item[k]).toLowerCase().trim();
            }
            return Object.values(item).join(' ').toLowerCase().trim();
          }
          return '';
        })
        .filter(Boolean);
    };

    const uniq = (arr: string[]) => Array.from(new Set(arr));
    const overlapRatio = (a: string[], b: string[]) => {
      const setB = new Set(b);
      const common = a.filter((x) => setB.has(x));
      return b.length ? common.length / b.length : 0;
    };

    const textBlob = (...parts: any[]): string =>
      parts
        .flatMap((p) => extractStrings(p))
        .join(' ');

    // Extract student attributes
    const studentProfile = student?.studentProfile ?? student?.profile ?? student ?? {};
    const studentSkills = uniq(extractStrings(studentProfile?.skills));
    const studentLanguages = uniq(extractStrings(studentProfile?.languages));
    const studentCourses = uniq(extractStrings(studentProfile?.completed_courses));
    const studentEducation = uniq([
      ...extractStrings(studentProfile?.education),
      ...uniq((student?.education || []).map((e: any) => String(e?.degree || '').toLowerCase().trim()).filter(Boolean)),
    ]);
    const studentLocation = String(studentProfile?.location || student?.profile?.address || '').toLowerCase().trim();
    const hasExperience = Array.isArray(student?.internships) && student.internships.length > 0;

    // Extract internship attributes
    const internshipSkills = uniq(extractStrings(internship?.skills_required));
    const internshipLanguages = uniq(extractStrings(internship?.language_requirements));
    const internshipLocation = String(internship?.location || '').toLowerCase().trim();
    const reqText = textBlob(internship?.requirements, internship?.responsibilities, internship?.description, internship?.title);

    // Individual scores (0-1)
    const skillsScore = overlapRatio(studentSkills, internshipSkills);
    const languagesScore = overlapRatio(studentLanguages, internshipLanguages);

    let locationScore = 0;
    if (!internshipLocation || /remote|anywhere/i.test(internshipLocation)) {
      locationScore = 1;
    } else if (studentLocation) {
      const sl = studentLocation;
      const il = internshipLocation;
      locationScore = sl === il || sl.includes(il) || il.includes(sl) ? 1 : 0;
    }

    // Education score: does education contain keywords present in requirements text
    const eduMatches = studentEducation.filter((e) => reqText.includes(e)).length;
    const educationScore = studentEducation.length ? Math.min(1, eduMatches / Math.max(1, studentEducation.length)) : 0;

    // Experience score: simple presence-based for now
    const experienceScore = hasExperience ? 1 : 0;

    // Courses score: course keywords appearing in requirements/responsibilities
    const courseMatches = studentCourses.filter((c) => reqText.includes(c)).length;
    const coursesScore = studentCourses.length ? Math.min(1, courseMatches / Math.max(1, internshipSkills.length || 5)) : 0;

    // Weighted sum to percentage
    const percent = Math.round(
      100 * (
        0.5 * skillsScore +
        0.1 * languagesScore +
        0.1 * locationScore +
        0.15 * educationScore +
        0.1 * experienceScore +
        0.05 * coursesScore
      )
    );

    return Math.max(0, Math.min(100, percent));
  } catch (e) {
    console.error('calculateComprehensiveMatchScore error:', e);
    return 0;
  }
};
