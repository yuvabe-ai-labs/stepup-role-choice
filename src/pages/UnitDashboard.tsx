import CreateInternshipDialog from "@/components/CreateInternshipDialog";
import EditInternshipDialog from "@/components/EditInternshipDialog";
import InternshipDetailsView from "@/components/InternshipDetailsView";
import Navbar from "@/components/Navbar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useInternships } from "@/hooks/useInternships";
import { useUnitApplications } from "@/hooks/useUnitApplications";
import { useUnitReports } from "@/hooks/useUnitReports";
import { useHiredApplicants } from "@/hooks/useHiredApplicants";
import { supabase } from "@/integrations/supabase/client";
import {
  ArrowRight,
  Briefcase,
  Calendar,
  CheckCircle,
  EllipsisIcon,
  Eye,
  FileText,
  Pencil,
  Plus,
  Search,
  Trash2,
  Users,
  ChevronDown,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
  const {
    data: hiredCandidates,
    unitInfo,
    loading: hiredLoading,
  } = useHiredApplicants();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [jobFilter, setJobFilter] = useState("all");
  const [updating, setUpdating] = useState<string | null>(null);
  const [selectedInternship, setSelectedInternship] = useState<any>(null);
  const [editingInternship, setEditingInternship] = useState<any>(null);
  const [filterStatuses, setFilterStatuses] = useState<string[]>([]);
  const [deletingInternship, setDeletingInternship] = useState<any>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [activatingInternship, setActivatingInternship] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const {
    weeklyData,
    monthlyData,
    stats: reportStats,
    loading: reportsLoading,
  } = useUnitReports();

  // Auto-close internships when deadline passes
  useEffect(() => {
    const checkAndCloseExpiredInternships = async () => {
      if (internshipsLoading || internships.length === 0) return;

      const now = new Date();
      const expiredInternships = internships.filter((internship) => {
        if (internship.status !== "active") return false;
        const deadline = new Date(internship.application_deadline);
        return deadline < now;
      });

      if (expiredInternships.length > 0) {
        try {
          const updatePromises = expiredInternships.map((internship) =>
            supabase
              .from("internships")
              .update({ status: "closed" })
              .eq("id", internship.id)
          );

          await Promise.all(updatePromises);
          window.location.reload();
        } catch (err) {
          console.error("Error auto-closing expired internships:", err);
        }
      }
    };

    checkAndCloseExpiredInternships();
  }, [internships, internshipsLoading]);

  if (selectedInternship) {
    return (
      <InternshipDetailsView
        internship={selectedInternship}
        onClose={() => setSelectedInternship(null)}
      />
    );
  }

  const filteredApplications = applications.filter((application) => {
    if (filterStatuses.length === 0) return true;
    return filterStatuses.includes(application.status);
  });

  // Filter hired candidates by search query
  const filteredHiredCandidates = hiredCandidates.filter((candidate) => {
    if (!searchQuery) return true;
    const name = candidate.student?.full_name?.toLowerCase() || "";
    const internshipTitle = candidate.internship?.title?.toLowerCase() || "";
    return (
      name.includes(searchQuery.toLowerCase()) ||
      internshipTitle.includes(searchQuery.toLowerCase())
    );
  });

  const handleInternshipCreated = () => {
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

  const handleDeleteClick = (internship: any) => {
    setDeletingInternship(internship);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingInternship) return;

    try {
      setUpdating(deletingInternship.id);

      const { error: deleteError } = await supabase
        .from("internships")
        .delete()
        .eq("id", deletingInternship.id);

      if (deleteError) throw deleteError;

      setShowDeleteDialog(false);
      setDeletingInternship(null);
      window.location.reload();
    } catch (err: any) {
      console.error("Error deleting job:", err);
      alert("Failed to delete job description");
    } finally {
      setUpdating(null);
    }
  };

  const handleToggleStatus = async (internship: any) => {
    if (internship.status !== "active") {
      setActivatingInternship(internship);
      setEditingInternship(internship);
    } else {
      try {
        setUpdating(internship.id);

        const { error: updateError } = await supabase
          .from("internships")
          .update({ status: "closed" })
          .eq("id", internship.id);

        if (updateError) throw updateError;

        window.location.reload();
      } catch (err: any) {
        console.error("Error updating job status:", err);
        alert("Failed to update job status");
      } finally {
        setUpdating(null);
      }
    }
  };

  const handleEditSuccess = async () => {
    if (activatingInternship) {
      try {
        const { error: updateError } = await supabase
          .from("internships")
          .update({ status: "active" })
          .eq("id", activatingInternship.id);

        if (updateError) throw updateError;

        setActivatingInternship(null);
        setEditingInternship(null);
        window.location.reload();
      } catch (err: any) {
        console.error("Error activating job:", err);
        alert("Failed to activate job description");
        setActivatingInternship(null);
        setEditingInternship(null);
      }
    } else {
      setEditingInternship(null);
      window.location.reload();
    }
  };

  const handleEditClose = () => {
    setActivatingInternship(null);
    setEditingInternship(null);
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
        return "hired";
      default:
        return "Applied";
    }
  };

  const getMatchColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-orange-600";
    return "text-red-600";
  };

  const toggleStatusFilter = (status: string) => {
    setFilterStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  const getFilterDisplayText = () => {
    if (filterStatuses.length === 0) return "All Applications";
    if (filterStatuses.length === 1) {
      const statusLabels: { [key: string]: string } = {
        shortlisted: "Shortlisted",
        interviewed: "Interviewed",
        rejected: "Rejected",
        hired: "Hired",
      };
      return statusLabels[filterStatuses[0]] || "Select Filter";
    }
    return `${filterStatuses.length} selected`;
  };

  const formatJobType = (jobType: string) => {
    if (!jobType) return "Not specified";
    return jobType
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const handleViewCandidate = (applicationId: string) => {
    navigate(`/unit/candidate-tasks/${applicationId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container px-4 sm:px-6 lg:px-[7.5rem] py-4 lg:py-10">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card className="rounded-2xl">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium">
                    Total Applications
                  </p>
                  {loading ? (
                    <Skeleton className="h-8 sm:h-10 w-12 sm:w-16 my-1" />
                  ) : (
                    <>
                      <p className="text-2xl sm:text-3xl font-bold">
                        {stats.total}
                      </p>
                      <p className="text-xs text-muted-foreground">All time</p>
                    </>
                  )}
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium ">
                    Total Job Descriptions
                  </p>
                  {loading ? (
                    <Skeleton className="h-8 sm:h-10 w-12 sm:w-16 my-1" />
                  ) : (
                    <>
                      <p className="text-2xl sm:text-3xl font-bold">
                        {stats.totalJobs}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Active & Closed
                      </p>
                    </>
                  )}
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-teal-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium ">
                    Interview Scheduled
                  </p>
                  {loading ? (
                    <Skeleton className="h-8 sm:h-10 w-12 sm:w-16 my-1" />
                  ) : (
                    <>
                      <p className="text-2xl sm:text-3xl font-bold">
                        {stats.interviews}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Candidates
                      </p>
                    </>
                  )}
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium ">
                    Hired This Month
                  </p>
                  {loading ? (
                    <Skeleton className="h-8 sm:h-10 w-12 sm:w-16 my-1" />
                  ) : (
                    <>
                      <p className="text-2xl sm:text-3xl font-bold">
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
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4 sm:space-y-6"
        >
          <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
            <TabsList className="grid w-full min-w-max sm:min-w-0 grid-cols-4 bg-gray-100/70 backdrop-blur-sm rounded-3xl shadow-inner border border-gray-200 h-12 sm:h-16 shadow-[inset_0_4px_10px_rgba(0,0,0,0.2)]">
              <TabsTrigger
                value="applications"
                className="rounded-3xl px-3 sm:px-5 py-2 sm:py-4 text-xs sm:text-sm font-medium text-gray-700 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm transition-all duration-200 whitespace-nowrap"
              >
                Applications
              </TabsTrigger>
              <TabsTrigger
                value="job-descriptions"
                className="rounded-3xl px-3 sm:px-5 py-2 sm:py-4 text-xs sm:text-sm font-medium text-gray-700 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm transition-all duration-200 whitespace-nowrap"
              >
                Job Descriptions
              </TabsTrigger>
              <TabsTrigger
                value="candidates"
                className="rounded-3xl px-3 sm:px-5 py-2 sm:py-4 text-xs sm:text-sm font-medium text-gray-700 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm transition-all duration-200 whitespace-nowrap"
              >
                Candidates
              </TabsTrigger>
              <TabsTrigger
                value="reports"
                className="rounded-3xl px-3 sm:px-5 py-2 sm:py-4 text-xs sm:text-sm font-medium text-gray-700 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm transition-all duration-200 whitespace-nowrap"
              >
                Reports
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Candidates Management Tab */}
          <TabsContent
            value="candidates"
            className="space-y-6 px-0 sm:px-4 lg:px-10"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <h2 className="text-xl sm:text-2xl font-semibold">
                Hired Candidates ({filteredHiredCandidates.length})
              </h2>
              <div className="relative w-full sm:w-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search by name or position"
                  className="pl-10 w-full sm:w-[300px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {hiredLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <Card key={i} className="border border-gray-200 rounded-3xl">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <Skeleton className="w-20 h-20 rounded-full" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-6 w-48" />
                          <Skeleton className="h-4 w-32" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredHiredCandidates.length === 0 ? (
              <div className="flex justify-center items-center py-12">
                <Card className="max-w-md w-full mx-4">
                  <CardContent className="p-6 sm:p-8 text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold mb-2">
                      {searchQuery
                        ? "No Results Found"
                        : "No Hired Candidates Yet"}
                    </h3>
                    <p className="text-sm sm:text-base text-muted-foreground">
                      {searchQuery
                        ? "Try adjusting your search query"
                        : "Hired candidates will appear here once you hire applicants"}
                    </p>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredHiredCandidates.map((candidate) => (
                  <Card
                    key={candidate.application_id}
                    className="border border-gray-200 rounded-3xl hover:shadow-lg transition-shadow"
                  >
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm text-gray-600 mb-3">
                            {candidate.internship?.title ||
                              "Position not specified"}
                          </p>

                          <div className="flex items-center gap-4">
                            {/* Avatar */}
                            <Avatar className="w-20 h-20">
                              <AvatarImage
                                src={candidate.student?.avatar_url || undefined}
                                alt={
                                  candidate.student?.full_name || "Candidate"
                                }
                                className="object-cover"
                              />
                              <AvatarFallback className="text-lg font-semibold bg-gray-200">
                                {(candidate.student?.full_name || "NA")
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .toUpperCase()}
                              </AvatarFallback>
                            </Avatar>

                            {/* Name */}
                            <div>
                              <h3 className="text-xl font-bold text-gray-900 mb-1">
                                {candidate.student?.full_name ||
                                  "Name not available"}
                              </h3>
                            </div>
                          </div>
                        </div>

                        {/* Duration Info */}
                        <div className="text-right text-sm text-gray-600">
                          <span>
                            {candidate.internship?.duration ||
                              "Duration not specified"}{" "}
                            |{" "}
                            {formatJobType(
                              candidate.internship?.job_type || ""
                            )}
                          </span>
                        </div>
                      </div>

                      {/* Action */}
                      <div className="flex justify-end pt-2">
                        <Button
                          variant="outline"
                          className="rounded-full"
                          onClick={() =>
                            handleViewCandidate(candidate.application_id)
                          }
                        >
                          View Details
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="max-w-[90vw] sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-sm">
              This will permanently delete the job description "
              {deletingInternship?.title}". This action cannot be undone and
              will remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel
              onClick={() => {
                setShowDeleteDialog(false);
                setDeletingInternship(null);
              }}
              className="w-full sm:w-auto"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700 w-full sm:w-auto"
            >
              {updating === deletingInternship?.id ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <EditInternshipDialog
        isOpen={!!editingInternship}
        onClose={handleEditClose}
        onSuccess={handleEditSuccess}
        internship={editingInternship}
      />

      <CreateInternshipDialog
        isOpen={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onSuccess={handleInternshipCreated}
      />
    </div>
  );
};

export default UnitDashboard;
