import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import Navbar from "@/components/Navbar";
import {
  Mail,
  Phone,
  MapPin,
  Globe,
  Trash2,
  X,
  Pencil,
  Building2,
  ZoomIn,
  Video,
  ExternalLink,
  Link,
  Plus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useUnitProfileData } from "@/hooks/useUnitProfileData";
import { UnitDetailsDialog } from "@/components/unit/UnitDetailsDialog";
import { UnitDescriptionDialog } from "@/components/unit/UnitDescriptionDialog";
import { UnitProjectDialog } from "@/components/unit/UnitProjectDialog";
import { UnitSocialLinksDialog } from "@/components/unit/UnitSocialLinksDialog";
import { GalleryDialog } from "@/components/GalleryDialog";
import { GlimpseDialog } from "@/components/GlimpseDialog";
import { useEffect, useState, useRef } from "react";
import { CircularProgress } from "@/components/CircularProgress";
import { useUnitProfileCompletion } from "@/hooks/useUnitProfileCompletion";
import { ImageUploadDialog } from "@/components/ImageUploadDialog";
import { Camera } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

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
    updateSocialLinks,
    removeSocialLink,
    parseJsonField,
    refetch,
  } = useUnitProfileData();

  const [isAvatarDialogOpen, setIsAvatarDialogOpen] = useState(false);
  const [isBannerDialogOpen, setIsBannerDialogOpen] = useState(false);
  const [isGalleryDialogOpen, setIsGalleryDialogOpen] = useState(false);
  const [isGlimpseDialogOpen, setIsGlimpseDialogOpen] = useState(false);
  const [viewImage, setViewImage] = useState<string | null>(null);

  const profileCompletion = useUnitProfileCompletion({ profile, unitProfile });
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!loading && (profile || user)) {
      console.log("=== Unit Profile Data Retrieved ===");
      console.log("Auth User ID:", user?.id);
      console.log("Profile ID:", profile?.id);
      console.log("Profile Completion:", profileCompletion + "%");
      console.log("==============================");
    }
  }, [loading, profile, unitProfile, user, profileCompletion]);

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

  const projects = parseJsonField(unitProfile?.projects, []);
  const galleryImages = parseJsonField(unitProfile?.gallery_images, []);
  const socialLinks = parseJsonField(unitProfile?.social_links, []);
  const glimpseUrl = (unitProfile as any)?.glimpse || null;

  const handleImageUploadSuccess = () => {
    refetch();
  };

  const handleGallerySuccess = () => {
    refetch();
  };

  const handleGlimpseSuccess = () => {
    refetch();
  };

  const handleSocialLinksSave = async (links: any[]) => {
    await updateSocialLinks(links);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Background - Banner */}
      <div className="relative h-48 bg-gradient-to-r from-primary to-primary-foreground group">
        {(unitProfile as any)?.banner_url ? (
          <img
            src={(unitProfile as any).banner_url}
            alt="Banner"
            className="w-full h-full object-cover"
          />
        ) : unitProfile?.cover_image_url ? (
          <img
            src={unitProfile.cover_image_url}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-black/20" />
        )}
        <button
          onClick={() => setIsBannerDialogOpen(true)}
          className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Camera className="w-5 h-5" />
        </button>
      </div>

      <div className="container mx-auto px-24 -mt-24 mb-6 relative z-10">
        {/* Profile Header */}
        <Card className="mb-4 bg-white rounded-3xl">
          <CardContent className="p-6">
            <div className="flex items-start space-x-6">
              <div className="relative group">
                <CircularProgress
                  percentage={profileCompletion}
                  size={90}
                  strokeWidth={3}
                >
                  <Avatar className="h-20 w-20">
                    <AvatarImage
                      src={
                        (unitProfile as any)?.avatar_url ||
                        unitProfile?.logo_url ||
                        ""
                      }
                    />
                    <AvatarFallback className="text-lg bg-primary text-primary-foreground">
                      {unitProfile?.unit_name?.charAt(0) ||
                        profile?.full_name?.charAt(0) ||
                        user?.email?.charAt(0)?.toUpperCase() ||
                        "U"}
                    </AvatarFallback>
                  </Avatar>
                </CircularProgress>
                <button
                  onClick={() => setIsAvatarDialogOpen(true)}
                  className="absolute bottom-0 right-0 bg-primary hover:bg-primary/90 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Camera className="w-3 h-3" />
                </button>
              </div>

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

        <div className="grid lg:grid-cols-4 gap-4">
          {/* Left Sidebar - Quick Links */}
          <div className="lg:col-span-1">
            <Card className="rounded-3xl">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Quick Links</h3>
                <div className="space-y-3 text-sm">
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

                  <div className="flex items-center justify-between">
                    <span>Glimpse</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-primary p-0 h-auto"
                      onClick={() => setIsGlimpseDialogOpen(true)}
                    >
                      {glimpseUrl ? "Edit" : "Add"}
                    </Button>
                  </div>

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

                  <div className="flex items-center justify-between">
                    <span>Social Links</span>
                    <UnitSocialLinksDialog
                      onSave={handleSocialLinksSave}
                      currentLinks={socialLinks}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-primary p-0 h-auto"
                      >
                        Manage
                      </Button>
                    </UnitSocialLinksDialog>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>Gallery</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-primary p-0 h-auto"
                      onClick={() => setIsGalleryDialogOpen(true)}
                    >
                      Manage
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-4">
            {/* Projects */}
            <Card className="rounded-3xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold">Projects</h3>
                  <UnitProjectDialog onSave={addProjectEntry}>
                    <Button variant="ghost" size="sm" className="text-primary">
                      Add Project
                    </Button>
                  </UnitProjectDialog>
                </div>

                {projects.length > 0 ? (
                  <div className="divide-y divide-border">
                    {projects.map((project: any, index: number) => (
                      <div key={index} className="py-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-base text-foreground">
                              {project.project_name || "Untitled Project"}
                            </h4>

                            {project.client_name && (
                              <p className="text-sm text-muted-foreground mt-0.5">
                                {project.client_name}
                              </p>
                            )}

                            <p className="text-xs text-muted-foreground mt-2">
                              {project.status === "Completed" &&
                              project.completion_date ? (
                                <>
                                  Completed on{" "}
                                  {new Date(
                                    project.completion_date
                                  ).toLocaleDateString()}
                                </>
                              ) : (
                                <span className="capitalize">
                                  {project.status}
                                </span>
                              )}
                            </p>
                          </div>

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
            {/* Mission */}
            <Card className="rounded-3xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    Mission
                    <UnitDescriptionDialog
                      description={unitProfile?.mission || ""}
                      onSave={(mission) => updateUnitProfile({ mission })}
                      title="Edit Mission"
                    >
                      <Pencil className="w-4 h-4 text-muted-foreground cursor-pointer hover:text-primary" />
                    </UnitDescriptionDialog>
                  </h3>
                </div>
                <div className="rounded-xl min-h-[100px]">
                  <p className="text-muted-foreground whitespace-pre-wrap">
                    {unitProfile?.mission ||
                      "Define your organization's mission statement - the purpose and primary objectives that drive your work."}
                  </p>
                </div>
              </CardContent>
            </Card>
            {/* Values */}
            <Card className="rounded-3xl">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    Values
                    <UnitDescriptionDialog
                      description={unitProfile?.values || ""}
                      onSave={(values) => updateUnitProfile({ values })}
                      title="Edit Values"
                    >
                      <Pencil className="w-4 h-4 text-muted-foreground cursor-pointer hover:text-primary" />
                    </UnitDescriptionDialog>
                  </h3>
                </div>

                <div className="rounded-xl min-h-[100px]">
                  <p className="text-muted-foreground whitespace-pre-wrap">
                    {unitProfile?.values ||
                      "Describe the principles and ethics that define your organization's culture and decisions."}
                  </p>
                </div>
              </CardContent>
            </Card>
            {/* Social Links */}
            <Card className="rounded-3xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Social Links</h2>
                  <UnitSocialLinksDialog
                    onSave={handleSocialLinksSave}
                    currentLinks={socialLinks}
                  >
                    <Button variant="ghost" size="sm" className="text-primary">
                      Add Links
                    </Button>
                  </UnitSocialLinksDialog>
                </div>

                {socialLinks.length > 0 ? (
                  <div>
                    {socialLinks.map((link: any, index: number) => (
                      <div
                        key={index}
                        className="grid grid-cols-5 items-center mt-4"
                      >
                        <p className="font-medium capitalize">
                          {link.platform}
                        </p>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline break-all grid col-span-3 border rounded-xl px-3 py-2"
                        >
                          {link.url}
                        </a>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeSocialLink(link.id)}
                          className="text-muted-foreground hover:text-destructive justify-self-end"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No social links added yet.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Glimpse of the Unit */}
            <Card className="rounded-3xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className=" text-xl font-semibold flex items-center gap-2">
                    <Video className="w-5 h-5" />
                    Glimpse of the Unit
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-primary"
                    onClick={() => setIsGlimpseDialogOpen(true)}
                  >
                    {glimpseUrl ? "Edit Video" : "Add Video"}
                  </Button>
                </div>
                {glimpseUrl ? (
                  <div className="relative aspect-video bg-black rounded-xl overflow-hidden">
                    <video
                      src={glimpseUrl}
                      controls
                      controlsList="nodownload"
                      className="w-full h-full"
                      poster=""
                    >
                      Your browser does not support the video tag.
                    </video>
                  </div>
                ) : (
                  <div className="text-center py-12 border-2 border-dashed rounded-xl">
                    <Video className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">
                      Add a video to give visitors a glimpse of your
                      organization
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Gallery */}
            <Card className="rounded-3xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold">Gallery</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-primary"
                    onClick={() => setIsGalleryDialogOpen(true)}
                  >
                    {galleryImages.length > 0 ? "Manage Gallery" : "Add Images"}
                  </Button>
                </div>

                {galleryImages.length > 0 ? (
                  <div className="flex items-center space-x-4">
                    {/* Left Chevron outside */}
                    <button
                      onClick={() =>
                        scrollRef.current?.scrollBy({
                          left: -300,
                          behavior: "smooth",
                        })
                      }
                      className="bg-white border border-border rounded-full shadow-md p-2 hover:bg-accent"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>

                    {/* Scrollable Image Container */}
                    <div
                      ref={scrollRef}
                      className="flex overflow-x-auto space-x-4 scroll-smooth no-scrollbar"
                      style={{
                        scrollbarWidth: "none",
                        msOverflowStyle: "none",
                      }}
                    >
                      {galleryImages.map((image: string, index: number) => (
                        <div
                          key={index}
                          className="relative flex-shrink-0 w-64 h-64 rounded-lg overflow-hidden border border-border group cursor-pointer"
                          onClick={() => setViewImage(image)}
                        >
                          <img
                            src={image}
                            alt={`Gallery image ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <ZoomIn className="w-8 h-8 text-white" />
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Right Chevron outside */}
                    <button
                      onClick={() =>
                        scrollRef.current?.scrollBy({
                          left: 300,
                          behavior: "smooth",
                        })
                      }
                      className="bg-white border border-border rounded-full shadow-md p-2 hover:bg-accent"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
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

      {/* All Dialogs */}
      {profile && unitProfile && (
        <>
          <ImageUploadDialog
            isOpen={isAvatarDialogOpen}
            onClose={() => setIsAvatarDialogOpen(false)}
            currentImageUrl={
              (unitProfile as any)?.avatar_url || unitProfile.logo_url
            }
            userId={profile.id}
            userName={unitProfile.unit_name || profile.full_name}
            imageType="avatar"
            entityType="unit"
            onSuccess={handleImageUploadSuccess}
          />

          <ImageUploadDialog
            isOpen={isBannerDialogOpen}
            onClose={() => setIsBannerDialogOpen(false)}
            currentImageUrl={(unitProfile as any)?.banner_url}
            userId={profile.id}
            userName={unitProfile.unit_name || profile.full_name}
            imageType="banner"
            entityType="unit"
            onSuccess={handleImageUploadSuccess}
          />

          <GalleryDialog
            isOpen={isGalleryDialogOpen}
            onClose={() => setIsGalleryDialogOpen(false)}
            userId={profile.id}
            currentImages={galleryImages}
            onSuccess={handleGallerySuccess}
          />

          <GlimpseDialog
            isOpen={isGlimpseDialogOpen}
            onClose={() => setIsGlimpseDialogOpen(false)}
            userId={profile.id}
            currentGlimpseUrl={glimpseUrl}
            onSuccess={handleGlimpseSuccess}
          />
        </>
      )}

      {/* Image Viewer Dialog */}
      <Dialog open={!!viewImage} onOpenChange={() => setViewImage(null)}>
        <DialogContent className="sm:max-w-4xl">
          <div className="relative">
            <img
              src={viewImage || ""}
              alt="Full size preview"
              className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
            />
            <button
              onClick={() => setViewImage(null)}
              className="absolute top-2 right-2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UnitProfile;
