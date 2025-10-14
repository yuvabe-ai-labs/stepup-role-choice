import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Navbar from "@/components/Navbar";
import {
  Edit,
  Mail,
  Phone,
  MapPin,
  Globe,
  Trash2,
  X,
  Pencil,
  Building2,
} from "lucide-react";
import { useUnitProfileData } from "@/hooks/useUnitProfileData";
import { UnitDetailsDialog } from "@/components/unit/UnitDetailsDialog";
import { UnitDescriptionDialog } from "@/components/unit/UnitDescriptionDialog";
import { UnitProjectDialog } from "@/components/unit/UnitProjectDialog";
import { UnitValuesDialog } from "@/components/unit/UnitValuesDialog";
import { format } from "date-fns";
import { useEffect } from "react";

const UnitProfile = () => {
  const { user } = useAuth();
  const {
    profile,
    unitProfile,
    loading,
    updateProfile,
    updateUnitProfile,
    addProjectEntry,
    removeProjectEntry,
    updateValues,
    removeValue,
    parseJsonField,
  } = useUnitProfileData();

  // Log user IDs when data is retrieved
  useEffect(() => {
    if (!loading && (profile || user)) {
      console.log("=== Unit Profile Data Retrieved ===");
      console.log("Auth User ID:", user?.id);
      console.log("Auth User Email:", user?.email);
      console.log("Profile ID:", profile?.id);
      console.log("Profile User ID:", profile?.user_id);
      console.log("Profile Full Name:", profile?.full_name);
      console.log("Unit Profile ID:", unitProfile?.id);
      console.log("Unit Profile - Profile ID:", unitProfile?.profile_id);
      console.log("==============================");
    }
  }, [loading, profile, unitProfile, user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="relative h-48 bg-gradient-to-r from-primary to-primary-foreground">
          <div className="absolute inset-0 bg-black/20" />
        </div>
        <div className="container mx-auto px-4 -mt-24 relative z-10">
          <Card className="mb-8 bg-white">
            <CardContent className="p-6">
              <div className="flex items-start space-x-6">
                <Skeleton className="h-24 w-24 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-8 w-48" />
                  <Skeleton className="h-4 w-64" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Safe data extraction
  const projects = parseJsonField(unitProfile?.projects, []);
  const values = parseJsonField(unitProfile?.values, []);
  const galleryImages = parseJsonField(unitProfile?.gallery_images, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Background */}
      <div className="relative h-48 bg-gradient-to-r from-primary to-primary-foreground">
        {unitProfile?.cover_image_url && (
          <img
            src={unitProfile.cover_image_url}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black/20" />
      </div>

      <div className="container mx-auto px-24 -mt-24 mb-6 relative z-10">
        {/* Profile Header */}
        <Card className="mb-8 bg-white rounded-3xl">
          <CardContent className="p-6">
            <div className="flex items-start space-x-6">
              <Avatar className="h-24 w-24 ring-4 ring-white">
                <AvatarImage src={unitProfile?.logo_url || ""} />
                <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                  {unitProfile?.unit_name?.charAt(0) ||
                    profile?.full_name?.charAt(0) ||
                    user?.email?.charAt(0)?.toUpperCase() ||
                    "U"}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h1 className="text-2xl font-bold">
                    {unitProfile?.unit_name ||
                      profile?.full_name ||
                      "Unit Name"}
                  </h1>
                  {profile && (
                    <UnitDetailsDialog
                      profile={profile}
                      unitProfile={unitProfile}
                      onUpdate={updateProfile}
                      onUpdateUnit={updateUnitProfile}
                    >
                      <Pencil className="w-4 h-4 text-muted-foreground cursor-pointer hover:text-primary" />
                    </UnitDetailsDialog>
                  )}
                </div>
                <p className="text-muted-foreground mb-2">
                  {unitProfile?.unit_type || "Organization"} •{" "}
                  {unitProfile?.industry || "Industry"}
                </p>

                {/* About Us description without title */}
                <div className="mb-4 flex items-start gap-2">
                  <p className="text-sm text-muted-foreground flex-1">
                    {unitProfile?.description ||
                      "Tell the world about your organization - what you do, who you serve, and what makes you unique."}
                  </p>
                  <UnitDescriptionDialog
                    description={unitProfile?.description || ""}
                    onSave={(description) => updateUnitProfile({ description })}
                    title="Edit About Us"
                  >
                    <Pencil className="w-3 h-3 text-muted-foreground cursor-pointer hover:text-primary flex-shrink-0 mt-0.5" />
                  </UnitDescriptionDialog>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Mail className="w-4 h-4" />
                    <span>
                      {unitProfile?.contact_email ||
                        profile?.email ||
                        user?.email ||
                        "No email provided"}
                    </span>
                  </div>
                  {unitProfile?.contact_phone && (
                    <div className="flex items-center space-x-1">
                      <Phone className="w-4 h-4" />
                      <span>{unitProfile.contact_phone}</span>
                    </div>
                  )}
                  {unitProfile?.address && (
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{unitProfile.address}</span>
                    </div>
                  )}
                  {unitProfile?.website_url && (
                    <div className="flex items-center space-x-1">
                      <Globe className="w-4 h-4" />
                      <a
                        href={unitProfile.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-primary"
                      >
                        Website
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Quick Links */}
          <div className="lg:col-span-1">
            <Card className="rounded-3xl">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Quick Links</h3>
                <div className="space-y-3 text-sm">
                  {/* Unit Details */}
                  <div className="flex items-center justify-between">
                    <span>Unit Details</span>
                    <UnitDetailsDialog
                      profile={profile}
                      unitProfile={unitProfile}
                      onUpdate={updateProfile}
                      onUpdateUnit={updateUnitProfile}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-primary p-0 h-auto"
                      >
                        Edit
                      </Button>
                    </UnitDetailsDialog>
                  </div>

                  {/* About Us */}
                  <div className="flex items-center justify-between">
                    <span>About Us</span>
                    <UnitDescriptionDialog
                      description={unitProfile?.description || ""}
                      onSave={(description) =>
                        updateUnitProfile({ description })
                      }
                      title="Edit About Us"
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-primary p-0 h-auto"
                      >
                        Edit
                      </Button>
                    </UnitDescriptionDialog>
                  </div>

                  {/* Mission */}
                  <div className="flex items-center justify-between">
                    <span>Mission</span>
                    <UnitDescriptionDialog
                      description={unitProfile?.mission || ""}
                      onSave={(mission) => updateUnitProfile({ mission })}
                      title="Edit Mission"
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-primary p-0 h-auto"
                      >
                        Edit
                      </Button>
                    </UnitDescriptionDialog>
                  </div>

                  {/* Values */}
                  <div className="flex items-center justify-between mt-4">
                    <span>Values</span>
                    <UnitDescriptionDialog
                      description={unitProfile?.values || ""}
                      onSave={(values) => updateUnitProfile({ values })}
                      title="Edit Values"
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-primary p-0 h-auto"
                      >
                        Edit
                      </Button>
                    </UnitDescriptionDialog>
                  </div>

                  {/* Projects */}
                  <div className="flex items-center justify-between">
                    <span>Projects</span>
                    <UnitProjectDialog onSave={addProjectEntry}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-primary p-0 h-auto"
                      >
                        Add
                      </Button>
                    </UnitProjectDialog>
                  </div>

                  {/* Gallery */}
                  <div className="flex items-center justify-between">
                    <span>Gallery</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-primary p-0 h-auto"
                      disabled
                    >
                      Add
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Mission */}
            <Card className="rounded-3xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Mission</h3>
                  <UnitDescriptionDialog
                    description={unitProfile?.mission || ""}
                    onSave={(mission) => updateUnitProfile({ mission })}
                    title="Edit Mission"
                  >
                    <Pencil className="w-4 h-4 text-muted-foreground cursor-pointer hover:text-primary" />
                  </UnitDescriptionDialog>
                </div>
                <div className="border rounded-xl p-4 min-h-[100px]">
                  <p className="text-muted-foreground whitespace-pre-wrap">
                    {unitProfile?.mission ||
                      "Define your organization's mission statement - the purpose and primary objectives that drive your work."}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Values */}
            {/* <Card className="rounded-3xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Values</h3>
                  <UnitValuesDialog values={values} onSave={updateValues}>
                    <Pencil className="w-4 h-4 text-muted-foreground cursor-pointer hover:text-primary" />
                  </UnitValuesDialog>
                </div>
                <div className="flex flex-wrap gap-2">
                  {values.length > 0 ? (
                    values.map((value: string, index: number) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="px-3 py-1 flex items-center gap-1"
                      >
                        {value}
                        <X
                          className="w-3 h-3 cursor-pointer hover:text-destructive"
                          onClick={() => removeValue(value)}
                        />
                      </Badge>
                    ))
                  ) : (
                    <p className="text-muted-foreground">
                      Add the core values that guide your organization's work
                      and culture.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card> */}

            {/* Values */}
            <Card className="rounded-3xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Values</h3>
                  <UnitDescriptionDialog
                    description={unitProfile?.values || ""}
                    onSave={(values) => updateUnitProfile({ values })}
                    title="Edit Values"
                  >
                    <Pencil className="w-4 h-4 text-muted-foreground cursor-pointer hover:text-primary" />
                  </UnitDescriptionDialog>
                </div>
                <div className="border rounded-xl p-4 min-h-[100px]">
                  <p className="text-muted-foreground whitespace-pre-wrap">
                    {unitProfile?.values ||
                      "Describe the principles and ethics that define your organization's culture and decisions."}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Projects */}
            <Card className="rounded-3xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Projects</h3>
                  <UnitProjectDialog onSave={addProjectEntry}>
                    <Button variant="ghost" size="sm" className="text-primary">
                      Add Project
                    </Button>
                  </UnitProjectDialog>
                </div>

                {projects.length > 0 ? (
                  <div className="space-y-4">
                    {projects.map((project: any, index: number) => (
                      <div
                        key={index}
                        className="p-4 border border-border rounded-xl"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            {/* Project Name */}
                            <h4 className="font-semibold text-base text-foreground">
                              {project.project_name || "Untitled Project"}
                            </h4>

                            {/* Client Name */}
                            {project.client_name && (
                              <p className="text-sm text-muted-foreground mt-0.5">
                                {project.client_name}
                              </p>
                            )}

                            {/* Description */}
                            {/* {project.description && (
                              <p className="text-sm text-muted-foreground mt-2">
                                {project.description}
                              </p>
                            )} */}

                            {/* Status + Completion Date */}
                            <p className="text-xs text-muted-foreground mt-2">
                              {/* Status:{" "} */}
                              <span className="capitalize">
                                {project.status}
                              </span>
                              {project.status === "Completed" &&
                                project.completion_date && (
                                  <>
                                    {" "}
                                    • Completed on{" "}
                                    {new Date(
                                      project.completion_date
                                    ).toLocaleDateString()}
                                  </>
                                )}
                            </p>
                          </div>

                          {/* Delete Button */}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeProjectEntry(project.id)}
                            className="text-muted-foreground hover:text-destructive ml-2"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    Showcase the projects and initiatives your organization has
                    worked on.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Gallery */}
            <Card className="rounded-3xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Gallery</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-primary"
                    disabled
                  >
                    Add Images
                  </Button>
                </div>
                {galleryImages.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {galleryImages.map((image: string, index: number) => (
                      <div
                        key={index}
                        className="relative aspect-square rounded-lg overflow-hidden border border-border"
                      >
                        <img
                          src={image}
                          alt={`Gallery image ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Building2 className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">
                      Add photos to showcase your organization's work, events,
                      and team.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnitProfile;
