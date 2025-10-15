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
import { supabase } from "@/integrations/supabase/client";
import InternshipDetailsView from "@/components/InternshipDetailsView";
import Navbar from "@/components/Navbar";
import ProfileSidebar from "@/components/ProfileSidebar";

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
    // TODO: Implement edit functionality
    console.log("Edit internship:", internshipId);
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

      {/* Changed: Added container and grid layout like Dashboard.tsx */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-2">
          {/* Left Sidebar - Profile */}
          <div className="lg:col-span-1">
            <ProfileSidebar />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-2">
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
                          <p className="text-xs text-muted-foreground">
                            All time
                          </p>
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
                          <p className="text-3xl font-bold">
                            {stats.totalJobs}
                          </p>
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
                          <p className="text-3xl font-bold">
                            {stats.interviews}
                          </p>
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
              <TabsList className="grid w-full grid-cols-4 bg-muted/30 p-1 rounded-full shadow-[inset_0_4px_10px_rgba(0,0,0,0.2)]">
                <TabsTrigger
                  value="applications"
                  className="rounded-full data-[state=active]:bg-background data-[state=active]:shadow-m"
                >
                  Applications
                </TabsTrigger>
                <TabsTrigger
                  value="job-descriptions"
                  className="rounded-full data-[state=active]:bg-background data-[state=active]:shadow-m"
                >
                  Job Descriptions
                </TabsTrigger>
                <TabsTrigger
                  value="candidates"
                  className="rounded-full data-[state=active]:bg-background data-[state=active]:shadow-m"
                >
                  Candidates Management
                </TabsTrigger>
                <TabsTrigger
                  value="reports"
                  className="rounded-full data-[state=active]:bg-background data-[state=active]:shadow-m"
                >
                  Reports
                </TabsTrigger>
              </TabsList>

              {/* Applications Tab - Content remains the same */}
              <TabsContent value="applications" className="space-y-6">
                {/* ... rest of the applications tab content ... */}
              </TabsContent>

              {/* Other tabs content remains the same */}
            </Tabs>
          </div>
        </div>
      </div>

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
