import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Search, Bell, Menu, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import type { ApplicationWithDetails } from "@/hooks/useUnitApplications";

const InternshipApplicants = () => {
  const { internshipId } = useParams();
  const navigate = useNavigate();
  const [applications, setApplications] = useState<ApplicationWithDetails[]>(
    []
  );
  const [filteredApplications, setFilteredApplications] = useState<
    ApplicationWithDetails[]
  >([]);
  const [internshipTitle, setInternshipTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [displayCount, setDisplayCount] = useState(6);
  const [filters, setFilters] = useState({
    exact: false,
    above90: false,
    between80and90: false,
    between60and80: false,
  });
  const observerTarget = useRef(null);

  const safeParse = (data: any, fallback: any) => {
    if (!data) return fallback;
    try {
      return typeof data === "string" ? JSON.parse(data) : data;
    } catch {
      return fallback;
    }
  };

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);

        // Fetch internship details
        const { data: internship, error: internshipError } = await supabase
          .from("internships")
          .select("title")
          .eq("id", internshipId)
          .maybeSingle();

        if (internshipError) throw internshipError;
        setInternshipTitle(internship?.title || "");

        // Fetch applications for this internship
        const { data: applicationsData, error: appsError } = await supabase
          .from("applications")
          .select("*")
          .eq("internship_id", internshipId)
          .order("applied_date", { ascending: false });

        if (appsError) throw appsError;

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

            if (!internshipRes.data || !profileRes.data) {
              return null;
            }

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
                website_url: null,
              },
            };
          })
        );

        const validApplications = applicationsWithDetails.filter(
          (app) => app !== null
        ) as ApplicationWithDetails[];
        setApplications(validApplications);
        setFilteredApplications(validApplications);
      } catch (error) {
        console.error("Error fetching applications:", error);
      } finally {
        setLoading(false);
      }
    };

    if (internshipId) {
      fetchApplications();
    }
  }, [internshipId]);

  // Filter applications based on match score
  useEffect(() => {
    if (
      !filters.exact &&
      !filters.above90 &&
      !filters.between80and90 &&
      !filters.between60and80
    ) {
      setFilteredApplications(applications);
      return;
    }

    const filtered = applications.filter((app) => {
      const matchScore = app.profile_match_score || 0;

      if (filters.exact && matchScore === 100) return true;
      if (filters.above90 && matchScore > 90 && matchScore < 100) return true;
      if (filters.between80and90 && matchScore >= 80 && matchScore <= 90)
        return true;
      if (filters.between60and80 && matchScore >= 60 && matchScore < 80)
        return true;

      return false;
    });

    setFilteredApplications(filtered);
    setDisplayCount(6);
  }, [filters, applications]);

  // Infinite scroll
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      if (target.isIntersecting && displayCount < filteredApplications.length) {
        setDisplayCount((prev) =>
          Math.min(prev + 6, filteredApplications.length)
        );
      }
    },
    [displayCount, filteredApplications.length]
  );

  useEffect(() => {
    const element = observerTarget.current;
    const option = { threshold: 0 };

    const observer = new IntersectionObserver(handleObserver, option);
    if (element) observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, [handleObserver]);

  const getMatchColor = (score: number) => {
    if (score === 100) return "border-purple-500";
    if (score > 90) return "border-green-500";
    if (score >= 80) return "border-blue-500";
    if (score >= 60) return "border-orange-500";
    return "border-red-500";
  };

  const getMatchTextColor = (score: number) => {
    if (score === 100) return "text-purple-600";
    if (score > 90) return "text-green-600";
    if (score >= 80) return "text-blue-600";
    if (score >= 60) return "text-orange-600";
    return "text-red-600";
  };

  const getDaysAgo = (date: string) => {
    const now = new Date();
    const appliedDate = new Date(date);
    const diffTime = Math.abs(now.getTime() - appliedDate.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full"></div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full"></div>
            </div>
          </div>

          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="text"
                placeholder="Search"
                className="pl-10 bg-muted/30 border-muted"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <Bell className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Menu className="w-4 h-4" />
            </Button>
            <div className="flex items-center space-x-2">
              <div className="grid grid-cols-2 gap-1">
                <div className="w-2 h-2 bg-orange-400 rounded-sm"></div>
                <div className="w-2 h-2 bg-teal-400 rounded-sm"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-sm"></div>
                <div className="w-2 h-2 bg-green-400 rounded-sm"></div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6 max-w-7xl mx-auto">
        {/* Back Button and Title */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/unit-dashboard")}
              className="gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </Button>
            <h1 className="text-2xl font-semibold">
              Applicants for {internshipTitle}
            </h1>
          </div>

          {/* Filter Dropdown */}
          <div className="relative">
            <div className="border rounded-lg p-4 bg-card min-w-[250px]">
              <Label className="text-sm font-medium mb-3 block">
                Select Matches
              </Label>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="exact"
                    checked={filters.exact}
                    onCheckedChange={(checked) =>
                      setFilters({ ...filters, exact: checked as boolean })
                    }
                  />
                  <label
                    htmlFor="exact"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Exact Matches (100%)
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="above90"
                    checked={filters.above90}
                    onCheckedChange={(checked) =>
                      setFilters({ ...filters, above90: checked as boolean })
                    }
                  />
                  <label
                    htmlFor="above90"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Above 90% Match
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="between80and90"
                    checked={filters.between80and90}
                    onCheckedChange={(checked) =>
                      setFilters({
                        ...filters,
                        between80and90: checked as boolean,
                      })
                    }
                  />
                  <label
                    htmlFor="between80and90"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    80% – 90% Matches
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="between60and80"
                    checked={filters.between60and80}
                    onCheckedChange={(checked) =>
                      setFilters({
                        ...filters,
                        between60and80: checked as boolean,
                      })
                    }
                  />
                  <label
                    htmlFor="between60and80"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    60% – 80% Matches
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Applicants Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="border border-border/50">
                <CardContent className="p-6">
                  <Skeleton className="w-20 h-20 rounded-full mx-auto mb-4" />
                  <Skeleton className="h-5 w-32 mx-auto mb-2" />
                  <Skeleton className="h-4 w-24 mx-auto mb-3" />
                  <Skeleton className="h-3 w-full mb-4" />
                  <Skeleton className="h-8 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium mb-2">No Applicants Found</h3>
            <p className="text-muted-foreground">
              {applications.length === 0
                ? "No one has applied to this internship yet."
                : "No applicants match the selected filters."}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredApplications
                .slice(0, displayCount)
                .map((application) => {
                  const skills = safeParse(
                    application.studentProfile?.skills,
                    []
                  );
                  const displaySkills = skills
                    .slice(0, 3)
                    .map((s: any) => (typeof s === "string" ? s : s.name || s));
                  const matchScore = application.profile_match_score || 0;
                  const daysAgo = getDaysAgo(application.applied_date);

                  return (
                    <Card
                      key={application.id}
                      className="border border-border/50 hover:shadow-lg transition-shadow"
                    >
                      <CardContent className="p-6">
                        <div className="flex flex-col items-center text-center">
                          <Avatar
                            className={`w-20 h-20 mb-3 ring-4 ${getMatchColor(
                              matchScore
                            )}`}
                          >
                            <AvatarImage
                              src={
                                application.studentProfile?.avatar_url ||
                                undefined
                              }
                              alt={application.profile.full_name}
                            />
                            <AvatarFallback className="text-lg">
                              {application.profile.full_name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>

                          <h3 className="font-semibold text-lg mb-1">
                            {application.profile.full_name}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            {application.profile.role || "Professional"}
                          </p>

                          <Badge className="bg-yellow-500 text-white hover:bg-yellow-500 mb-4">
                            Applied {daysAgo} {daysAgo === 1 ? "day" : "days"}{" "}
                            ago
                          </Badge>

                          <p className="text-xs text-muted-foreground mb-4 line-clamp-2">
                            {typeof application.studentProfile?.bio === 'string'
                              ? application.studentProfile.bio
                              : Array.isArray(application.studentProfile?.bio)
                              ? application.studentProfile.bio.join(' ')
                              : "Passionate UI/UX designer with 3+ years of experience creating user-centered digital experiences."}
                          </p>

                          <div className="flex flex-wrap gap-2 justify-center mb-4">
                            {displaySkills.map(
                              (skill: string, index: number) => (
                                <Badge
                                  key={index}
                                  variant="outline"
                                  className="text-xs bg-muted/50"
                                >
                                  {skill}
                                </Badge>
                              )
                            )}
                            {skills.length > 3 && (
                              <Badge
                                variant="outline"
                                className="text-xs bg-muted/50"
                              >
                                +{skills.length - 3}
                              </Badge>
                            )}
                          </div>

                          <div className="w-full bg-muted/30 rounded-lg p-3 mb-4">
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-purple-500" />
                                <span className="text-xs font-medium">
                                  AI Analysis for the profile
                                </span>
                              </div>
                              <div
                                className={`w-10 h-10 rounded-full border-4 flex items-center justify-center ${getMatchColor(
                                  matchScore
                                )}`}
                              >
                                <span className="text-xs font-bold">
                                  {matchScore}%
                                </span>
                              </div>
                            </div>
                            <p
                              className={`text-xs font-medium ${getMatchTextColor(
                                matchScore
                              )}`}
                            >
                              {matchScore}% Skill matches for this role
                            </p>
                          </div>

                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full border-primary text-primary hover:bg-primary/10"
                            onClick={() =>
                              navigate(`/candidate/${application.id}`)
                            }
                          >
                            View Profile
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
            </div>

            {/* Infinite Scroll Target */}
            {displayCount < filteredApplications.length && (
              <div
                ref={observerTarget}
                className="flex justify-center mt-8 py-4"
              >
                <Button variant="link" className="text-primary font-medium">
                  View More
                </Button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default InternshipApplicants;
