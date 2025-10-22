import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { X } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

interface ApplicationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  internship: Tables<"internships">;
  onSuccess: () => void;
}

interface ProfileData {
  full_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
}

interface StudentProfileData {
  education: any;
  experience_level: string;
  skills: any;
  languages: any;
  interests: any;
  projects: any;
  resume_url: string;
  portfolio_url: string;
  cover_letter: string;
}

const ApplicationDialog: React.FC<ApplicationDialogProps> = ({
  isOpen,
  onClose,
  internship,
  onSuccess,
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [studentProfileData, setStudentProfileData] =
    useState<StudentProfileData | null>(null);

  // Checkbox states - first 6 are disabled and checked, last 2 are optional
  const [includeResume, setIncludeResume] = useState(true);
  const [includePortfolio, setIncludePortfolio] = useState(true);

  // Fetch student profile data
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user || !isOpen) return;

      setIsLoading(true);
      try {
        // Fetch basic profile data
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name, email, phone, date_of_birth")
          .eq("user_id", user.id)
          .single();

        // Fetch student profile data
        const { data: studentProfile } = await supabase
          .from("student_profiles")
          .select(
            "education, experience_level, skills, languages, interests, projects, resume_url, portfolio_url, cover_letter"
          )
          .eq("profile_id", user.id)
          .single();

        setProfileData(profile);
        setStudentProfileData(studentProfile);
      } catch (error) {
        console.error("Error fetching profile data:", error);
        toast({
          title: "Error",
          description: "Failed to load your profile data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [user, isOpen, toast]);

  const handleSubmit = async () => {
    if (!user || !profileData || !studentProfileData) return;

    setIsSubmitting(true);
    try {
      // Create application record
      const applicationData = {
        student_id: user.id,
        internship_id: internship.id,
        status: "applied" as const,
        cover_letter: studentProfileData.cover_letter,
      };

      const { error } = await supabase
        .from("applications")
        .insert(applicationData);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your application has been submitted successfully!",
      });

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error submitting application:", error);
      toast({
        title: "Error",
        description: "Failed to submit your application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Not provided";
    return new Date(dateString).toLocaleDateString();
  };

  const formatArray = (arr: any[]) => {
    if (!arr || !Array.isArray(arr) || arr.length === 0) return "Not provided";
    return arr.join(", ");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold">
              Send Your Profile to the Unit
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh]">
          <div className="px-6 py-4 space-y-6">
            {isLoading ? (
              <div className="space-y-4">
                <div className="animate-pulse bg-gray-200 h-4 rounded w-3/4"></div>
                <div className="animate-pulse bg-gray-200 h-4 rounded w-1/2"></div>
                <div className="animate-pulse bg-gray-200 h-4 rounded w-2/3"></div>
              </div>
            ) : (
              <>
                {/* Basic Information */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Checkbox checked disabled />
                    <span className="text-sm">
                      Full Name: {profileData?.full_name || "Not provided"}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Checkbox checked disabled />
                    <span className="text-sm">
                      Email: {profileData?.email || "Not provided"}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Checkbox checked disabled />
                    <span className="text-sm">
                      Phone: {profileData?.phone || "Not provided"}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Checkbox checked disabled />
                    <span className="text-sm">
                      Date of Birth:{" "}
                      {formatDate(profileData?.date_of_birth || "")}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Checkbox checked disabled />
                    <span className="text-sm">
                      Skills: {formatArray(studentProfileData?.skills)}
                    </span>
                  </div>
                </div>

                <Separator />

                {/* Optional Items */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      checked={includeResume}
                      onCheckedChange={(checked) =>
                        setIncludeResume(checked === true)
                      }
                    />
                    <span className="text-sm">
                      Resume:{" "}
                      {studentProfileData?.resume_url
                        ? "Available"
                        : "Not uploaded"}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      checked={includePortfolio}
                      onCheckedChange={(checked) =>
                        setIncludePortfolio(checked === true)
                      }
                    />
                    <span className="text-sm">
                      Portfolio:{" "}
                      {studentProfileData?.portfolio_url
                        ? "Available"
                        : "Not uploaded"}
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
        </ScrollArea>

        <div className="px-6 py-4 border-t">
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || isLoading || !profileData}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white"
          >
            {isSubmitting ? "Sending Profile..." : "Send Profile"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ApplicationDialog;
