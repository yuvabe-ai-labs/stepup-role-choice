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
  UserCheck,
  Calendar,
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

  const handleStatusChange = async (
    newStatus: "applied" | "shortlisted" | "rejected" | "interviewed" | "hired"
  ) => {
    if (!data?.application.id) return;

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
  const education = safeParse(data.studentProfile.education, []);

  const matchScore = data.application.profile_match_score || 0;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/unit-dashboard")}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Profile Match</span>
            <div className="relative w-12 h-12">
              <svg className="transform -rotate-90 w-12 h-12">
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                  className="text-muted"
                />
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                  strokeDasharray={`${matchScore * 1.26} 126`}
                  className="text-green-500"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-xs font-bold">
                {matchScore}%
              </span>
            </div>
          </div>
        </div>

        <h1 className="text-2xl font-bold mb-8">
          Applied for "{data.internship.title}"
        </h1>

        {/* Profile Header Card */}
        <Card className="mb-8">
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
                  {data.studentProfile.bio ||
                    "Passionate professional with experience creating meaningful impact."}
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
                  <Button className="gap-2">
                    <Download className="w-4 h-4" />
                    Download Profile
                  </Button>
                  <Select
                    value={data.application.status}
                    onValueChange={handleStatusChange}
                    disabled={isUpdatingStatus}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="shortlisted">
                        <div className="flex items-center gap-2">
                          <Heart className="w-4 h-4" />
                          Shortlisted
                        </div>
                      </SelectItem>
                      <SelectItem value="applied">
                        <div className="flex items-center gap-2">
                          <XCircle className="w-4 h-4" />
                          Not Shortlisted
                        </div>
                      </SelectItem>
                      <SelectItem value="hired">
                        <div className="flex items-center gap-2">
                          <UserCheck className="w-4 h-4" />
                          Select Candidate
                        </div>
                      </SelectItem>
                      <SelectItem value="interviewed">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          Schedule Interview
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-8">
            {/* Skills & Expertise */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-6">Skills & Expertise</h3>
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
            <Card>
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
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Interests */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">Interests</h3>
                <div className="flex flex-wrap gap-2">
                  {interests.length > 0 ? (
                    interests.map((interest: string, idx: number) => (
                      <Badge key={idx} variant="outline" className="px-3 py-1">
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
            <Card>
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
            </Card>

            {/* Education */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-6">Education</h3>
                {education.length > 0 ? (
                  <div className="space-y-4">
                    {education.map((edu: any, idx: number) => (
                      <div
                        key={idx}
                        className="flex items-start justify-between pb-4 border-b last:border-0"
                      >
                        <div>
                          <h4 className="font-semibold">
                            {edu.degree || edu.name || "Education"}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {edu.institution ||
                              edu.school ||
                              edu.college ||
                              "Educational Institution"}
                          </p>
                          {edu.field_of_study && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {edu.field_of_study}
                            </p>
                          )}
                          {edu.description && (
                            <p className="text-sm mt-2">{edu.description}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            {edu.start_year || edu.start_date} -{" "}
                            {edu.end_year || edu.end_date || "Present"}
                          </p>
                          {edu.score && (
                            <p className="text-sm text-primary font-semibold">
                              {edu.score}
                            </p>
                          )}
                          {edu.grade && (
                            <p className="text-sm text-primary font-semibold">
                              {edu.grade}
                            </p>
                          )}
                          {edu.gpa && (
                            <p className="text-sm text-primary font-semibold">
                              GPA: {edu.gpa}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No education records
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Links */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">Links</h3>
                <div className="flex flex-wrap gap-3">
                  {data.studentProfile.linkedin_url && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      asChild
                    >
                      <a
                        href={data.studentProfile.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="w-4 h-4" />
                        LinkedIn
                      </a>
                    </Button>
                  )}
                  {data.studentProfile.behance_url && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      asChild
                    >
                      <a
                        href={data.studentProfile.behance_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Behance
                      </a>
                    </Button>
                  )}
                  {data.studentProfile.dribbble_url && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      asChild
                    >
                      <a
                        href={data.studentProfile.dribbble_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Dribbble
                      </a>
                    </Button>
                  )}
                  {data.studentProfile.website_url && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      asChild
                    >
                      <a
                        href={data.studentProfile.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Website
                      </a>
                    </Button>
                  )}
                  {!data.studentProfile.linkedin_url &&
                    !data.studentProfile.behance_url &&
                    !data.studentProfile.dribbble_url &&
                    !data.studentProfile.website_url && (
                      <p className="text-sm text-muted-foreground">
                        No links provided
                      </p>
                    )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateProfile;
