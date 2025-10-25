import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Clock, DollarSign, Bookmark, Share2, CircleCheckBig } from "lucide-react";
import { ShareDialog } from "@/components/ShareDialog";
import Navbar from "@/components/Navbar";
import ProfileSummaryDialog from "@/components/ProfileSummaryDialog";
import ApplicationSuccessDialog from "@/components/ApplicationSuccessDialog";
import { supabase } from "@/integrations/supabase/client";
import { useApplicationStatus } from "@/hooks/useApplicationStatus";
import { useIsSaved } from "@/hooks/useSavedInternships";
import { useToast } from "@/hooks/use-toast";
import type { Tables } from "@/integrations/supabase/types";

const safeParse = (data: any, fallback: any) => {
  if (!data) return fallback;
  try {
    return typeof data === "string" ? JSON.parse(data) : data;
  } catch {
    return fallback;
  }
};

const InternshipDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [internship, setInternship] = useState<Tables<"internships"> | null>(null);
  const [unit, setUnit] = useState<any | null>(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showApplicationDialog, setShowApplicationDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [savingInternship, setSavingInternship] = useState(false);
  const { hasApplied, isLoading: isCheckingStatus, markAsApplied } = useApplicationStatus(id || "");
  const { isSaved, isLoading: isCheckingSaved, refetch: refetchSaved } = useIsSaved(id || "");

  const handleSaveInternship = async () => {
    if (!id) return;

    setSavingInternship(true);
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

      if (isSaved) {
        const { error } = await supabase
          .from("saved_internships")
          .delete()
          .eq("student_id", profile.id)
          .eq("internship_id", id);

        if (error) throw error;

        toast({
          title: "Removed",
          description: "Internship removed from saved list.",
        });
      } else {
        const { error } = await supabase.from("saved_internships").insert({
          student_id: profile.id,
          internship_id: id,
        });

        if (error) throw error;

        toast({
          title: "Saved",
          description: "Internship saved successfully!",
        });
      }

      refetchSaved();
    } catch (error: any) {
      console.error("Error saving internship:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save internship.",
        variant: "destructive",
      });
    } finally {
      setSavingInternship(false);
    }
  };

  useEffect(() => {
    const fetchInternship = async () => {
      if (!id) return;

      try {
        const { data, error } = await supabase.from("internships").select("*").eq("id", id).single();

        if (error) throw error;
        setInternship(data);

        // Fetch unit ID from the creator's profile
        if (data.created_by) {
          const { data: unitData } = await supabase
            .from("units")
            .select("*")
            .eq("profile_id", data.created_by)
            .maybeSingle();

          if (unitData) {
            setUnit(unitData);
          }
        }
      } catch (error) {
        console.error("Error fetching internship:", error);
        toast({
          title: "Error",
          description: "Failed to load internship details.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchInternship();
  }, [id, toast]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-5xl mx-auto px-6 py-8">
          <Skeleton className="h-12 w-64 mb-4" />
          <Skeleton className="h-96 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!internship) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-5xl mx-auto px-6 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Internship Not Found</h1>
          <Button onClick={() => navigate("/internships")}>Back to Internships</Button>
        </div>
      </div>
    );
  }

  const responsibilities = safeParse(internship.responsibilities, []);
  const requirements = safeParse(internship.requirements, []);
  const benefits = safeParse(internship.benefits, []);
  const skillsRequired = safeParse(internship.skills_required, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Main Content */}
      <div className="container lg:px-[7.5rem] lg:py-10">
        <div className="space-y-8 rounded-3xl border border-gray-200 p-10">
          {/* Header Card */}
          <Card className="mb-6  border-0 shadow-none">
            <CardContent className="border-0 p-0">
              <div className="flex items-start justify-between pb-7 border-b border-gray-200 gap-6">
                {/* Left Side - Company Logo & Info */}
                <div className="flex gap-7 flex-1">
                  <div
                    className={`${
                      unit.avatar_url
                        ? "bg-transparent border border-gray-200"
                        : "bg-gradient-to-br from-teal-400 to-teal-600"
                    } w-[6.25rem] h-[6.25rem] rounded-full  flex items-center justify-center flex-shrink-0`}
                  >
                    <span className="text-3xl text-white font-bold">
                      {unit?.avatar_url ? (
                        <img
                          src={unit.avatar_url}
                          alt={unit.unit_name || internship.company_name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-3xl text-white font-bold">{internship.company_name.charAt(0)}</span>
                      )}
                    </span>
                  </div>

                  <div className="flex-1">
                    <h1 className="text-3xl font-bold">{internship.title}</h1>
                    <p className="text-lg text-muted-foreground font-medium mb-2.5">{internship.company_name}</p>

                    <div className="flex flex-wrap gap-4 text-sm">
                      {internship.location && (
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <MapPin className="w-4 h-4" />
                          <span>{internship.location}</span>
                        </div>
                      )}
                      {internship.duration && (
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>{internship.duration}</span>
                        </div>
                      )}
                      {internship.is_paid && (
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <DollarSign className="w-4 h-4" />
                          <span>Paid</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Side - Action Buttons */}
                <div className="flex gap-2 items-start">
                  <Button
                    size="sm"
                    className={`flex items-center ${isSaved ? "text-gray-400 bg-white" : "text-gray-600 bg-white"}`}
                    onClick={handleSaveInternship}
                    disabled={savingInternship || isCheckingSaved}
                  >
                    <Bookmark className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} />
                    <span>{isSaved ? "Saved" : "Save"}</span>
                  </Button>
                  <Button
                    size="sm"
                    className="flex items-center text-gray-700 bg-white"
                    onClick={() => setShowShareDialog(true)}
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Share</span>
                  </Button>
                  <Button
                    variant="gradient"
                    className="rounded-full text-white"
                    disabled={hasApplied || isCheckingStatus}
                    onClick={() => setShowApplicationDialog(true)}
                  >
                    {hasApplied ? "Applied" : "Apply Now"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          {/* About the Internship */}
          <section className="border-b border-gray-200 pb-7">
            <h2 className="text-xl font-medium mb-4">About the Internship</h2>
            <p className="text-muted-foreground leading-relaxed text-justify">
              {internship.description || "No description available."}
            </p>
          </section>

          {/* Key Responsibilities */}
          {responsibilities.length > 0 && (
            <section className="border-b border-gray-200 pb-7">
              <h2 className="text-xl font-medium mb-4">Key Responsibilities</h2>
              <ul className="space-y-3">
                {responsibilities.map((item: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CircleCheckBig className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Requirements from the Candidates */}
          {requirements.length > 0 && (
            <section className="border-b border-gray-200 pb-7">
              <h2 className="text-xl font-medium mb-4">Requirements from the Candidates</h2>
              <ul className="space-y-3">
                {requirements.map((item: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CircleCheckBig className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* What You Will Get */}
          {benefits.length > 0 && (
            <section className="border-b border-gray-200 pb-7">
              <h2 className="text-xl font-medium mb-4">What You Will Get</h2>
              <ul className="space-y-3">
                {benefits.map((item: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CircleCheckBig className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Required Skills */}
          {skillsRequired.length > 0 && (
            <section>
              <h2 className="text-xl font-medium mb-4">Required Skills</h2>
              <div className="flex flex-wrap gap-2">
                {skillsRequired.map((skill: string, idx: number) => (
                  <Badge key={idx} variant="outline" className="px-4 py-2 border-gray-600">
                    {skill}
                  </Badge>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Ready to Apply */}
        <div className="my-2.5 rounded-3xl border border-gray-200 p-10">
          <Card className="border-0 shadow-none">
            <CardContent className="p-0">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl text-gray-900 font-bold mb-5">Ready to Apply</h2>
                  <p className="text-muted-foreground">
                    Join {internship.company_name} and make a meaningful impact in {internship.location || "Auroville"}
                  </p>
                </div>
                <Button
                  variant="gradient"
                  className="text-white rounded-full"
                  disabled={hasApplied || isCheckingStatus}
                  onClick={() => setShowApplicationDialog(true)}
                >
                  {hasApplied ? "Applied" : "Apply Now"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Company Info */}
        <div className="mt-2.5 rounded-3xl border border-gray-200 p-10">
          <Card className="border-0 shadow-none pb-7 border-b border-gray-200">
            <CardContent className="p-0">
              <div className="flex gap-6 flex-1">
                <div
                  className={`${
                    unit.avatar_url
                      ? "bg-transparent border border-gray-200"
                      : "bg-gradient-to-br from-teal-400 to-teal-600"
                  } w-[6.25rem] h-[6.25rem] rounded-full  flex items-center justify-center flex-shrink-0`}
                >
                  <span className="text-3xl text-white font-bold">
                    {unit?.avatar_url ? (
                      <img
                        src={unit.avatar_url}
                        alt={unit.unit_name || internship.company_name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-3xl text-white font-bold">{internship.company_name.charAt(0)}</span>
                    )}
                  </span>
                </div>

                <div className="flex-1">
                  {unit.contact_email && (
                    <div>
                      <h2 className="text-2xl font-bold">{unit.unit_name}</h2>
                      <p className="font-[500] text-gray-500">{unit.contact_email}</p>
                    </div>
                  )}

                  {unit.address && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mb-4">
                      <MapPin className="w-4 h-4" />
                      <span>{unit.address}</span>
                    </div>
                  )}
                </div>

                <Button
                  variant="gradient"
                  className="border-none bg-orange-500 hover:bg-orange-600 text-white rounded-full px-8"
                  onClick={() => {
                    if (unit.id) {
                      navigate(`/units/${unit.id}`);
                    } else {
                      toast({
                        title: "Not Available",
                        description: "Company profile not found.",
                        variant: "destructive",
                      });
                    }
                  }}
                >
                  View Company Profile
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* About Company */}
          {unit.description && (
            <section>
              <h2 className="text-xl font-medium my-4">About the company</h2>
              <div className="flex flex-wrap gap-2">
                <p className="text-muted-foreground text-justify leading-relaxed">{unit.description}</p>
              </div>
            </section>
          )}
        </div>
      </div>

      {/* Application Dialog */}
      {internship && (
        <ProfileSummaryDialog
          isOpen={showApplicationDialog}
          onClose={() => setShowApplicationDialog(false)}
          internship={internship}
          onSuccess={() => {
            markAsApplied();
            setShowSuccessDialog(true);
          }}
        />
      )}

      {/* Success Dialog */}
      <ApplicationSuccessDialog isOpen={showSuccessDialog} onClose={() => setShowSuccessDialog(false)} />

      {/* Share Dialog */}
      {internship && (
        <ShareDialog
          isOpen={showShareDialog}
          onClose={() => setShowShareDialog(false)}
          title={internship.title}
          url={window.location.href}
        />
      )}
    </div>
  );
};

export default InternshipDetail;
