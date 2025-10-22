import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Download,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  Star,
  Heart,
  XCircle,
  User,
  CopyCheck,
  Ban,
  Linkedin,
  Instagram,
  Facebook,
  Twitter,
  Globe,
  Youtube,
  Palette,
  Dribbble,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import { useCandidateProfile } from "@/hooks/useCandidateProfile";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import ScheduleInterviewDialog from "@/components/ScheduleInterviewDialog";

const safeParse = (data: any, fallback: any) => {
  if (!data) return fallback;
  try {
    return typeof data === "string" ? JSON.parse(data) : data;
  } catch {
    return fallback;
  }
};

const CandidateProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data, loading, error, refetch } = useCandidateProfile(id || "");
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);

  const getStatusLabel = (status: string) => {
    const statusMap: Record<string, string> = {
      applied: "Not Shortlisted",
      shortlisted: "Shortlisted",
      rejected: "Not Shortlisted",
      interviewed: "Schedule Interview",
      hired: "Select Candidate",
    };
    return statusMap[status] || status;
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case "shortlisted":
        return "bg-green-500 text-white";
      case "interviewed":
        return "bg-gradient-to-r from-[#07636C] to-[#0694A2] text-white";
      case "applied":
      case "rejected":
        return "bg-red-500 text-white";
      case "hired":
        return "bg-blue-500 text-white";
      default:
        return "bg-gray-200 text-gray-700";
    }
  };

  const handleStatusChange = async (
    newStatus: "applied" | "shortlisted" | "rejected" | "interviewed" | "hired"
  ) => {
    if (!data?.application.id) return;

    // If status is "interviewed", open the schedule dialog instead
    if (newStatus === "interviewed") {
      setShowScheduleDialog(true);
      return;
    }

    setIsUpdatingStatus(true);
    try {
      const { error: updateError } = await supabase
        .from("applications")
        .update({ status: newStatus })
        .eq("id", data.application.id);

      if (updateError) throw updateError;

      // Refresh the data
      await refetch();

      // Show success toast
      toast({
        title: "Status Updated",
        description: `Application status changed to ${getStatusLabel(
          newStatus
        )}`,
        duration: 3000,
      });
    } catch (err) {
      console.error("Error updating status:", err);
      toast({
        title: "Update Failed",
        description: "Failed to update application status. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Skeleton className="h-8 w-32 mb-6" />
          <Skeleton className="h-64 w-full mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Skeleton className="h-96" />
            <Skeleton className="h-96" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-7xl mx-auto px-6 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Candidate Not Found</h1>
          <p className="text-muted-foreground mb-6">
            {error || "The candidate profile could not be found."}
          </p>
          <Button onClick={() => navigate("/unit-dashboard")}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const skills = safeParse(data.studentProfile.skills, []);
  const interests = safeParse(data.studentProfile.interests, []);
  const achievements = safeParse(data.studentProfile.achievements, []);
  const projects = safeParse(data.studentProfile.projects, []);
  const internships = safeParse(data.studentProfile.internships, []);
  const courses = safeParse(data.studentProfile.completed_courses, []);
  const education = safeParse(data.studentProfile.education, []);
  const links = safeParse(data.studentProfile.links, []);

  const matchScore = data.application.profile_match_score || 0;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => navigate("/unit-dashboard")}
            className="gap-2 flex items-center"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>

          {/* Center Title */}
          <h1 className="text-2xl font-bold text-center flex-1">
            Applied for "{data.internship.title}"
          </h1>

          {/* Profile Match Section */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Profile Match</span>
            <div className="relative w-10 h-10">
              <svg className="transform -rotate-90 w-10 h-10">
                <circle
                  cx="20"
                  cy="20"
                  r="16"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  className="text-muted"
                />
                <circle
                  cx="20"
                  cy="20"
                  r="16"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  strokeDasharray={`${matchScore * 1.005} 100.5`}
                  className="text-green-500"
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-xs font-bold">
                {matchScore}%
              </span>
            </div>
          </div>
        </div>

        {/* Profile Header Card */}
        <div className="container mx-auto px-10 py-2">
          <Card className="mb-4 rounded-3xl">
            <CardContent className="p-8">
              <div className="flex items-start gap-6">
                <Avatar className="w-24 h-24">
                  <AvatarImage
                    src={data.studentProfile.avatar_url || undefined}
                    alt={data.profile.full_name}
                  />
                  <AvatarFallback className="text-2xl">
                    {data.profile.full_name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-2">
                    {data.profile.full_name}
                  </h2>
                  <p className="text-muted-foreground mb-4">
                    {typeof data.studentProfile.bio === "string"
                      ? data.studentProfile.bio
                      : Array.isArray(data.studentProfile.bio)
                      ? data.studentProfile.bio.join(" ")
                      : "Passionate professional with experience creating meaningful impact."}
                  </p>

                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-6">
                    {data.profile.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        <span>{data.profile.email}</span>
                      </div>
                    )}
                    {data.profile.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        <span>{data.profile.phone}</span>
                      </div>
                    )}
                    {data.studentProfile.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{data.studentProfile.location}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-3">
                      {/* <Button className="gap-2 rounded-full px-6">
                        <Download className="w-4 h-4" />
                        Download Profile
                      </Button> */}

                      <Select
                        value={data.application.status}
                        onValueChange={handleStatusChange}
                        disabled={isUpdatingStatus}
                      >
                        {/* Trigger with dynamic background */}
                        <SelectTrigger
                          className={`w-48 rounded-full px-6 ${getStatusBg(
                            data.application.status
                          )}`}
                        >
                          <SelectValue placeholder="Select Status" />
                        </SelectTrigger>

                        {/* Dropdown content */}
                        <SelectContent className="rounded-2xl">
                          <SelectItem value="shortlisted">
                            <div className="flex items-center gap-2 px-4">
                              <Heart className="w-4 h-4" />
                              Shortlisted
                            </div>
                          </SelectItem>

                          <SelectItem value="applied">
                            <div className="flex items-center gap-2 px-4">
                              <Ban className="w-4 h-4" />
                              Not Shortlisted
                            </div>
                          </SelectItem>

                          <SelectItem value="hired">
                            <div className="flex items-center gap-2 px-4">
                              <CopyCheck className="w-4 h-4" />
                              Select Candidate
                            </div>
                          </SelectItem>

                          <SelectItem value="interviewed">
                            <div className="flex items-center gap-2 px-4">
                              <User className="w-4 h-4" />
                              Schedule Interview
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-[30%_69%] gap-4">
            {/* Left Column */}
            <div className="space-y-3">
              {/* Skills & Expertise */}
              <Card className="rounded-3xl">
                <CardContent className="p-6">
                  <h3 className="text-2xl font-bold mb-6">
                    Skills & Expertise
                  </h3>
                  <div className="space-y-4">
                    {skills.length > 0 ? (
                      skills.map((skill: any, idx: number) => {
                        const skillName =
                          typeof skill === "string" ? skill : skill.name;
                        const skillLevel =
                          typeof skill === "object"
                            ? skill.level
                            : "Intermediate";
                        return (
                          <div
                            key={idx}
                            className="flex items-center justify-between"
                          >
                            <span className="font-medium">{skillName}</span>
                            <Badge variant="secondary" className="bg-muted">
                              {skillLevel}
                            </Badge>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No skills listed
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Internship History */}
              {/* <Card className="rounded-3xl">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-6">Internship History</h3>
                  {data.internships.length > 0 ? (
                    <div className="space-y-4">
                      {data.internships.map((internship) => (
                        <div
                          key={internship.id}
                          className="flex items-start justify-between pb-4 border-b last:border-0"
                        >
                          <div>
                            <h4 className="font-semibold">{internship.role}</h4>
                            <p className="text-sm text-muted-foreground">
                              {internship.company}
                            </p>
                          </div>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No internship history
                    </p>
                  )}
                </CardContent>
              </Card> */}

              {/* Internships */}
              <Card className="rounded-3xl">
                <CardContent className="p-6">
                  <h3 className="text-2xl font-bold mb-4">Internships</h3>
                  {internships.length > 0 ? (
                    <ul className="space-y-4">
                      {internships.map((internship: any) => (
                        <li key={internship.id} className="text-base">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-lg">
                              {internship.title}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {internship.is_current
                                ? "Ongoing"
                                : `${new Date(
                                    internship.start_date
                                  ).toLocaleDateString()} - ${
                                    internship.end_date
                                      ? new Date(
                                          internship.end_date
                                        ).toLocaleDateString()
                                      : "N/A"
                                  }`}
                            </span>
                          </div>

                          <p className="text-muted-foreground text-base mt-1">
                            Company:{" "}
                            <span className="font-medium text-foreground">
                              {internship.company || "—"}
                            </span>
                          </p>

                          {internship.description ? (
                            <p className="text-muted-foreground text-[15px] leading-relaxed mt-1">
                              {internship.description}
                            </p>
                          ) : (
                            <span className="italic text-muted-foreground text-sm">
                              No description available
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-base text-muted-foreground">
                      No internships listed
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-3">
              {/* Interests */}
              <Card className="rounded-3xl">
                <CardContent className="p-6">
                  <h3 className="text-2xl font-bold mb-4">Interests</h3>
                  <div className="flex flex-wrap gap-2">
                    {interests.length > 0 ? (
                      interests.map((interest: string, idx: number) => (
                        <Badge
                          key={idx}
                          variant="outline"
                          className="px-3 py-1"
                        >
                          {interest}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No interests listed
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Achievements */}
              {/* <Card className="rounded-3xl">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4">Achievements</h3>
                  {achievements.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {achievements.map((achievement: string, idx: number) => (
                        <div key={idx} className="flex items-start gap-2">
                          <Star className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                          <span className="text-sm">{achievement}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No achievements listed
                    </p>
                  )}
                </CardContent>
              </Card> */}

              {/* Completed Courses */}
              <Card className="rounded-3xl">
                <CardContent className="p-6">
                  <h3 className="text-2xl font-bold mb-4">Completed Courses</h3>
                  {courses.length > 0 ? (
                    <ul className="space-y-4">
                      {courses.map((course: any) => (
                        <li key={course.id} className="text-base">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-lg">
                              {course.title}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {course.completion_date
                                ? new Date(
                                    course.completion_date
                                  ).toLocaleDateString()
                                : ""}
                            </span>
                          </div>
                          <p className="text-muted-foreground text-base mt-1">
                            Provider:{" "}
                            <span className="font-medium">
                              {course.provider}
                            </span>
                          </p>
                          {course.certificate_url ? (
                            <a
                              href={course.certificate_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline text-base"
                            >
                              View Certificate
                            </a>
                          ) : (
                            <span className="italic text-muted-foreground text-sm">
                              No certificate available
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-base text-muted-foreground">
                      No completed courses listed
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Projects */}
              <Card className="rounded-3xl">
                <CardContent className="p-6">
                  <h3 className="text-2xl font-bold mb-4">Projects</h3>
                  {projects.length > 0 ? (
                    <ul className="space-y-4">
                      {projects.map((project: any) => (
                        <li key={project.id} className="text-base">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-lg">
                              {project.title}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {project.is_current
                                ? "Ongoing"
                                : `${new Date(
                                    project.start_date
                                  ).toLocaleDateString()} - ${new Date(
                                    project.end_date
                                  ).toLocaleDateString()}`}
                            </span>
                          </div>

                          {project.description && (
                            <p className="text-muted-foreground text-[15px] leading-relaxed mt-1">
                              {project.description}
                            </p>
                          )}

                          {project.technologies?.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {project.technologies.map(
                                (tech: string, idx: number) => (
                                  <span
                                    key={idx}
                                    className="text-xs bg-muted px-2 py-1 rounded-full"
                                  >
                                    {tech}
                                  </span>
                                )
                              )}
                            </div>
                          )}

                          {project.project_url ? (
                            <a
                              href={project.project_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline text-base mt-1 block"
                            >
                              View Project
                            </a>
                          ) : (
                            <span className="italic text-muted-foreground text-sm mt-1 block">
                              No project link available
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-base text-muted-foreground">
                      No projects listed
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Education */}
              <Card className="rounded-3xl">
                <CardContent className="p-6">
                  <h3 className="text-2xl font-bold mb-6">Education</h3>
                  {education.length > 0 ? (
                    <div className="space-y-5">
                      {education.map((edu: any, idx: number) => (
                        <div
                          key={idx}
                          className="flex items-start justify-between pb-4 border-b last:border-0"
                        >
                          <div>
                            <h4 className="font-semibold text-lg">
                              {edu.degree || edu.name || "Education"}
                            </h4>
                            <p className="text-base text-muted-foreground">
                              {edu.institution ||
                                edu.school ||
                                edu.college ||
                                "Educational Institution"}
                            </p>
                            {edu.field_of_study && (
                              <p className="text-base text-muted-foreground mt-1">
                                {edu.field_of_study}
                              </p>
                            )}
                            {edu.description && (
                              <p className="text-base mt-2 leading-relaxed">
                                {edu.description}
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="text-base font-medium">
                              {edu.start_year || edu.start_date} -{" "}
                              {edu.end_year || edu.end_date || "Present"}
                            </p>
                            {edu.score && (
                              <p className="text-base text-primary font-semibold">
                                {edu.score}
                              </p>
                            )}
                            {edu.grade && (
                              <p className="text-base text-primary font-semibold">
                                {edu.grade}
                              </p>
                            )}
                            {edu.gpa && (
                              <p className="text-base text-primary font-semibold">
                                GPA: {edu.gpa}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-base text-muted-foreground">
                      No education records
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Links */}
              <Card className="rounded-3xl">
                <CardContent className="p-6">
                  <h3 className="text-2xl font-bold mb-4">Links</h3>

                  <div className="flex flex-wrap gap-3 items-center">
                    {(() => {
                      const getSocialIcon = (link: any) => {
                        const url = (link.url || "").toLowerCase();
                        const platform = (link.platform || "").toLowerCase();

                        if (
                          platform.includes("linkedin") ||
                          url.includes("linkedin.com")
                        )
                          return Linkedin;
                        if (
                          platform.includes("instagram") ||
                          url.includes("instagram.com")
                        )
                          return Instagram;
                        if (
                          platform.includes("facebook") ||
                          url.includes("facebook.com")
                        )
                          return Facebook;
                        if (
                          platform.includes("twitter") ||
                          platform.includes("x") ||
                          url.includes("twitter.com") ||
                          url.includes("x.com")
                        )
                          return Twitter;
                        if (
                          platform.includes("youtube") ||
                          url.includes("youtube.com")
                        )
                          return Youtube;
                        if (
                          platform.includes("behance") ||
                          url.includes("behance.net")
                        )
                          return Palette;
                        if (
                          platform.includes("dribbble") ||
                          url.includes("dribbble.com")
                        )
                          return Dribbble;
                        return Globe;
                      };

                      if (!links || links.length === 0) {
                        return (
                          <p className="text-sm text-muted-foreground">
                            No links provided
                          </p>
                        );
                      }

                      return (
                        <div className="flex flex-wrap gap-3">
                          {links.map((link: any, idx: number) => {
                            const Icon = getSocialIcon(link);
                            return (
                              <Button
                                key={idx}
                                variant="outline"
                                size="icon"
                                className="rounded-full"
                                asChild
                              >
                                <a
                                  href={link.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <Icon className="w-4 h-4" />
                                </a>
                              </Button>
                            );
                          })}
                        </div>
                      );
                    })()}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Interview Dialog */}
      <ScheduleInterviewDialog
        open={showScheduleDialog}
        onOpenChange={setShowScheduleDialog}
        candidateName={data.profile.full_name}
        candidateEmail={data.profile.email}
        applicationId={data.application.id}
        onSuccess={refetch}
      />
    </div>
  );
};

export default CandidateProfile;
