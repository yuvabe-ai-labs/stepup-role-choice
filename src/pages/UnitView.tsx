import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Mail, Phone, MapPin, Clock, GraduationCap, Play, Pencil } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useUnitView } from "@/hooks/useUnitView";
import ProfileSummaryDialog from "@/components/ProfileSummaryDialog";
import ApplicationSuccessDialog from "@/components/ApplicationSuccessDialog";
import type { Tables } from "@/integrations/supabase/types";

const safeParse = (data: any, fallback: any) => {
  if (!data) return fallback;
  try {
    return typeof data === "string" ? JSON.parse(data) : data;
  } catch {
    return fallback;
  }
};

const UnitView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { unit, internships, loading, error } = useUnitView(id || "");
  const [selectedInternship, setSelectedInternship] = useState<Tables<"internships"> | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const handleApply = (internship: Tables<"internships">) => {
    setSelectedInternship(internship);
    setIsDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Skeleton className="h-64 w-full rounded-2xl mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Skeleton className="h-96 w-full rounded-2xl" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-64 w-full rounded-2xl" />
              <Skeleton className="h-48 w-full rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !unit) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-7xl mx-auto px-6 py-8 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Unit Not Found</h1>
          <p className="text-muted-foreground mb-6">{error || "The unit you are looking for does not exist."}</p>
          <Button onClick={() => navigate("/units")}>Back to Units</Button>
        </div>
      </div>
    );
  }

  const recentProjects = safeParse(unit.projects, []);
  const values = safeParse(unit.values, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="h-48 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10">
          {unit.banner_url && <img src={unit.banner_url} alt={unit.unit_name} className="w-full h-full object-cover" />}
        </div>

        <div className="-mt-20 pt-0 p-20">
          {/* Hero Section with Unit Info */}
          <Card className="relative mb-8 overflow-hidden border-border bg-white rounded-3xl">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-start gap-6">
                {/* Unit Logo */}
                <div className="w-32 h-32 rounded-full bg-background border-4 border-background shadow-md flex items-center justify-center text-4xl font-bold text-foreground overflow-hidden">
                  {(unit as any).avatar_url ? (
                    <img src={(unit as any).avatar_url} alt={unit.unit_name} className="w-full h-full object-cover" />
                  ) : (
                    unit.unit_name.charAt(0)
                  )}
                </div>

                {/* Unit Details */}
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-foreground mb-2">{unit.unit_name}</h1>
                  <p className="text-muted-foreground mb-4 max-w-3xl">
                    {unit.description || "A unit focused on creating meaningful experiences."}
                  </p>

                  {/* Contact Info Row */}
                  <div className="flex flex-wrap gap-6 text-sm text-muted-foreground mb-4">
                    {unit.contact_email && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        <span>{unit.contact_email}</span>
                      </div>
                    )}
                    {unit.contact_phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        <span>{unit.contact_phone}</span>
                      </div>
                    )}
                    {unit.address && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{unit.address}</span>
                      </div>
                    )}
                  </div>

                  {/* Visit Website Button */}
                  {unit.website_url && (
                    <Button variant="outline" className="gap-2 rounded-full" asChild>
                      <a href={unit.website_url} target="_blank" rel="noopener noreferrer">
                        Visit Website
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Open Internship Positions */}
            <div className="lg:col-span-2 space-y-6">
              <div className="border p-8 rounded-3xl">
                <h2 className="text-2xl font-bold text-foreground mb-6">Open Internship Positions</h2>

                {internships.length === 0 ? (
                  <Card className="p-8 text-center border-border">
                    <p className="text-muted-foreground">No open positions at the moment.</p>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {internships.map((internship) => {
                      const skillsRequired = safeParse(internship.skills_required, []);

                      return (
                        <Card
                          key={internship.id}
                          className="border-border rounded-xl hover:shadow-md transition-shadow"
                        >
                          <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                              {/* Internship Icon */}
                              <div className="w-12 h-12 rounded-full bg-foreground text-background flex items-center justify-center flex-shrink-0">
                                <span className="text-lg font-bold">{internship.title.charAt(0)}</span>
                              </div>

                              {/* Internship Details */}
                              <div className="flex-1">
                                <div className="flex items-start justify-between mb-2">
                                  <div>
                                    <h3 className="text-lg font-semibold text-foreground mb-1">{internship.title}</h3>
                                    {internship.duration && (
                                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                        <Clock className="w-4 h-4" />
                                        <span>{internship.duration}</span>
                                      </div>
                                    )}
                                  </div>

                                  {/* Apply Now Button */}
                                  <Button
                                    className="bg-orange-500 hover:bg-orange-600 rounded-full text-white"
                                    onClick={() => handleApply(internship)}
                                  >
                                    Apply Now
                                  </Button>
                                </div>

                                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                                  {internship.description}
                                </p>

                                {/* Skills */}
                                {skillsRequired.length > 0 && (
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-sm font-medium text-foreground">Skills:</span>
                                    {skillsRequired.slice(0, 5).map((skill: string, idx: number) => (
                                      <span key={idx} className="text-xs text-muted-foreground">
                                        {skill}
                                        {idx < Math.min(skillsRequired.length, 5) - 1 && ","}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Recent Projects */}
              <Card className="border-border rounded-3xl">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-foreground mb-4">Recent Projects</h3>
                  {recentProjects.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No recent projects listed.</p>
                  ) : (
                    <ul className="space-y-3">
                      {recentProjects.map((project: any, idx: number) => {
                        // Derive a safe title for the project. Projects may be strings or objects with
                        // different field names depending on source. Avoid rendering raw objects.
                        const title =
                          typeof project === "string"
                            ? project
                            : project?.project_name ||
                              project?.projectName ||
                              project?.name ||
                              project?.client_name ||
                              JSON.stringify(project);

                        return (
                          <li key={idx} className="flex items-start gap-2 text-sm">
                            <GraduationCap className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                            <span className="text-foreground">{title}</span>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </CardContent>
              </Card>

              {/* Contact Info */}
              <Card className="border-border rounded-3xl">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-foreground mb-4">Contact Info</h3>
                  <div className="space-y-3">
                    {unit.contact_email && (
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-muted-foreground" />
                        <span className="text-sm text-foreground">{unit.contact_email}</span>
                      </div>
                    )}
                    {unit.contact_phone && (
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-muted-foreground" />
                        <span className="text-sm text-foreground">{unit.contact_phone}</span>
                      </div>
                    )}
                    {unit.address && (
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-muted-foreground" />
                        <span className="text-sm text-foreground">{unit.address}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Mission & Values Section */}
          <div className="mt-8 space-y-6">
            <Card className="border rounded-3xl">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-foreground mb-6">Mission & Values</h2>

                {/* Our Mission */}
                <div className="mb-6 border p-5 rounded-xl">
                  <h3 className="text-lg font-semibold text-foreground mb-3">Our Mission</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {unit.mission ||
                      "To create meaningful impact through innovative solutions and sustainable practices."}
                  </p>
                </div>
                {/* Our Values */}
                <div className="mb-6 border p-5 rounded-xl">
                  <h3 className="text-lg font-semibold text-foreground mb-3">Our Values</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {unit.values ||
                      "To create meaningful impact through innovative solutions and sustainable practices."}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Glimpse of the Unit */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <h3 className="text-xl font-bold">Glimpse of the Unit</h3>
                <Pencil className="w-4 h-4 text-muted-foreground cursor-pointer hover:text-primary" />
              </div>
              <div className="relative w-full aspect-video bg-muted rounded-lg overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Button variant="outline" size="lg" className="gap-2">
                    <Play className="w-5 h-5" />
                    Play Video
                  </Button>
                </div>
                {unit.image && <img src={unit.image} alt="Unit glimpse" className="w-full h-full object-cover" />}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Application Dialog */}
      {selectedInternship && (
        <ProfileSummaryDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          internship={selectedInternship}
          onSuccess={() => {
            setIsDialogOpen(false);
            setShowSuccessDialog(true);
          }}
        />
      )}

      {/* Success Dialog */}
      <ApplicationSuccessDialog
        isOpen={showSuccessDialog}
        onClose={() => {
          setShowSuccessDialog(false);
          setSelectedInternship(null);
        }}
      />
    </div>
  );
};

export default UnitView;
