import { useState } from "react";
import {
  Bell,
  Menu,
  Search,
  Users,
  FileText,
  Calendar,
  Briefcase,
  EllipsisIcon,
  Sparkles,
  ArrowRight,
  Filter,
  Plus,
  Eye,
  Pencil,
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
import EditInternshipDial from "@/components/EditInternshipDialog";
import { supabase } from "@/integrations/supabase/client";
import InternshipDetailsView from "@/components/InternshipDetailsView";
import Navbar from "@/components/Navbar";
import EditInternshipDialog from "@/components/EditInternshipDialog";
import { useUnitReports } from "@/hooks/useUnitReports";

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
  const [selectedInternship, setSelectedInternship] = useState<any>(null);
  const [editingInternship, setEditingInternship] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const {
    weeklyData,
    monthlyData,
    stats: reportStats,
    loading: reportsLoading,
  } = useUnitReports();

  if (selectedInternship) {
    return (
      <InternshipDetailsView
        internship={selectedInternship}
        onClose={() => setSelectedInternship(null)}
      />
    );
  }

  const filteredApplications = applications.filter((application) => {
    if (filterStatus === "all") return true;
    return application.status === filterStatus;
  });

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
    const internship = internships.find((i) => i.id === internshipId);
    if (internship) {
      setEditingInternship(internship);
    }
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
      <Navbar />
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="rounded-2xl">
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

          <Card className="rounded-2xl">
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

          <Card className="rounded-2xl">
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

          <Card className="rounded-2xl">
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
          <TabsList className="grid w-full grid-cols-4 bg-gray-100/70 backdrop-blur-sm  rounded-3xl shadow-inner border border-gray-200 h-16 shadow-[inset_0_4px_10px_rgba(0,0,0,0.2)]">
            <TabsTrigger
              value="applications"
              className="rounded-3xl px-5 py-4 text-sm font-medium text-gray-700 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm transition-all duration-200"
            >
              Applications
            </TabsTrigger>
            <TabsTrigger
              value="job-descriptions"
              className="rounded-3xl px-5 py-4 text-sm font-medium text-gray-700 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm transition-all duration-200"
            >
              Job Descriptions
            </TabsTrigger>
            <TabsTrigger
              value="candidates"
              className="rounded-3xl px-5 py-4 text-sm font-medium text-gray-700 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm transition-all duration-200"
            >
              Candidates Management
            </TabsTrigger>
            <TabsTrigger
              value="reports"
              className="rounded-3xl px-5 py-4 text-sm font-medium text-gray-700 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm transition-all duration-200"
            >
              Reports
            </TabsTrigger>
          </TabsList>

          {/* Applications Tab */}
          {/* Applications Tab */}
          <TabsContent
            value="applications"
            className="container mx-auto px-10 py-2"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">All Applications</h2>
              <Select
                value={filterStatus}
                onValueChange={(value) => setFilterStatus(value)}
              >
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
            ) : filteredApplications.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <h3 className="text-lg font-medium mb-2">
                  {filterStatus === "all"
                    ? "No Applications Yet"
                    : `No ${
                        filterStatus.charAt(0).toUpperCase() +
                        filterStatus.slice(1)
                      } Applications`}
                </h3>
                <p className="text-muted-foreground">
                  {filterStatus === "all"
                    ? "Applications for your internships will appear here."
                    : `No ${filterStatus} applications found.`}
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredApplications.slice(0, 9).map((application) => {
                    const skills = safeParse(
                      application.studentProfile?.skills,
                      []
                    );
                    const displaySkills = skills
                      .slice(0, 3)
                      .map((s: any) =>
                        typeof s === "string" ? s : s.name || s
                      );
                    const matchScore = application.profile_match_score;
                    return (
                      <Card
                        key={application.id}
                        className="border border-border/50 hover:shadow-lg transition-shadow w-full max-w-s min-h-[300] rounded-3xl"
                      >
                        <CardContent className="p-8 space-y-5">
                          {/* Header Section */}
                          <div className="flex items-center gap-5">
                            {/* Avatar with green ring */}
                            <div className="relative flex-shrink-0">
                              <Avatar className="w-20 h-20 ring-4 ring-green-500">
                                <AvatarImage
                                  src={
                                    application.studentProfile?.avatar_url ||
                                    undefined
                                  }
                                  alt={application.profile.full_name}
                                />
                                <AvatarFallback className="text-lg font-semibold">
                                  {application.profile.full_name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                            </div>

                            {/* Name and Title */}
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-lg mb-1 text-gray-900">
                                {application.profile.full_name}
                              </h3>
                              <p className="text-sm text-muted-foreground mb-2">
                                {application.internship.title}
                              </p>
                              <Badge
                                className={`${getStatusColor(
                                  application.status
                                )} text-sm px-3 py-1`}
                              >
                                {getStatusLabel(application.status)}
                              </Badge>
                            </div>
                          </div>

                          {/* Bio */}
                          <p className="text-base text-gray-700 leading-relaxed">
                            {typeof application.studentProfile?.bio === "string"
                              ? application.studentProfile.bio
                              : Array.isArray(application.studentProfile?.bio)
                              ? application.studentProfile.bio.join(" ")
                              : "Passionate about creating user-centered digital experiences."}
                          </p>

                          {/* Skills */}
                          <div className="flex flex-wrap gap-3">
                            {displaySkills.map(
                              (skill: string, index: number) => (
                                <Badge
                                  key={index}
                                  variant="outline"
                                  className="text-[11px] text-gray-600 bg-muted/40 rounded-full px-3 py-1.5"
                                >
                                  {skill}
                                </Badge>
                              )
                            )}
                            {skills.length > 3 && (
                              <Badge
                                variant="outline"
                                className="text-[11px] text-gray-600 bg-muted/40 rounded-full px-3 py-1.5"
                              >
                                +{skills.length - 3}
                              </Badge>
                            )}
                          </div>

                          {/* Divider */}
                          <div className="border-t border-border/40"></div>

                          {/* AI Analysis Section */}

                          {/* View Profile Button */}
                          <Button
                            variant="outline"
                            size="lg"
                            className="w-full border-2 border-teal-500 text-teal-600 hover:bg-teal-50 text-sm py-3 rounded-full mt-4"
                            onClick={() =>
                              navigate(`/candidate/${application.id}`)
                            }
                          >
                            View Profile
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {/* View All button - always show if there are applications */}
                {filteredApplications.length > 0 && (
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
          <TabsContent
            value="job-descriptions"
            className="container mx-auto px-10 py-2"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">Job Descriptions</h2>
              <div className="flex gap-4">
                <Select value={jobFilter} onValueChange={setJobFilter}>
                  <SelectTrigger className="w-[180px] rounded-full text-gray-400">
                    <SelectValue placeholder="Select Filter" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl">
                    <SelectItem value="all">Select Filter</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  className="bg-teal-600 hover:bg-teal-700 rounded-full"
                  onClick={() => setShowCreateDialog(true)}
                >
                  <Plus className="w-4 h-4" />
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
                        <Card
                          key={internship.id}
                          className="relative rounded-3xl border border-black-50 max-w-lg"
                        >
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-6">
                              {/* Title + Badge together */}
                              <div className="flex items-center gap-3">
                                <h3 className="font-semibold text-lg leading-tight">
                                  {internship.title}
                                </h3>
                                <Badge
                                  className={`${
                                    internship.status === "active"
                                      ? "bg-green-500 text-white hover:bg-green-500"
                                      : "bg-red-500 text-white hover:bg-red-500"
                                  } text-xs px-3 py-1`}
                                >
                                  {internship.status === "active"
                                    ? "Active"
                                    : "Closed"}
                                </Badge>
                              </div>

                              {/* Dropdown Menu */}
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                  >
                                    <EllipsisIcon className="w-4 h-4" />
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
                                    <Pencil className="w-4 h-4 mr-2" />
                                    Edit JD
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

                            <div className="space-y-3 mb-6">
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
                              className="w-full rounded-full"
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
          {/* <TabsContent value="candidates" className="space-y-6">
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
                                src=""
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
          </TabsContent> */}
          <TabsContent value="candidates" className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">Candidate Management</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Select by names"
                  className="pl-10 w-[250px]"
                  disabled
                />
              </div>
            </div>

            <div className="flex justify-center items-center py-12">
              <Card className="max-w-md w-full">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Coming Soon</h3>
                  <p className="text-muted-foreground mb-6">
                    Candidate management feature will be available soon.
                  </p>
                  <Button disabled variant="outline">
                    Feature Coming Soon
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="container mx-auto px-10 py-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">Reports for this Month</h2>
              {/* <Select defaultValue="current">
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select Month" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="current">Current Month</SelectItem>
        <SelectItem value="last">Last Month</SelectItem>
        <SelectItem value="custom">Custom Range</SelectItem>
      </SelectContent>
    </Select> */}
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold">Weekly Applications</h3>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-cyan-300"></div>
                      <span className="text-sm text-gray-600">
                        Previous Week
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-teal-600"></div>
                      <span className="text-sm text-gray-600">This Week</span>
                    </div>
                    {/* <Select defaultValue="week">
            <SelectTrigger className="w-[130px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
            </SelectContent>
          </Select> */}
                  </div>
                </div>

                {reportsLoading ? (
                  <div className="h-[400px] flex gap-4 p-4 relative">
                    {/* Horizontal grid lines skeleton */}
                    <div className="absolute left-12 right-0 top-0 bottom-8 pointer-events-none">
                      {[0, 1, 2, 3, 4, 5].map((i) => (
                        <div
                          key={i}
                          className="absolute w-full border-t border-gray-200"
                          style={{ top: `${(i / 5) * 100}%` }}
                        ></div>
                      ))}
                    </div>

                    {/* Y-axis labels skeleton */}
                    <div className="absolute left-0 top-0 bottom-8 w-12 flex flex-col justify-between text-xs text-gray-600">
                      {[0, 1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="text-right pr-2">
                          <Skeleton className="h-3 w-8 inline-block" />
                        </div>
                      ))}
                    </div>

                    {/* Chart bars skeleton */}
                    <div className="flex-1 flex items-end justify-around gap-8 ml-12">
                      {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                        (day) => (
                          <div
                            key={day}
                            className="flex flex-col items-center gap-2"
                          >
                            <div
                              className="relative flex items-end justify-center"
                              style={{ height: "300px", width: "48px" }}
                            >
                              {/* Larger bar skeleton (back layer) */}
                              <Skeleton
                                className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-t-2xl"
                                style={{
                                  height: `${Math.random() * 200 + 50}px`,
                                  width: "36px",
                                }}
                              />

                              {/* Smaller bar skeleton (front layer) */}
                              <Skeleton
                                className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-t-2xl z-10"
                                style={{
                                  height: `${Math.random() * 150 + 30}px`,
                                  width: "28px",
                                }}
                              />
                            </div>

                            {/* Day label skeleton */}
                            <Skeleton className="h-4 w-8" />
                          </div>
                        )
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="h-[400px] flex gap-4 p-4 relative">
                    {/* Horizontal grid lines */}
                    <div className="absolute left-12 right-0 top-0 bottom-8 pointer-events-none">
                      {[0, 1, 2, 3, 4, 5].map((i) => (
                        <div
                          key={i}
                          className="absolute w-full border-t border-gray-200"
                          style={{ top: `${(i / 5) * 100}%` }}
                        ></div>
                      ))}
                    </div>

                    {/* Y-axis labels */}
                    <div className="absolute left-0 top-0 bottom-8 w-12 flex flex-col justify-between text-xs text-gray-600">
                      {(() => {
                        const maxApplications = Math.max(
                          ...weeklyData.flatMap((d) => [
                            d.previousWeek,
                            d.thisWeek,
                          ]),
                          1
                        );

                        let range, step;
                        if (maxApplications <= 10) {
                          range = 10;
                          step = 2;
                        } else if (maxApplications <= 50) {
                          range = 50;
                          step = 10;
                        } else if (maxApplications <= 100) {
                          range = 100;
                          step = 20;
                        } else if (maxApplications <= 500) {
                          range = Math.ceil(maxApplications / 100) * 100;
                          step = range / 5;
                        } else {
                          range = Math.ceil(maxApplications / 500) * 500;
                          step = range / 5;
                        }

                        const labels = [];
                        for (let i = 0; i <= 5; i++) {
                          labels.push(
                            <div key={i} className="text-right pr-2">
                              {range - i * step}
                            </div>
                          );
                        }
                        return labels;
                      })()}
                    </div>

                    {/* Chart bars */}
                    <div className="flex-1 flex items-end justify-around gap-8 ml-12">
                      {weeklyData.map((dayData) => {
                        const maxApplications = Math.max(
                          ...weeklyData.flatMap((d) => [
                            d.previousWeek,
                            d.thisWeek,
                          ]),
                          1
                        );

                        let range;
                        if (maxApplications <= 10) range = 10;
                        else if (maxApplications <= 50) range = 50;
                        else if (maxApplications <= 100) range = 100;
                        else if (maxApplications <= 500)
                          range = Math.ceil(maxApplications / 100) * 100;
                        else range = Math.ceil(maxApplications / 500) * 500;

                        const scaleFactor = 280 / range;
                        const prevWeekHeight =
                          dayData.previousWeek * scaleFactor;
                        const thisWeekHeight = dayData.thisWeek * scaleFactor;

                        const isThisWeekLarger =
                          dayData.thisWeek >= dayData.previousWeek;

                        return (
                          <div
                            key={dayData.day}
                            className="flex flex-col items-center gap-2"
                          >
                            <div
                              className="relative flex items-end justify-center"
                              style={{ height: "300px", width: "48px" }}
                            >
                              {/* Larger bar (back layer) */}
                              <div
                                className={`absolute bottom-0 left-1/2 -translate-x-1/2 rounded-t-2xl transition-all hover:opacity-80 cursor-pointer ${
                                  isThisWeekLarger
                                    ? "bg-teal-600"
                                    : "bg-cyan-300"
                                }`}
                                style={{
                                  height: `${Math.max(
                                    isThisWeekLarger
                                      ? thisWeekHeight
                                      : prevWeekHeight,
                                    8
                                  )}px`,
                                  width: "36px",
                                }}
                              ></div>

                              {/* Smaller bar (front layer) */}
                              <div
                                className={`absolute bottom-0 left-1/2 -translate-x-1/2 rounded-t-2xl transition-all hover:opacity-80 cursor-pointer z-10 ${
                                  isThisWeekLarger
                                    ? "bg-cyan-300"
                                    : "bg-teal-600"
                                }`}
                                style={{
                                  height: `${Math.max(
                                    isThisWeekLarger
                                      ? prevWeekHeight
                                      : thisWeekHeight,
                                    8
                                  )}px`,
                                  width: "28px",
                                }}
                              ></div>
                            </div>

                            {/* Day label - moved lower with mt-4 */}
                            <span className="text-sm text-gray-600 ">
                              {dayData.day}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Total Applications
                      </p>
                      {reportsLoading ? (
                        <Skeleton className="h-8 w-16 my-1" />
                      ) : (
                        <p className="text-2xl font-bold">
                          {reportStats.totalApplications}
                        </p>
                      )}
                    </div>
                    <Users className="w-8 h-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Hired Candidates
                      </p>
                      {reportsLoading ? (
                        <Skeleton className="h-8 w-16 my-1" />
                      ) : (
                        <p className="text-2xl font-bold">
                          {reportStats.hiredCandidates}
                        </p>
                      )}
                    </div>
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Active Internships
                      </p>
                      {reportsLoading ? (
                        <Skeleton className="h-8 w-16 my-1" />
                      ) : (
                        <p className="text-2xl font-bold">
                          {reportStats.activeInternships}
                        </p>
                      )}
                    </div>
                    <Briefcase className="w-8 h-8 text-orange-500" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <EditInternshipDialog
        isOpen={!!editingInternship}
        onClose={() => setEditingInternship(null)}
        onSuccess={() => {
          setEditingInternship(null);
          window.location.reload();
        }}
        internship={editingInternship}
      />

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
