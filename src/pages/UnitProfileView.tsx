import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Globe, Linkedin, Instagram, Facebook, Plus, Pencil, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type Unit = Tables<'units'>;
type Profile = Tables<'profiles'>;

interface UnitData {
  unit: Unit;
  profile: Profile;
}

const safeParse = (data: any, fallback: any) => {
  if (!data) return fallback;
  try {
    return typeof data === "string" ? JSON.parse(data) : data;
  } catch {
    return fallback;
  }
};

const UnitProfileView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<UnitData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUnitProfile = async () => {
      if (!id) {
        setError("Unit ID is required");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Fetch unit data
        const { data: unitData, error: unitError } = await supabase
          .from("units")
          .select("*")
          .eq("id", id)
          .single();

        if (unitError) throw unitError;
        if (!unitData) throw new Error("Unit not found");

        // Fetch profile data
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", unitData.profile_id)
          .single();

        if (profileError) throw profileError;
        if (!profileData) throw new Error("Profile not found");

        setData({
          unit: unitData,
          profile: profileData,
        });
      } catch (err: any) {
        console.error("Error fetching unit profile:", err);
        setError(err.message || "Failed to fetch unit profile");
      } finally {
        setLoading(false);
      }
    };

    fetchUnitProfile();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Skeleton className="h-8 w-32 mb-6" />
          <Skeleton className="h-64 w-full mb-8" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-7xl mx-auto px-6 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Unit Not Found</h1>
          <p className="text-muted-foreground mb-6">{error || "The unit profile could not be found."}</p>
          <Button onClick={() => navigate("/units")}>Back to Units</Button>
        </div>
      </div>
    );
  }

  const { unit, profile } = data;
  const focusAreas = safeParse(unit.focus_areas, []);
  const skillsOffered = safeParse(unit.skills_offered, []);
  const recentProjects = safeParse(unit.recent_projects, []);
  const values = safeParse(unit.values, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={() => navigate("/units")} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Quick Links */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Quick Links</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Unit Details</span>
                    <Button variant="ghost" size="sm" className="text-primary p-0 h-auto">
                      Update
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Mission</span>
                    <Button variant="ghost" size="sm" className="text-primary p-0 h-auto">
                      Add
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Values</span>
                    <Button variant="ghost" size="sm" className="text-primary p-0 h-auto">
                      Add
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Social Links</span>
                    <Button variant="ghost" size="sm" className="text-primary p-0 h-auto">
                      Add
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Glimpse of the Unit</span>
                    <Button variant="ghost" size="sm" className="text-primary p-0 h-auto">
                      Add
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Gallery</span>
                    <Button variant="ghost" size="sm" className="text-primary p-0 h-auto">
                      Add Image
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Profile Header Card */}
            <Card>
              <CardContent className="p-8">
                <div className="flex items-start gap-6">
                  <Avatar className="w-24 h-24 rounded-lg">
                    <AvatarImage src={unit.image || undefined} alt={unit.unit_name || profile.full_name} />
                    <AvatarFallback className="text-2xl rounded-lg">
                      {(unit.unit_name || profile.full_name).charAt(0)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h2 className="text-2xl font-bold">{unit.unit_name || profile.full_name}</h2>
                      <Pencil className="w-4 h-4 text-muted-foreground cursor-pointer hover:text-primary" />
                    </div>
                    <p className="text-muted-foreground mb-4">
                      {unit.description || "A leading organization focused on innovation and growth."}
                    </p>

                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      {unit.address && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span>{unit.address}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Projects */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold">Projects</h3>
                  <Button variant="link" className="text-primary">
                    Add Project
                  </Button>
                </div>
                <div className="space-y-4">
                  {recentProjects.length > 0 ? (
                    recentProjects.slice(0, 3).map((project: any, index: number) => (
                      <div key={index} className="flex items-center justify-between pb-4 border-b last:border-0">
                        <div>
                          <h4 className="font-semibold flex items-center gap-2">
                            {project.title || `Project ${index + 1}`}
                            <Pencil className="w-3 h-3 text-muted-foreground cursor-pointer" />
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {project.description || "Project description"}
                          </p>
                          {project.completion_date && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Completed on {project.completion_date}
                            </p>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground">No projects listed yet.</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Mission */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="text-xl font-bold">Mission</h3>
                  <Pencil className="w-4 h-4 text-muted-foreground cursor-pointer hover:text-primary" />
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {unit.mission ||
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse lorem vehicula consequat vivamus magna velit, finibus sed sodales dapibus sed, sodales fermentum lorem. Mauris dignissim tortor quis neque ultricies condimentum. Curabitur lobortis condimentum luctus neque, id venenatis tortor semper mauris a neque ultricies condimentum. Curabitur lobortis condimentum luctus neque, id venenatis tortor semper. Mauris dolor tellus, cursus nec porttitor facilisis sit amet condimentum tellus, cursus nec porttitor facilisis sit amet mauris."}
                </p>
              </CardContent>
            </Card>

            {/* Values */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="text-xl font-bold">Values</h3>
                  <Pencil className="w-4 h-4 text-muted-foreground cursor-pointer hover:text-primary" />
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {values.length > 0 ? (
                    <span>{values.join(", ")}</span>
                  ) : (
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse lorem vehicula consequat. Vivamus magna velit, finibus sed sodales dapibus sed, sodales fermentum lorem. Mauris dignissim tortor quis neque ultricies condimentum. Curabitur lobortis condimentum luctus neque, id venenatis tortor semper vestibulum ligula mauris vel neque."
                  )}
                </p>
              </CardContent>
            </Card>

            {/* Social Links */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold">Social Links</h3>
                  <Button variant="link" className="text-primary">
                    Add New link
                  </Button>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Website</span>
                    <Input
                      value={unit.website_url || ""}
                      placeholder="Enter website URL"
                      className="max-w-md"
                      readOnly
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">LinkedIn</span>
                    <Input placeholder="Enter LinkedIn URL" className="max-w-md" readOnly />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Behance</span>
                    <Input placeholder="Enter Behance URL" className="max-w-md" readOnly />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Facebook</span>
                    <Input placeholder="Enter Facebook URL" className="max-w-md" readOnly />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">X</span>
                    <Input placeholder="Enter X URL" className="max-w-md" readOnly />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Threads</span>
                    <Input placeholder="Enter Threads URL" className="max-w-md" readOnly />
                  </div>
                </div>
              </CardContent>
            </Card>

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
                  {unit.image && (
                    <img
                      src={unit.image}
                      alt="Unit glimpse"
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Gallery */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold">Gallery</h3>
                  <Button variant="link" className="text-primary">
                    Add Image
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Placeholder gallery items */}
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="relative aspect-square bg-muted rounded-lg overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Plus className="w-8 h-8 text-muted-foreground" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnitProfileView;
