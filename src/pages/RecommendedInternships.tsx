import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { MapPin, Clock, DollarSign, Bookmark, Check, Share2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useApplicationStatus } from "@/hooks/useApplicationStatus";
import { useInternshipRecommendations } from "@/hooks/useRecommendations";
import ProfileSummaryDialog from "@/components/ProfileSummaryDialog";
import ApplicationSuccessDialog from "@/components/ApplicationSuccessDialog";
import { ShareDialog } from "@/components/ShareDialog";
import type { Tables } from "@/integrations/supabase/types";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/hooks/use-toast";

type Internship = Tables<"internships">;

interface InternshipWithUnit extends Internship {
  unit_avatar?: string | null;
  unit_name?: string | null;
  matchScore?: number;
  matchPercentage?: number;
}

// Helper to safely parse JSON
function safeParse<T>(data: any, fallback: T): T {
  if (!data) return fallback;
  try {
    return typeof data === "string" ? JSON.parse(data) : data;
  } catch {
    return fallback;
  }
}

// Helper to convert numbered object to array
function parseNumberedObject(data: any): string[] {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (typeof data === "object") {
    return Object.entries(data)
      .sort(([a], [b]) => parseInt(a) - parseInt(b))
      .map(([_, value]) => value as string)
      .filter(
        (value) =>
          typeof value === "string" &&
          value.length > 0 &&
          !value.toLowerCase().includes("responsibilities") &&
          !value.toLowerCase().includes("requirements") &&
          !value.toLowerCase().includes("candidates"),
      );
  }
  return [];
}

