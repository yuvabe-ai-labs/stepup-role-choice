import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type Application = Tables<"applications">;
type Internship = Tables<"internships">;
type Profile = Tables<"profiles">;
type StudentProfile = Tables<"student_profiles">;
type StudentEducation = Tables<"student_education">;
type StudentInternship = Tables<"student_internships">;

export interface CandidateData {
  application: Application;
  internship: Internship;
  profile: Profile;
  studentProfile: StudentProfile;
  education: StudentEducation[];
  internships: StudentInternship[];
}

export const useCandidateProfile = (applicationId: string) => {
  const [data, setData] = useState<CandidateData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCandidateData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch application details
      const { data: application, error: appError } = await supabase
        .from("applications")
        .select("*")
        .eq("id", applicationId)
        .single();

      if (appError) throw appError;
      if (!application) {
        setError("Application not found");
        return;
      }

      // Fetch internship details
      const { data: internship, error: internshipError } = await supabase
        .from("internships")
        .select("*")
        .eq("id", application.internship_id)
        .single();

      if (internshipError) throw internshipError;

      // Fetch student profile
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", application.student_id)
        .single();

      if (profileError) throw profileError;

      // Fetch student details
      const { data: studentProfile, error: studentProfileError } =
        await supabase
          .from("student_profiles")
          .select("*")
          .eq("profile_id", application.student_id)
          .single();

      if (studentProfileError) throw studentProfileError;

      // Fetch education records
      const { data: education, error: educationError } = await supabase
        .from("student_education")
        .select("*")
        .eq("profile_id", application.student_id)
        .order("end_year", { ascending: false });

      if (educationError) throw educationError;

      // Fetch internship history
      const { data: internships, error: internshipsError } = await supabase
        .from("student_internships")
        .select("*")
        .eq("profile_id", application.student_id)
        .order("end_date", { ascending: false });

      if (internshipsError) throw internshipsError;

      setData({
        application,
        internship,
        profile,
        studentProfile,
        education: education || [],
        internships: internships || [],
      });
    } catch (error) {
      console.error("Error fetching candidate data:", error);
      setError("Failed to fetch candidate data");
    } finally {
      setLoading(false);
    }
  }, [applicationId]);

  useEffect(() => {
    if (applicationId) {
      fetchCandidateData();
    }
  }, [applicationId, fetchCandidateData]);

  return { data, loading, error, refetch: fetchCandidateData };
};
