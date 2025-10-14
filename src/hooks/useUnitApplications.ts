import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type Application = Tables<"applications">;
type Internship = Tables<"internships">;
type Profile = Tables<"profiles">;
type StudentProfile = Tables<"student_profiles">;

export interface ApplicationWithDetails extends Application {
  internship: Internship;
  profile: Profile;
  studentProfile: StudentProfile;
}

export const useUnitApplications = () => {
  const [applications, setApplications] = useState<ApplicationWithDetails[]>(
    []
  );
  const [stats, setStats] = useState({
    total: 0,
    totalJobs: 0,
    interviews: 0,
    hiredThisMonth: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        console.log("=== Fetching Unit Applications ===");

        // Get current user
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          console.error("No authenticated user found");
          throw new Error("Not authenticated");
        }
        console.log("Current user ID:", user.id);

        // Get profile ID for current user
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("id")
          .eq("user_id", user.id)
          .maybeSingle();

        if (profileError) {
          console.error("Error fetching profile:", profileError);
          throw profileError;
        }

        if (!profile) {
          console.error("No profile found for user:", user.id);
          throw new Error("Profile not found");
        }
        console.log("Profile ID:", profile.id);

        // Fetch all internships created by this unit (using profile ID)
        const { data: internships, error: internshipsError } = await supabase
          .from("internships")
          .select("id, title")
          .eq("created_by", profile.id);

        if (internshipsError) {
          console.error("Error fetching internships:", internshipsError);
          throw internshipsError;
        }

        console.log("Found internships:", internships?.length || 0);
        const internshipIds = internships?.map((i) => i.id) || [];

        if (internshipIds.length === 0) {
          console.log("No internships found for this unit");
          setApplications([]);
          setStats({
            total: 0,
            totalJobs: 0,
            interviews: 0,
            hiredThisMonth: 0,
          });
          setLoading(false);
          return;
        }
        console.log("Internship IDs:", internshipIds);

        // Fetch applications for these internships
        const { data: applicationsData, error: appsError } = await supabase
          .from("applications")
          .select("*")
          .in("internship_id", internshipIds)
          .order("applied_date", { ascending: false });

        if (appsError) {
          console.error("Error fetching applications:", appsError);
          throw appsError;
        }

        console.log("Found applications:", applicationsData?.length || 0);

        // Fetch related data for each application
        const applicationsWithDetails = await Promise.all(
          (applicationsData || []).map(async (app) => {
            const [internshipRes, profileRes, studentProfileRes] =
              await Promise.all([
                supabase
                  .from("internships")
                  .select("*")
                  .eq("id", app.internship_id)
                  .maybeSingle(),
                supabase
                  .from("profiles")
                  .select("*")
                  .eq("id", app.student_id)
                  .maybeSingle(),
                supabase
                  .from("student_profiles")
                  .select("*")
                  .eq("profile_id", app.student_id)
                  .maybeSingle(),
              ]);

            // Calculate match score if not already set
            let matchScore = app.profile_match_score;
            if (matchScore === null || matchScore === undefined || matchScore === 0) {
              const { calculateComprehensiveMatchScore } = await import("@/utils/matchScore");
              matchScore = calculateComprehensiveMatchScore(
                { studentProfile: studentProfileRes.data, profile: profileRes.data },
                internshipRes.data
              );

              // Update the application with the calculated score
              if (matchScore > 0) {
                await supabase
                  .from("applications")
                  .update({ profile_match_score: matchScore })
                  .eq("id", app.id);
              }
            }

            return {
              ...app,
              profile_match_score: matchScore,
              internship: internshipRes.data,
              profile: profileRes.data,
              studentProfile: studentProfileRes.data || {
                id: "",
                profile_id: app.student_id,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                skills: [],
                avatar_url: null,
                bio: null,
                location: null,
                portfolio_url: null,
                resume_url: null,
                behance_url: null,
                dribbble_url: null,
                linkedin_url: null,
                education: [],
                projects: [],
                languages: [],
                completed_courses: null,
                interests: [],
                experience_level: null,
                looking_for: [],
                profile_type: null,
                preferred_language: null,
                cover_letter: null,
              },
            };
          })
        );

        console.log("Total applications:", applicationsWithDetails.length);
        setApplications(applicationsWithDetails as ApplicationWithDetails[]);

        // Calculate stats
        const total = applicationsWithDetails.length;
        const totalJobs = internshipIds.length;
        const interviews = applicationsWithDetails.filter(
          (a) => a.status === "interviewed"
        ).length;

        // Get hired this month
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const hiredThisMonth = applicationsWithDetails.filter((a) => {
          if (a.status === "hired") {
            const appliedDate = new Date(a.applied_date);
            return (
              appliedDate.getMonth() === currentMonth &&
              appliedDate.getFullYear() === currentYear
            );
          }
          return false;
        }).length;

        const calculatedStats = {
          total,
          totalJobs,
          interviews,
          hiredThisMonth,
        };
        console.log("Stats:", calculatedStats);
        setStats(calculatedStats);
      } catch (error) {
        console.error("Error fetching applications:", error);
        setError("Failed to fetch applications");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  return { applications, stats, loading, error };
};
