import { useState } from "react";
import {
  Bell,
  Menu,
  Search,
  Users,
  FileText,
  Calendar,
  Briefcase,
  Settings,
  Sparkles,
  ArrowRight,
  Filter,
  Plus,
  Eye,
  MessageSquare,
  Ban,
  CheckCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUnitApplications } from "@/hooks/useUnitApplications";
import { useInternships } from "@/hooks/useInternships";
import CreateInternshipDialog from "@/components/CreateInternshipDialog";
import { supabase } from "@/integrations/supabase/client";
import InternshipDetailsView from "@/components/InternshipDetailsView";

const safeParse = (data: any, fallback: any) => {
  if (!data) return fallback;
  try {
    return typeof data === "string" ? JSON.parse(data) : data;
  } catch {
    return fallback;
  }
};

const UnitDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("applications");
  const { applications, stats, loading } = useUnitApplications();
  const { internships, loading: internshipsLoading } = useInternships();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [jobFilter, setJobFilter] = useState("all");
  const [updating, setUpdating] = useState<string | null>(null);
  const [selectedInternship, setSelectedInternship] = useState<any>(null); // ADD THIS

  if (selectedInternship) {
    return (
      <InternshipDetailsView
        internship={selectedInternship}
        onClose={() => setSelectedInternship(null)}
      />
    );
  }

  const handleInternshipCreated = () => {
    // Refresh the page to reload internships
    window.location.reload();
  };

  const handleViewDetails = (internshipId: string) => {
    const internship = internships.find((i) => i.id === internshipId);
    if (internship) {
      setSelectedInternship(internship);
    }
  };

  const handleAddComments = (internshipId: string) => {
    // Navigate to comments page or open comments modal
    console.log("Add comments for internship:", internshipId);
    // You can implement a modal or navigation here
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    try {
      setUpdating(id);
      const newStatus = currentStatus === "active" ? "closed" : "active";

      const { error: updateError } = await supabase
        .from("internships")
        .update({ status: newStatus })
        .eq("id", id);

      if (updateError) throw updateError;

      window.location.reload(); // Refresh the list after update
    } catch (err: any) {
      console.error("Error updating job status:", err);
      alert("Failed to update job status");
    } finally {
      setUpdating(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "shortlisted":
        return "bg-green-500 text-white hover:bg-green-500";
      case "rejected":
        return "bg-red-500 text-white hover:bg-red-500";
      case "interviewed":
        return "bg-blue-500 text-white hover:bg-blue-500";
      case "hired":
        return "bg-green-500 text-white hover:bg-green-500";
      default:
        return "bg-gray-500 text-white hover:bg-gray-500";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "shortlisted":
        return "Shortlisted";
      case "rejected":
        return "Not Shortlist";
      case "interviewed":
        return "Interviewed";
      case "hired":
        return "Shortlisted";
      default:
        return "Applied";
    }
  };

  const getMatchColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-orange-600";
    return "text-red-600";
  };

  // Filter hired candidates for Candidates Management tab
  const hiredCandidates = applications.filter((app) => app.status === "hired");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full"></div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full"></div>
            </div>
          </div>

          {/* Search Bar */}
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

          {/* Right Section */}
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
      <main className="p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Applications
                  </p>
                  {loading ? (
                    <Skeleton className="h-10 w-16 my-1" />
                  ) : (
                    <>
                      <p className="text-3xl font-bold">{stats.total}</p>
                      <p className="text-xs text-muted-foreground">All time</p>
                    </>
                  )}
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Job Descriptions
                  </p>
                  {loading ? (
                    <Skeleton className="h-10 w-16 my-1" />
                  ) : (
                    <>
                      <p className="text-3xl font-bold">{stats.totalJobs}</p>
                      <p className="text-xs text-muted-foreground">
                        Active & Closed
                      </p>
                    </>
                  )}
                </div>
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-teal-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Interview Scheduled
                  </p>
                  {loading ? (
                    <Skeleton className="h-10 w-16 my-1" />
                  ) : (
                    <>
                      <p className="text-3xl font-bold">{stats.interviews}</p>
                      <p className="text-xs text-muted-foreground">
                        Candidates
                      </p>
                    </>
                  )}
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Hired This Month
                  </p>
                  {loading ? (
                    <Skeleton className="h-10 w-16 my-1" />
                  ) : (
                    <>
                      <p className="text-3xl font-bold">
                        {stats.hiredThisMonth}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date().toLocaleString("default", {
                          month: "long",
                        })}
                      </p>
                    </>
                  )}
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-4 bg-muted/30 p-1 rounded-full">
            <TabsTrigger
              value="applications"
              className="rounded-full data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              Applications
            </TabsTrigger>
            <TabsTrigger
              value="job-descriptions"
              className="rounded-full data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              Job Descriptions
            </TabsTrigger>
            <TabsTrigger
              value="candidates"
              className="rounded-full data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              Candidates Management
            </TabsTrigger>
            <TabsTrigger
              value="reports"
              className="rounded-full data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              Reports
            </TabsTrigger>
          </TabsList>

          {/* Applications Tab */}
          <TabsContent value="applications" className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">All Applications</h2>
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Applications</SelectItem>
                  <SelectItem value="shortlisted">Shortlisted</SelectItem>
                  <SelectItem value="interviewed">Interviewed</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

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
            ) : applications.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <h3 className="text-lg font-medium mb-2">
                  No Applications Yet
                </h3>
                <p className="text-muted-foreground">
                  Applications for your internships will appear here.
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {applications.slice(0, 9).map((application) => {
                    // Get skills from studentProfile, parse if needed
                    const skillsData = application.studentProfile?.skills || [];
                    const skills = Array.isArray(skillsData) 
                      ? skillsData 
                      : safeParse(skillsData, []);
                    const displaySkills = skills
                      .slice(0, 3)
                      .map((s: any) =>
                        typeof s === "string" ? s : s?.name || s || ""
                      );
                    const matchScore =
                      application.profile_match_score ||
                      Math.floor(Math.random() * 40 + 60);

                    return (
                      <Card
                        key={application.id}
                        className="border border-border/50 hover:shadow-md transition-shadow"
                      >
                        <CardContent className="p-6">
                          <div className="flex flex-col items-center text-center">
                            <Avatar className="w-20 h-20 mb-4 ring-2 ring-primary/10">
                              <AvatarImage
                                src={
                                  application.profile?.avatar_url || undefined
                                }
                                alt={application.profile?.full_name || "User"}
                              />
                              <AvatarFallback className="text-lg">
                                {application.profile?.full_name
                                  ?.split(" ")
                                  .map((n) => n[0])
                                  .join("") || "?"}
                              </AvatarFallback>
                            </Avatar>

                            <h3 className="font-semibold text-lg mb-1">
                              {application.profile?.full_name || "Unknown"}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-3">
                              {application.internship?.title || "No Title"}
                            </p>

                            <Badge
                              className={`${getStatusColor(
                                application.status
                              )} mb-4`}
                            >
                              {getStatusLabel(application.status)}
                            </Badge>

                            <p className="text-xs text-muted-foreground mb-4 line-clamp-2">
                              {application.profile?.bio ||
                                "Passionate about creating user-centered digital experiences."}
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
                                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                                    matchScore >= 80
                                      ? "border-green-500"
                                      : matchScore >= 60
                                      ? "border-orange-500"
                                      : "border-red-500"
                                  }`}
                                >
                                  <span className="text-xs font-bold">
                                    {matchScore}%
                                  </span>
                                </div>
                              </div>
                              <p
                                className={`text-xs ${getMatchColor(
                                  matchScore
                                )}`}
                              >
                                {matchScore}% Skill matches for this role
                              </p>
                            </div>

                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full"
                              onClick={() =>
                                navigate(`/candidate-profile/${application.id}`)
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

                {/* View All button - always show if there are applications */}
                {applications.length > 0 && (
                  <div className="flex justify-center mt-8">
                    <Button
                      variant="outline"
                      className="px-8"
                      onClick={() => navigate("/all-applications")}
                    >
                      View All
                    </Button>
                  </div>
                )}
              </>
            )}
          </TabsContent>

          {/* Job Descriptions Tab */}
          <TabsContent value="job-descriptions" className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">Job Descriptions</h2>
              <div className="flex gap-4">
                <Select value={jobFilter} onValueChange={setJobFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Jobs</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  className="bg-teal-600 hover:bg-teal-700"
                  onClick={() => setShowCreateDialog(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create New JD
                </Button>
              </div>
            </div>

            {internshipsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-6">
                      <Skeleton className="h-6 w-32 mb-4" />
                      <Skeleton className="h-4 w-24 mb-2" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-10 w-full mt-4" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : internships.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <h3 className="text-lg font-medium mb-2">
                  No Job Descriptions
                </h3>
                <p className="text-muted-foreground">
                  Create your first job posting to start receiving applications.
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {internships
                    .filter((internship) => {
                      if (jobFilter === "all") return true;
                      if (jobFilter === "active")
                        return internship.status === "active";
                      if (jobFilter === "closed")
                        return internship.status !== "active";
                      return true;
                    })
                    .slice(0, 6)
                    .map((internship) => {
                      const applicationCount = applications.filter(
                        (app) => app.internship_id === internship.id
                      ).length;

                      return (
                        <Card key={internship.id} className="relative">
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-4">
                              <h3 className="font-semibold text-lg">
                                {internship.title}
                              </h3>
                              <div className="flex items-center gap-2">
                                <Badge
                                  className={
                                    internship.status === "active"
                                      ? "bg-green-500 text-white hover:bg-green-500"
                                      : "bg-red-500 text-white hover:bg-red-500"
                                  }
                                >
                                  {internship.status === "active"
                                    ? "Active"
                                    : "Closed"}
                                </Badge>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0"
                                    >
                                      <Settings className="w-4 h-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent
                                    align="end"
                                    className="w-48"
                                  >
                                    <DropdownMenuItem
                                      onClick={() =>
                                        setSelectedInternship(internship)
                                      }
                                    >
                                      <Eye className="w-4 h-4 mr-2" />
                                      View Details
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleAddComments(internship.id)
                                      }
                                    >
                                      <MessageSquare className="w-4 h-4 mr-2" />
                                      Add Comments
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleToggleStatus(
                                          internship.id,
                                          internship.status
                                        )
                                      }
                                    >
                                      {internship.status === "active" ? (
                                        <span className="flex items-center text-red-500">
                                          <Ban className="w-4 h-4 mr-2" />
                                          Close JD
                                        </span>
                                      ) : (
                                        <span className="flex items-center text-green-500">
                                          <CheckCircle className="w-4 h-4 mr-2" />
                                          Activate JD
                                        </span>
                                      )}
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>

                            <div className="space-y-2 mb-4">
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">
                                  Applications:
                                </span>
                                <span className="font-medium">
                                  {applicationCount} Applied
                                </span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">
                                  Duration:
                                </span>
                                <span className="font-medium">
                                  {internship.duration || "Not specified"}
                                </span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">
                                  Created on:
                                </span>
                                <span className="font-medium">
                                  {new Date(
                                    internship.created_at
                                  ).toLocaleDateString("en-GB", {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                  })}
                                </span>
                              </div>
                            </div>

                            <Button
                              variant="outline"
                              className="w-full"
                              onClick={() =>
                                navigate(
                                  `/internship-applicants/${internship.id}`
                                )
                              }
                            >
                              View Applicants
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                          </CardContent>
                        </Card>
                      );
                    })}
                </div>

                {internships.length > 6 && (
                  <div className="flex justify-center mt-8">
                    <Button variant="link" className="text-primary font-medium">
                      View More
                    </Button>
                  </div>
                )}
              </>
            )}
          </TabsContent>

          {/* Candidates Management Tab */}
          <TabsContent value="candidates" className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">Candidate Management</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Select by names"
                  className="pl-10 w-[250px]"
                />
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(4)].map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-6">
                      <Skeleton className="h-20 w-full mb-4" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-10 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : hiredCandidates.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <h3 className="text-lg font-medium mb-2">
                  No Hired Candidates
                </h3>
                <p className="text-muted-foreground">
                  Candidates you hire will appear here for management.
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {hiredCandidates.slice(0, 6).map((candidate) => {
                    const progress = Math.floor(Math.random() * 60 + 20);

                    return (
                      <Card key={candidate.id}>
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="text-sm text-muted-foreground">
                              {candidate.internship.title}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {candidate.internship.duration || "6 Months"} |
                              Full time
                            </div>
                          </div>

                          <div className="flex items-center gap-4 mb-4">
                            <Avatar className="w-16 h-16">
                              <AvatarImage
                                src={candidate.profile?.avatar_url || undefined}
                                alt={candidate.profile.full_name}
                              />
                              <AvatarFallback>
                                {candidate.profile.full_name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-semibold text-lg">
                                {candidate.profile.full_name}
                              </h3>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                Available now
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2 mb-4">
                            <div className="flex items-center justify-between text-sm">
                              <span className="font-medium">
                                Projects Progress
                              </span>
                              <span className="text-muted-foreground">
                                Due on Oct 10
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-2xl font-bold">
                                {progress}%
                              </span>
                              <Progress value={progress} className="flex-1" />
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="flex -space-x-2">
                                <Avatar className="w-8 h-8 border-2 border-background">
                                  <AvatarFallback className="text-xs">
                                    D
                                  </AvatarFallback>
                                </Avatar>
                                <Avatar className="w-8 h-8 border-2 border-background">
                                  <AvatarFallback className="text-xs">
                                    A
                                  </AvatarFallback>
                                </Avatar>
                              </div>
                              <span className="text-xs text-muted-foreground">
                                Guided by{" "}
                                <span className="font-medium">Darshini</span> &{" "}
                                <span className="font-medium">Abinesh</span>
                              </span>
                            </div>
                            <Button variant="outline" size="sm">
                              More Details
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {hiredCandidates.length > 6 && (
                  <div className="flex justify-center mt-8">
                    <Button variant="link" className="text-primary font-medium">
                      View all
                    </Button>
                  </div>
                )}
              </>
            )}
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">Reports for this Month</h2>
              <Select defaultValue="current">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Month" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="current">Current Month</SelectItem>
                  <SelectItem value="last">Last Month</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold">Weekly Applications</h3>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-cyan-300"></div>
                      <span className="text-sm text-muted-foreground">
                        Previous Week
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-teal-600"></div>
                      <span className="text-sm text-muted-foreground">
                        This Week
                      </span>
                    </div>
                    <Select defaultValue="week">
                      <SelectTrigger className="w-[130px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="week">This Week</SelectItem>
                        <SelectItem value="month">This Month</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="h-[400px] flex items-end justify-between gap-4 border-l border-b border-border p-4">
                  {["Mon", "Tues", "Wed", "Thurs", "Fri", "Sat", "Sun"].map(
                    (day, index) => {
                      const prevWeekHeight = Math.random() * 60 + 20;
                      const thisWeekHeight = Math.random() * 60 + 20;

                      return (
                        <div
                          key={day}
                          className="flex-1 flex flex-col items-center gap-2"
                        >
                          <div
                            className="w-full flex gap-1 items-end"
                            style={{ height: "300px" }}
                          >
                            <div
                              className="flex-1 bg-cyan-300 rounded-t-lg transition-all hover:opacity-80"
                              style={{ height: `${prevWeekHeight}%` }}
                            ></div>
                            <div
                              className="flex-1 bg-teal-600 rounded-t-lg transition-all hover:opacity-80"
                              style={{ height: `${thisWeekHeight}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {day}
                          </span>
                        </div>
                      );
                    }
                  )}
                </div>

                <div className="flex justify-center mt-8">
                  <Button variant="link" className="text-primary font-medium">
                    View Detailed Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Create Internship Dialog */}
      <CreateInternshipDialog
        isOpen={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onSuccess={handleInternshipCreated}
      />
    </div>
  );
};

export default UnitDashboard;
