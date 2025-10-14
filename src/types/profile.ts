export interface DatabaseProfile {
  id: string;
  user_id: string;
  full_name: string;
  role: "student" | "unit";
  profile_type: string | null;
  created_at: string;
  updated_at: string;
  onboarding_completed: boolean | null;
  gender: string | null;
  phone: string | null;
  email: string | null;
  date_of_birth: string | null;
}

export interface StudentProfile {
  location: string;
  id: string;
  profile_id: string;
  created_at: string;
  updated_at: string;
  skills: any[] | null;
  education: any[] | null;
  projects: any[] | null;
  languages: any[] | null;
  completed_courses: any[] | null;
  interests: any[] | null;
  experience_level: string | null;
  looking_for: any[] | null;
  portfolio_url: string | null;
  resume_url: string | null;
  cover_letter: string | null;
  profile_type: string | null;
  preferred_language: string | null;
}

export interface EducationEntry {
  id: string;
  degree: string;
  institution: string;
  start_year: number;
  end_year: number | null;
  score: string | null;
  is_current: boolean;
}

export interface ProjectEntry {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  start_date: string;
  end_date: string | null;
  project_url: string | null;
  is_current: boolean;
}

export interface LanguageEntry {
  id: string;
  name: string;
  proficiency: number;
  read: number;
  write: number;
  speak: number;
}

export interface CourseEntry {
  id: string;
  title: string;
  provider: string;
  completion_date: string;
  certificate_url: string | null;
}

export interface InternshipEntry {
  id: string;
  title: string;
  company: string;
  start_date: string;
  end_date: string | null;
  description: string | null;
  is_current: boolean;
}
