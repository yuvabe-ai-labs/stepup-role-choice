import React, { useState, useEffect, useMemo } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Send, Mail, Phone, MapPin, TriangleAlert } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

interface ProfileSummaryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  internship: Tables<"internships">;
  onSuccess: () => void;
}

interface CompleteProfileData {
  profile: any;
  studentProfile: any;
  // education: any[];
}

const ProfileSummaryDialog: React.FC<ProfileSummaryDialogProps> = ({
  isOpen,
  onClose,
  internship,
  onSuccess,
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profileData, setProfileData] = useState<CompleteProfileData | null>(
    null
  );

  // Checkbox states - first 6 are disabled and checked, last 2 are optional
  const [sections, setSections] = useState({
    personal_details: true,
    profile_summary: true,
    courses: true,
    key_skills: true,
    education: true,
    interests: true,
    projects: false,
    internship: false,
  });

  // Fetch complete profile data
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user || !isOpen) return;

      setIsLoading(true);
      try {
        // Fetch basic profile data
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (profileError) throw profileError;

        // Fetch student profile data
        const { data: studentProfile, error: studentError } = await supabase
          .from("student_profiles")
          .select("*")
          .eq("profile_id", profile.id)
          .maybeSingle();

        if (studentError && studentError.code !== "PGRST116")
          throw studentError;

        // Fetch education records
        // const { data: education, error: educationError } = await supabase
        //   .from("student_education")
        //   .select("*")
        //   .eq("profile_id", profile.id)
        //   .order("end_year", { ascending: false });

        // if (educationError) throw educationError;

        setProfileData({
          profile,
          studentProfile: studentProfile || {},
          // education: education || [],
        });
      } catch (error) {
        console.error("Error fetching profile data:", error);
        toast({
          title: "Error",
          description: "Failed to load your profile data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [user, isOpen, toast]);

  const handleSubmit = async () => {
    if (!user || !profileData) return;

    setIsSubmitting(true);
    try {
      // Get included sections
      const includedSections = Object.entries(sections)
        .filter(([_, checked]) => checked)
        .map(([section]) => section);

      // Calculate match score (comprehensive)
      const { calculateComprehensiveMatchScore } = await import(
        "@/utils/matchScore"
      );
      const matchScore = calculateComprehensiveMatchScore(
        {
          studentProfile: profileData.studentProfile,
          // education: profileData.education,
          internships: internships,
          profile: profileData.profile,
        },
        internship
      );
      console.log("Match score calculated (comprehensive):", matchScore);

      // Create application record
      const applicationData = {
        student_id: profileData.profile.id, // Use profile.id, not auth user.id
        internship_id: internship.id,
        status: "applied" as const,
        cover_letter: profileData.studentProfile?.cover_letter || "",
        included_sections: includedSections,
        profile_match_score: matchScore,
      };

      const { error } = await supabase
        .from("applications")
        .insert(applicationData);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your application has been submitted successfully!",
      });

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error submitting application:", error);
      toast({
        title: "Error",
        description: "Failed to submit your application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Not provided";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const parseJsonField = (field: any, defaultValue: any = []) => {
    if (!field) return defaultValue;
    if (typeof field === "string") {
      try {
        return JSON.parse(field);
      } catch {
        return defaultValue;
      }
    }
    return Array.isArray(field) ? field : defaultValue;
  };

  const skills = parseJsonField(profileData?.studentProfile?.skills, []);
  const education = parseJsonField(profileData?.studentProfile?.education, []);
  const courses = parseJsonField(
    profileData?.studentProfile?.completed_courses,
    []
  );
  const interests = parseJsonField(profileData?.studentProfile?.interests, []);
  const projects = parseJsonField(profileData?.studentProfile?.projects, []);
  const internships = parseJsonField(
    profileData?.studentProfile?.internships,
    []
  );

  // Validation: Check if sections are complete
  const sectionValidation = useMemo(() => {
    if (!profileData) return {};

    return {
      personal_details: !!(
        profileData.profile.full_name &&
        profileData.profile.email &&
        profileData.profile.phone &&
        profileData.profile.date_of_birth
      ),
      profile_summary: !!(
        profileData.studentProfile?.cover_letter &&
        profileData.studentProfile.cover_letter.length >= 10
      ),
      courses: courses.length > 0,
      key_skills: skills.length > 0,
      education: education.length > 0,
      interests: interests.length > 0,
      projects: projects.length > 0,
      internship: internships.length > 0,
    };
  }, [
    profileData,
    skills,
    courses,
    interests,
    projects,
    internships,
    education,
  ]);

  // Check if required sections are complete
  const canSubmit = useMemo(() => {
    return (
      sectionValidation.personal_details &&
      sectionValidation.profile_summary &&
      sectionValidation.courses &&
      sectionValidation.key_skills &&
      sectionValidation.education &&
      sectionValidation.interests
    );
  }, [sectionValidation]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="p-0 pl-[30px] max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-white pl-0 px-8 py-6  border-gray-200 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-900">
            Send Your Profile to the Unit
          </h2>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || isLoading || !profileData || !canSubmit}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            title={
              !canSubmit
                ? "Please complete all required sections to submit"
                : ""
            }
          >
            <Send className="h-8" />
            {isSubmitting ? "Sending..." : "Send Profile"}
          </Button>
        </div>

        {/* Content */}
        <div className="flex h-[calc(90vh-100px)]">
          {/* Left Sidebar - Checkboxes */}
          <div className="w-80 bg-white rounded-[20px] border border-gray-200 p-[30px]">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={sections.personal_details}
                  disabled
                  className="data-[state=checked]:bg-gray-400 data-[state=checked]:border-gray-400"
                />
                <span className="text-gray-700 font-medium flex w-full justify-between items-center gap-2">
                  Personal Details
                  {!sectionValidation.personal_details && (
                    <span title="Please update Personal Details before sending">
                      <TriangleAlert className="h-4 w-4 text-red-500" />
                    </span>
                  )}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={sections.profile_summary}
                  disabled
                  className="data-[state=checked]:bg-gray-400 data-[state=checked]:border-gray-400"
                />
                <span className="text-gray-700 font-medium flex w-full justify-between items-center gap-2">
                  Profile Summary
                  {!sectionValidation.profile_summary && (
                    <span title="Please update Profile Summary before sending">
                      <TriangleAlert className="h-4 w-4 text-red-500" />
                    </span>
                  )}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={sections.courses}
                  disabled
                  className="data-[state=checked]:bg-gray-400 data-[state=checked]:border-gray-400"
                />
                <span className="text-gray-700 font-medium flex w-full justify-between items-center gap-2">
                  Courses
                  {!sectionValidation.courses && (
                    <span title="Please update Courses before sending">
                      <TriangleAlert className="h-4 w-4 text-red-500" />
                    </span>
                  )}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={sections.key_skills}
                  disabled
                  className="data-[state=checked]:bg-gray-400 data-[state=checked]:border-gray-400"
                />
                <span className="text-gray-700 font-medium flex w-full justify-between items-center gap-2">
                  Key Skills
                  {!sectionValidation.key_skills && (
                    <span title="Please update Key Skills before sending">
                      <TriangleAlert className="h-4 w-4 text-red-500" />
                    </span>
                  )}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={sections.education}
                  disabled
                  className="data-[state=checked]:bg-gray-400 data-[state=checked]:border-gray-400"
                />
                <span className="text-gray-700 font-medium flex w-full justify-between items-center gap-2">
                  Education
                  {!sectionValidation.education && (
                    <span title="Please update Education before sending">
                      <TriangleAlert className="h-4 w-4 text-red-500" />
                    </span>
                  )}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={sections.interests}
                  disabled
                  className="data-[state=checked]:bg-gray-400 data-[state=checked]:border-gray-400"
                />
                <span className="text-gray-700 font-medium flex w-full justify-between items-center gap-2">
                  Interests
                  {!sectionValidation.interests && (
                    <span title="Please update Interests before sending">
                      <TriangleAlert className="h-4 w-4 text-red-500" />
                    </span>
                  )}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={sections.projects}
                  onCheckedChange={(checked) =>
                    setSections((prev) => ({
                      ...prev,
                      projects: checked === true,
                    }))
                  }
                />
                <span className="text-gray-700 font-medium flex w-full justify-between items-center gap-2">
                  Projects
                  {!sectionValidation.projects && (
                    <span title="Please update Projects before sending">
                      <TriangleAlert className="h-4 w-4 text-red-500" />
                    </span>
                  )}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={sections.internship}
                  onCheckedChange={(checked) =>
                    setSections((prev) => ({
                      ...prev,
                      internship: checked === true,
                    }))
                  }
                />
                <span className="text-gray-700 font-medium flex w-full justify-between items-center gap-2">
                  Internship
                  {!sectionValidation.internship && (
                    <span title="Please update Internship before sending">
                      <TriangleAlert className="h-4 w-4 text-red-500" />
                    </span>
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Right Content - Profile Preview */}
          <ScrollArea className="flex-1">
            <div className="p-8 pt-0 pl-2.5 space-y-2.5">
              {isLoading ? (
                <div className="space-y-4">
                  <div className="animate-pulse bg-gray-200 h-8 rounded w-3/4"></div>
                  <div className="animate-pulse bg-gray-200 h-24 rounded"></div>
                  <div className="animate-pulse bg-gray-200 h-24 rounded"></div>
                </div>
              ) : profileData ? (
                <>
                  {/* Header Card */}
                  <div className="bg-white rounded-[20px] p-[20px] shadow-sm border border-gray-200">
                    <div className="flex items-start gap-4">
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                        {profileData.profile.full_name
                          ?.charAt(0)
                          ?.toUpperCase() || "U"}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-900 mb-1">
                          {profileData.profile.full_name || "Not provided"}
                        </h3>
                        {/* <p className="text-gray-600 mb-3">
                          {profileData.studentProfile?.bio?.map(
                            (v) => `${v} ${profileData.studentProfile?.bio[-1] !== v ? "|" : ""} `,
                          ) || "No bio available"}
                        </p> */}
                        <p className="text-gray-600 mb-3">
                          {profileData.studentProfile?.headline ||
                            "No bio available"}
                        </p>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Mail className="w-4 h-4" />
                            {profileData.profile.email || "Not provided"}
                          </div>
                          <div className="flex items-center gap-1">
                            <Phone className="w-4 h-4" />
                            {profileData.profile.phone || "Not provided"}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {profileData.studentProfile?.location ||
                              profileData.profile.address ||
                              "Not provided"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Personal Details */}
                  {sections.personal_details && (
                    <div className="bg-white rounded-[20px] p-6 shadow-sm border border-gray-200">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">
                        Personal Details
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Personal</p>
                          <p className="text-gray-900">
                            {profileData.profile.gender || "Not specified"},{" "}
                            {profileData.profile.marital_status ||
                              "Single/ Unmarried"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">
                            Graduated
                          </p>
                          <p className="text-gray-900">
                            {profileData.studentProfile.education?.some(
                              (edu: any) => !edu.end_year
                            )
                              ? "No"
                              : "Yes"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">
                            Date Of Birth
                          </p>
                          <p className="text-gray-900">
                            {formatDate(profileData.profile.date_of_birth)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">
                            Differently Abled
                          </p>
                          <p className="text-gray-900">
                            {profileData.profile.differently_abled
                              ? "Yes"
                              : "No"}
                          </p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-sm text-gray-500 mb-1">Address</p>
                          <p className="text-gray-900">
                            {profileData.profile.address || "Not provided"}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Profile Summary */}
                  {sections.profile_summary && (
                    <div className="bg-white rounded-[20px] p-6 shadow-sm border border-gray-200">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">
                        Profile Summary
                      </h3>
                      <p className="text-gray-700 leading-relaxed">
                        {profileData.studentProfile?.cover_letter ||
                          "No profile summary available"}
                      </p>
                    </div>
                  )}

                  {/* Courses */}
                  {sections.courses && courses.length > 0 && (
                    <div className="bg-white rounded-[20px] p-6 shadow-sm border border-gray-200">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">
                        Courses
                      </h3>
                      <div className="space-y-3">
                        {courses.map((course: any, index: number) => (
                          <div
                            key={index}
                            className="border-l-4 border-blue-500 pl-4"
                          >
                            <h4 className="font-semibold text-gray-900">
                              {course.title || course.name}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {course.provider || "Provider not specified"}
                            </p>
                            {course.completion_date && (
                              <p className="text-xs text-gray-500">
                                Completed: {formatDate(course.completion_date)}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Key Skills */}
                  {sections.key_skills && skills.length > 0 && (
                    <div className="bg-white rounded-[20px] p-6 shadow-sm border border-gray-200">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">
                        Key Skills
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {skills.map((skill: any, index: number) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                          >
                            {typeof skill === "string"
                              ? skill
                              : skill.name || skill.title}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Education */}
                  {sections.education && education.length > 0 && (
                    <div className="bg-white rounded-[20px] p-6 shadow-sm border border-gray-200">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">
                        Education
                      </h3>
                      <div className="space-y-4">
                        {education.map((edu: any) => (
                          <div
                            key={edu.id}
                            className="border-l-4 border-green-500 pl-4"
                          >
                            <h4 className="font-semibold text-gray-900">
                              {edu.degree}
                            </h4>
                            <p className="text-gray-700">{edu.institution}</p>
                            <p className="text-sm text-gray-600">
                              {edu.start_year} - {edu.end_year || "Present"}
                              {edu.score && ` • ${edu.score}`}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Interests */}
                  {sections.interests && interests.length > 0 && (
                    <div className="bg-white rounded-[20px] p-6 shadow-sm border border-gray-200">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">
                        Interests
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {interests.map((interest: string, index: number) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                          >
                            {interest}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Projects */}
                  {sections.projects && projects.length > 0 && (
                    <div className="bg-white rounded-[20px] p-6 shadow-sm border border-gray-200">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">
                        Projects
                      </h3>
                      <div className="space-y-4">
                        {projects.map((project: any, index: number) => (
                          <div
                            key={index}
                            className="border-l-4 border-orange-500 pl-4"
                          >
                            <h4 className="font-semibold text-gray-900">
                              {project.title}
                            </h4>
                            <p className="text-gray-700 text-sm mb-2">
                              {project.description}
                            </p>
                            {project.technologies && (
                              <div className="flex flex-wrap gap-1">
                                {(Array.isArray(project.technologies)
                                  ? project.technologies
                                  : [project.technologies]
                                ).map((tech: string, i: number) => (
                                  <span
                                    key={i}
                                    className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                                  >
                                    {tech}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Internship History */}
                  {sections.internship && internships.length > 0 && (
                    <div className="bg-white rounded-[20px] p-6 shadow-sm border border-gray-200">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">
                        Internship History
                      </h3>
                      <div className="space-y-4">
                        {internships.map((internship: any, index: number) => (
                          <div
                            key={internship.id || index}
                            className="border-l-4 border-teal-500 pl-4"
                          >
                            <h4 className="font-semibold text-gray-900">
                              {internship.title || internship.role}
                            </h4>
                            <p className="text-gray-700">
                              {internship.company}
                            </p>
                            <p className="text-sm text-gray-600">
                              {formatDate(internship.start_date)} -{" "}
                              {internship.end_date
                                ? formatDate(internship.end_date)
                                : "Present"}
                            </p>
                            {internship.description && (
                              <p className="text-sm text-gray-600 mt-1">
                                {internship.description}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No profile data available</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileSummaryDialog;
