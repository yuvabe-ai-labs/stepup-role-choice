import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Clock, DollarSign, Bookmark, Share2, CheckCircle2, ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import ProfileSummaryDialog from "@/components/ProfileSummaryDialog";
import ApplicationSuccessDialog from "@/components/ApplicationSuccessDialog";
import { supabase } from "@/integrations/supabase/client";
import { useApplicationStatus } from "@/hooks/useApplicationStatus";
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
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showApplicationDialog, setShowApplicationDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  // const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { hasApplied, isLoading: isCheckingStatus, markAsApplied } = useApplicationStatus(id || "");

  useEffect(() => {
    const fetchInternship = async () => {
      if (!id) return;

      try {
        const { data, error } = await supabase.from("internships").select("*").eq("id", id).single();

        if (error) throw error;
        setInternship(data);
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

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Back Button */}
        <Button variant="ghost" className="mb-6 gap-2" onClick={() => navigate("/internships")}>
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>

        {/* Header Card */}
        <Card className="mb-6 border-2">
          <CardContent className="p-8">
            <div className="flex items-start justify-between gap-6">
              {/* Left Side - Company Logo & Info */}
              <div className="flex gap-6 flex-1">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-3xl text-white font-bold">{internship.company_name.charAt(0)}</span>
                </div>

                <div className="flex-1">
                  <h1 className="text-3xl font-bold mb-2">{internship.title}</h1>
                  <p className="text-lg text-muted-foreground mb-3">{internship.company_name}</p>

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
                <Button variant="outline" size="icon" className="rounded-full">
                  <Bookmark className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon" className="rounded-full">
                  <Share2 className="w-4 h-4" />
                </Button>
                <Button
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6"
                  disabled={hasApplied || isCheckingStatus}
                  onClick={() => setShowApplicationDialog(true)}
                >
                  {hasApplied ? "Applied" : "Apply Now"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="space-y-8">
          {/* About the Internship */}
          <section>
            <h2 className="text-2xl font-bold mb-4">About the Internship</h2>
            <p className="text-muted-foreground leading-relaxed">
              {internship.description || "No description available."}
            </p>
          </section>

          {/* Key Responsibilities */}
          {responsibilities.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-4">Key Responsibilities</h2>
              <ul className="space-y-3">
                {responsibilities.map((item: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Requirements from the Candidates */}
          {requirements.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-4">Requirements from the Candidates</h2>
              <ul className="space-y-3">
                {requirements.map((item: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* What You Will Get */}
          {benefits.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-4">What You Will Get</h2>
              <ul className="space-y-3">
                {benefits.map((item: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Required Skills */}
          {skillsRequired.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-4">Required Skills</h2>
              <div className="flex flex-wrap gap-2">
                {skillsRequired.map((skill: string, idx: number) => (
                  <Badge key={idx} variant="outline" className="px-4 py-2">
                    {skill}
                  </Badge>
                ))}
              </div>
            </section>
          )}

          {/* Ready to Apply */}
          <Card className="bg-muted/50 border-2">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Ready to Apply</h2>
                  <p className="text-muted-foreground">
                    Join {internship.company_name} and make a meaningful impact in {internship.location || "Auroville"}
                  </p>
                </div>
                <Button
                  className="bg-orange-500 hover:bg-orange-600 text-white px-8"
                  disabled={hasApplied || isCheckingStatus}
                  onClick={() => setShowApplicationDialog(true)}
                >
                  {hasApplied ? "Applied" : "Apply Now"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Company Info */}
          <Card className="border-2">
            <CardContent className="p-8">
              <div className="flex gap-6 items-start">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-3xl text-white font-bold">{internship.company_name.charAt(0)}</span>
                </div>

                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-2">{internship.company_name}</h2>
                  {internship.company_email && <p className="text-muted-foreground mb-3">{internship.company_email}</p>}
                  {internship.location && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mb-4">
                      <MapPin className="w-4 h-4" />
                      <span>{internship.location}</span>
                    </div>
                  )}

                  <h3 className="text-lg font-semibold mb-2">About the company</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {internship.company_description ||
                      `${internship.company_name} is a creative collective focused on sustainable design practices and conscious living solutions. We work with various Auroville units to create meaningful digital experiences that reflect the community's mission.`}
                  </p>
                </div>

                <Button
                  variant="outline"
                  className="border-orange-500 text-orange-500 hover:bg-orange-50"
                  onClick={() => {
                    // Navigate to company/unit page if it exists
                    toast({
                      title: "Coming Soon",
                      description: "Company profile page is under development.",
                    });
                  }}
                >
                  View Company Profile
                </Button>
              </div>
            </CardContent>
          </Card>
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
    </div>
  );
};

export default InternshipDetail;