const RecommendedInternships = () => {
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [allInternships, setAllInternships] = useState<InternshipWithUnit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedInternship, setSelectedInternship] = useState<string>("");
  const [showApplicationDialog, setShowApplicationDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [userSkills, setUserSkills] = useState<string[]>([]);
  const [savedInternshipsSet, setSavedInternshipsSet] = useState<Set<string>>(new Set());
  const contentRef = useRef<HTMLDivElement>(null);

  const { hasApplied, isLoading: isCheckingStatus, markAsApplied } = useApplicationStatus(selectedInternship);

  // Fetch internships with unit data and user skills
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const {
          data: { user },
        } = await supabase.auth.getUser();

        // Fetch internships with unit data
        const { data: internshipsData, error: internshipsError } = await supabase
          .from("internships")
          .select(
            `
            *,
            profiles!internships_created_by_fkey (
              id,
              units (
                avatar_url,
                unit_name
              )
            )
          `,
          )
          .eq("status", "active")
          .order("created_at", { ascending: false });

        if (internshipsError) throw internshipsError;

        // Transform data to include unit info
        const transformedInternships: InternshipWithUnit[] = (internshipsData || []).map((internship: any) => ({
          ...internship,
          unit_avatar: internship.profiles?.units?.[0]?.avatar_url || null,
          unit_name: internship.profiles?.units?.[0]?.unit_name || null,
        }));

        setAllInternships(transformedInternships);

        // Fetch user skills and saved internships if logged in
        if (user) {
          const { data: profile } = await supabase.from("profiles").select("id").eq("user_id", user.id).maybeSingle();

          if (profile) {
            // Fetch skills
            const { data: studentProfile } = await supabase
              .from("student_profiles")
              .select("skills")
              .eq("profile_id", profile.id)
              .maybeSingle();

            if (studentProfile?.skills) {
              let skills: any[] = [];

              if (typeof studentProfile.skills === "string") {
                try {
                  const parsed = JSON.parse(studentProfile.skills);
                  skills = Array.isArray(parsed) ? parsed : studentProfile.skills.split(",").map((s) => s.trim());
                } catch {
                  skills = studentProfile.skills.split(",").map((s) => s.trim());
                }
              } else if (Array.isArray(studentProfile.skills)) {
                skills = studentProfile.skills;
              }

              setUserSkills(skills);
            }

            // Fetch saved internships
            const { data: savedData } = await supabase
              .from("saved_internships")
              .select("internship_id")
              .eq("student_id", profile.id);

            if (savedData) {
              setSavedInternshipsSet(new Set(savedData.map((item) => item.internship_id)));
            }
          }
        }
      } catch (error: any) {
        console.error("Error fetching data:", error);
        setError(error.message || "Failed to fetch internships");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Use the recommendation hook (same as Dashboard)
  const internships = useInternshipRecommendations(allInternships, userSkills);

  // Set default selected internship when data loads or from URL params
  useEffect(() => {
    const idFromUrl = searchParams.get("id");

    if (idFromUrl && internships.length > 0) {
      // Check if the internship from URL exists in the list
      const exists = internships.some((int) => int.id === idFromUrl);
      if (exists) {
        setSelectedInternship(idFromUrl);
        return;
      }
    }

    // Default to first internship if no URL param or invalid ID
    if (internships.length > 0 && !selectedInternship) {
      setSelectedInternship(internships[0].id);
    }
  }, [internships, searchParams]);

  // Scroll to top when internship selection changes
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [selectedInternship]);

  const selectedInternshipData = internships.find((int) => int.id === selectedInternship) || internships[0];

  const handleSaveInternship = async () => {
    if (!selectedInternship) return;

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to save internships.",
          variant: "destructive",
        });
        return;
      }

      const { data: profile } = await supabase.from("profiles").select("id").eq("user_id", user.id).single();

      if (!profile) {
        toast({
          title: "Error",
          description: "Profile not found.",
          variant: "destructive",
        });
        return;
      }

      const isSaved = savedInternshipsSet.has(selectedInternship);

      // Optimistic update
      const newSavedSet = new Set(savedInternshipsSet);
      if (isSaved) {
        newSavedSet.delete(selectedInternship);
      } else {
        newSavedSet.add(selectedInternship);
      }
      setSavedInternshipsSet(newSavedSet);

      // Perform API call
      if (isSaved) {
        const { error } = await supabase
          .from("saved_internships")
          .delete()
          .eq("student_id", profile.id)
          .eq("internship_id", selectedInternship);

        if (error) {
          // Revert on error
          setSavedInternshipsSet(savedInternshipsSet);
          throw error;
        }

        toast({
          title: "Removed",
          description: "Internship removed from saved list.",
        });
      } else {
        const { error } = await supabase.from("saved_internships").insert({
          student_id: profile.id,
          internship_id: selectedInternship,
        });

        if (error) {
          // Revert on error
          setSavedInternshipsSet(savedInternshipsSet);
          throw error;
        }

        toast({
          title: "Saved",
          description: "Internship saved successfully!",
        });
      }
    } catch (error: any) {
      console.error("Error saving internship:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save internship.",
        variant: "destructive",
      });
    }
  };

  // Parse all data fields from database with error handling
  let responsibilities = [];
  let requirements = [];
  let skills = [];
  let benefits = [];

  try {
    responsibilities = parseNumberedObject(safeParse(selectedInternshipData?.responsibilities, {}));
  } catch (e) {
    console.error("Error parsing responsibilities:", e);
    responsibilities = [];
  }

  try {
    requirements = parseNumberedObject(safeParse(selectedInternshipData?.requirements, {}));
  } catch (e) {
    console.error("Error parsing requirements:", e);
    requirements = [];
  }

  try {
    skills = parseNumberedObject(safeParse(selectedInternshipData?.skills_required, {}));
  } catch (e) {
    console.error("Error parsing skills:", e);
    skills = [];
  }

  try {
    benefits = parseNumberedObject(safeParse(selectedInternshipData?.benefits, {}));
  } catch (e) {
    console.error("Error parsing benefits:", e);
    benefits = [];
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Left Sidebar - Fixed Header + Scrollable List */}
        <div className="w-80 bg-white border-r border-gray-200 h-full flex flex-col">
          {/* Fixed Top Picks Header */}
          <div className="bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 text-white p-5 m-4 rounded-lg shadow-sm flex-shrink-0 sticky top-0 z-10">
            <h2 className="text-lg font-semibold mb-2">Top picks for you</h2>
            <p className="text-sm opacity-90 leading-relaxed">
              Based on your profile, preferences, and activity like applies, searches, and saves
            </p>
            <p className="text-xs mt-2 opacity-80">{loading ? "..." : internships.length} results</p>
          </div>

          {/* Scrollable Internship Cards List */}
          <div className="px-4 py-4 space-y-1 overflow-y-auto flex-1" style={{ scrollbarWidth: "thin" }}>
            {loading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <Card key={index} className="cursor-pointer shadow-sm border border-gray-100">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <Skeleton className="w-8 h-8 rounded-full" />
                      <Skeleton className="w-16 h-5 rounded-full" />
                    </div>
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-3 w-full mb-1" />
                    <Skeleton className="h-3 w-2/3 mb-3" />
                    <Skeleton className="h-3 w-1/2" />
                  </CardContent>
                </Card>
              ))
            ) : error ? (
              <div className="p-4 text-center">
                <p className="text-gray-500 text-sm">Error loading internships: {error}</p>
              </div>
            ) : internships.length === 0 ? (
              <div className="p-4 text-center">
                <p className="text-gray-500 text-sm">No recommended internships available.</p>
              </div>
            ) : (
              internships.map((internship) => (
                <Card
                  key={internship.id}
                  className={`cursor-pointer transition-all duration-150 shadow-sm border border-gray-100 hover:shadow-md ${
                    selectedInternship === internship.id
                      ? "ring-1 ring-blue-500 shadow-md border-blue-200"
                      : "hover:border-gray-300"
                  }`}
                  onClick={() => setSelectedInternship(internship.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={internship.unit_avatar || undefined} alt={internship.unit_name || "Unit"} />
                        <AvatarFallback className="bg-black text-white text-xs font-bold">
                          {(internship.unit_name || internship.company_name)?.charAt(0) || "C"}
                        </AvatarFallback>
                      </Avatar>
                      <Badge className="bg-blue-500 hover:bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                        Saved{" "}
                        {internship.posted_date
                          ? formatDistanceToNow(new Date(internship.posted_date), {
                              addSuffix: true,
                            })
                          : "recently"}
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-gray-900 text-sm mb-2 leading-tight">{internship.title}</h3>
                    <p className="text-xs text-gray-600 mb-3 leading-relaxed line-clamp-2">{internship.description}</p>
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock className="w-3 h-3 mr-1" />
                      {internship.duration}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Main Content - Independently Scrollable */}
        <div ref={contentRef} className="flex-1 bg-white h-full overflow-y-auto" style={{ scrollbarWidth: "thin" }}>
          {loading ? (
            <div className="p-8">
              <div className="flex justify-between items-start mb-8">
                <div className="flex items-start space-x-5">
                  <Skeleton className="w-16 h-16 rounded-xl" />
                  <div className="space-y-2">
                    <Skeleton className="h-7 w-64" />
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-80" />
                  </div>
                </div>
                <div className="flex space-x-3">
                  <Skeleton className="h-9 w-16" />
                  <Skeleton className="h-9 w-16" />
                  <Skeleton className="h-9 w-24" />
                </div>
              </div>
            </div>
          ) : error ? (
            <div className="p-8 text-center py-16">
              <p className="text-gray-500">Error loading internship details: {error}</p>
            </div>
          ) : !selectedInternshipData ? (
            <div className="p-8 text-center py-16">
              <p className="text-gray-500">Select an internship to view details</p>
            </div>
          ) : (
            <div className="p-8">
              {/* Header */}
              <div className="flex justify-between items-start mb-8">
                <div className="flex items-start space-x-5">
                  <Avatar className="w-16 h-16 shadow-sm">
                    <AvatarImage
                      src={selectedInternshipData.unit_avatar || undefined}
                      alt={selectedInternshipData.unit_name || "Unit"}
                    />
                    <AvatarFallback className="bg-teal-600 text-white text-2xl font-bold">
                      {(selectedInternshipData.unit_name || selectedInternshipData.company_name)?.charAt(0) || "C"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">{selectedInternshipData.title}</h1>
                    <p className="text-lg text-gray-700 mb-3 font-medium">
                      {selectedInternshipData.company_name?.replace(/\n/g, "")}
                    </p>
                    <div className="flex items-center space-x-5 text-sm text-gray-600">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1.5 text-gray-500" />
                        {selectedInternshipData.location}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1.5 text-gray-500" />
                        {selectedInternshipData.duration}
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 mr-1.5 text-gray-500" />
                        {selectedInternshipData.payment}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <Button
                    size="sm"
                    className={`flex items-center space-x-1.5 px-4 py-2 ${
                      savedInternshipsSet.has(selectedInternship) ? "text-gray-400 bg-white" : "text-gray-600 bg-white"
                    }`}
                    onClick={handleSaveInternship}
                  >
                    <Bookmark
                      className={`w-4 h-4 ${savedInternshipsSet.has(selectedInternship) ? "fill-current" : ""}`}
                    />
                    <span>{savedInternshipsSet.has(selectedInternship) ? "Saved" : "Save"}</span>
                  </Button>
                  <Button
                    size="sm"
                    className="flex items-center space-x-1.5 px-4 py-2 text-gray-700 bg-white hover:bg-gray-50"
                    onClick={() => setShowShareDialog(true)}
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Share</span>
                  </Button>
                  <Button
                    className="bg-orange-500 hover:bg-orange-600 rounded-full text-white px-6"
                    disabled={hasApplied || isCheckingStatus}
                    onClick={() => setShowApplicationDialog(true)}
                  >
                    {hasApplied ? "Applied" : "Apply Now"}
                  </Button>
                </div>
              </div>

              {/* About the Internship */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">About the Internship</h2>
                <div className="text-gray-700 leading-relaxed">
                  <p>{selectedInternshipData.description}</p>
                </div>
              </div>

              {/* Key Responsibilities */}
              {responsibilities.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Key Responsibilities</h2>
                  <div className="space-y-3">
                    {responsibilities.map((responsibility, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-5 h-5 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-3 h-3" />
                        </div>
                        <p className="text-gray-700 leading-relaxed">{responsibility}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Requirements */}
              {requirements.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Requirements from the Candidates</h2>
                  <div className="space-y-3">
                    {requirements.map((requirement, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-5 h-5 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-3 h-3" />
                        </div>
                        <p className="text-gray-700 leading-relaxed">{requirement}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills Required */}
              {skills.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Skills Required</h2>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="bg-gray-100 text-gray-700 px-3 py-1">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Benefits */}
              {benefits.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Benefits</h2>
                  <div className="space-y-3">
                    {benefits.map((benefit, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-3 h-3" />
                        </div>
                        <p className="text-gray-700 leading-relaxed">{benefit}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {selectedInternshipData.application_deadline && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Application Deadline</h3>
                    <p className="text-gray-700">
                      {new Date(selectedInternshipData.application_deadline).toLocaleDateString()}
                    </p>
                  </div>
                )}

                {selectedInternshipData.company_email && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Contact</h3>
                    <p className="text-gray-700">{selectedInternshipData.company_email}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Application Dialog */}
      {selectedInternshipData && (
        <ProfileSummaryDialog
          isOpen={showApplicationDialog}
          onClose={() => setShowApplicationDialog(false)}
          internship={selectedInternshipData}
          onSuccess={() => {
            markAsApplied();
            setShowSuccessDialog(true);
          }}
        />
      )}

      {/* Success Dialog */}
      <ApplicationSuccessDialog isOpen={showSuccessDialog} onClose={() => setShowSuccessDialog(false)} />

      {/* Share Dialog */}
      {selectedInternshipData && (
        <ShareDialog
          isOpen={showShareDialog}
          onClose={() => setShowShareDialog(false)}
          title={selectedInternshipData.title}
          url={`${window.location.origin}/internships/${selectedInternshipData.id}`}
        />
      )}
    </div>
  );
};

export default RecommendedInternships;
