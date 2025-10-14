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
