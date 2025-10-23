import { useProfileCompletion } from "@/hooks/useProfileCompletion";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Navbar from "@/components/Navbar";
import {
  Mail,
  Phone,
  MapPin,
  Trash2,
  X,
  Sparkle,
  Pencil,
  Pen,
  CircleCheckBig,
  CircleX,
  Camera,
} from "lucide-react";
import { useProfileData } from "@/hooks/useProfileData";
import { AvatarUploadDialog } from "@/components/AvatarUploadDialog";
import { useState } from "react";
import { PersonalDetailsDialog } from "@/components/profile/PersonalDetailsDialog";
import { SkillsDialog } from "@/components/profile/SkillsDialog";
import { EducationDialog } from "@/components/profile/EducationDialog";
import { ProjectDialog } from "@/components/profile/ProjectDialog";
import { CourseDialog } from "@/components/profile/CourseDialog";
import { InterestDialog } from "@/components/profile/InterestDialog";
import { InternshipDialog } from "@/components/profile/InternshipDialog";
import { ProfileSummaryDialog } from "@/components/profile/ProfileSummaryDialog";
import { format, formatDistanceToNow } from "date-fns";
import { CircularProgress } from "@/components/CircularProgress";
import { LinkDialog } from "@/components/profile/LinkDialog";
import AIEditIcon from "@/components/ui/custom-icons";

const Profile = () => {
  const { user } = useAuth();
  const {
    profile,
    studentProfile,
    loading,
    updateProfile,
    updateStudentProfile,
    addEducationEntry,
    addProjectEntry,
    addCourseEntry,
    addLanguageEntry,
    addLinkEntry,
    addInternshipEntry,
    updateInterests,
    updateCoverLetter,
    parseJsonField,
    removeEducationEntry,
    removeProjectEntry,
    removeCourseEntry,
    removeLanguageEntry,
    removeLinkEntry,
    removeInternshipEntry,
    removeInterest,
    removeSkill,
    refetch,
  } = useProfileData();

  const [isAvatarDialogOpen, setIsAvatarDialogOpen] = useState(false);
  const profileCompletion = useProfileCompletion({ profile, studentProfile });

  const handleAvatarUploadSuccess = () => {
    refetch?.();
  };

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

  const quickLinks = [
    { name: "Profile Summary", action: "Update" },
    { name: "Courses", action: "Add" },
    { name: "Key Skills", action: "" },
    { name: "Education", action: "" },
    { name: "Projects", action: "Add" },
    { name: "Interests", action: "Add" },
    { name: "Internships", action: "Add" },
    { name: "Personal Details", action: "Add" },
  ];

  const renderProficiencyDots = (level: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <div
        key={i}
        className={`w-2 h-2 rounded-full ${
          i < level ? "bg-primary" : "bg-muted"
        }`}
      />
    ));
  };

  // Safe data extraction
  const skills = parseJsonField(studentProfile?.skills, []);
  const education = parseJsonField(studentProfile?.education, []);
  const projects = parseJsonField(studentProfile?.projects, []);
  const newInterests = parseJsonField(studentProfile?.interests, []);

  const interests = newInterests.filter(
    (i) => i !== "No Ideas" && i !== "I want to explore"
  );
  const languages = parseJsonField(studentProfile?.languages, []);
  const completedCourses = parseJsonField(
    studentProfile?.completed_courses,
    []
  );

  const internships = parseJsonField((studentProfile as any)?.internships, []);

  const links = parseJsonField(studentProfile?.links, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Background */}
      <div className="relative h-72 bg-gradient-to-r from-primary to-primary-foreground">
        <div className="absolute inset-0 bg-black/20" />
      </div>

      <div className="px-28 -mt-36 mb-6 relative z-1">
        {/* Profile Header */}
        <Card className="mb-2 h-[185px] border-gray-200 bg-white rounded-3xl">
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
                      src={(studentProfile as any)?.avatar_url || ""}
                    />
                    <AvatarFallback className="text-lg bg-primary text-primary-foreground">
                      {profile?.full_name?.charAt(0) ||
                        user?.email?.charAt(0).toUpperCase()}
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
                    {profile?.full_name.toLocaleUpperCase() || "Student Name"}
                  </h1>
                  {profile && (
                    <>
                      <PersonalDetailsDialog
                        profile={profile}
                        studentProfile={studentProfile}
                        onUpdate={updateProfile}
                        onUpdateStudent={updateStudentProfile}
                      >
                        <Pen className="w-4 h-4 text-gray-500 cursor-pointer hover:text-primary" />
                      </PersonalDetailsDialog>
                    </>
                  )}
                </div>
                <p className="text-muted-foreground mb-2">
                  {profile?.role === "student"
                    ? studentProfile.headline
                    : profile?.role || "User"}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Mail className="w-4 h-4" />
                    <span>
                      {profile?.email || user?.email || "No email provided"}
                    </span>
                  </div>
                  {profile?.phone && (
                    <div className="flex items-center space-x-1">
                      <Phone className="w-4 h-4" />
                      <span>{profile.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>
                      {studentProfile?.location
                        ? studentProfile.location[0].toLocaleUpperCase() +
                          studentProfile.location.slice(1)
                        : "Location not provided"}
                    </span>
                  </div>
                </div>
                <p className="text-muted-foreground text-sm text-gray-400 mt-2.5">
                  {`Last updated - ${
                    studentProfile.updated_at
                      ? formatDistanceToNow(
                          new Date(studentProfile.updated_at),
                          {
                            addSuffix: true,
                          }
                        )
                      : "recently"
                  }`}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="grid lg:grid-cols-4 gap-2">
          {/* Left Sidebar - Quick Links */}
          <div className="lg:col-span-1">
            <Card className="rounded-3xl border-gray-200">
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
                <div className="space-y-3 text-sm">
                  {/* Profile Summary */}
                  <div className="flex items-center justify-between">
                    <span>Profile Summary</span>
                    <ProfileSummaryDialog
                      summary={studentProfile?.cover_letter || ""}
                      onSave={updateCoverLetter}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-primary p-0 h-auto"
                      >
                        Update
                      </Button>
                    </ProfileSummaryDialog>
                  </div>
                  {/* Courses */}
                  <div className="flex items-center justify-between">
                    <span>Courses</span>
                    <CourseDialog onSave={addCourseEntry}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-primary p-0 h-auto"
                      >
                        Add
                      </Button>
                    </CourseDialog>
                  </div>
                  {/* Key Skills */}
                  <div className="flex items-center justify-between">
                    <span>Key Skills</span>
                    <SkillsDialog
                      studentProfile={studentProfile}
                      onUpdate={updateStudentProfile}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-primary p-0 h-auto"
                      >
                        Add
                      </Button>
                    </SkillsDialog>
                  </div>
                  {/* Education */}
                  <div className="flex items-center justify-between">
                    <span>Education</span>
                    <EducationDialog onSave={addEducationEntry}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-primary p-0 h-auto"
                      >
                        Add
                      </Button>
                    </EducationDialog>
                  </div>
                  {/* Projects */}
                  <div className="flex items-center justify-between">
                    <span>Projects</span>
                    <ProjectDialog onSave={addProjectEntry}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-primary p-0 h-auto"
                      >
                        Add
                      </Button>
                    </ProjectDialog>
                  </div>
                  {/* Interests */}
                  <div className="flex items-center justify-between">
                    <span>Interests</span>
                    <InterestDialog
                      interests={interests.filter(
                        (i) => i !== "No Ideas" && i !== "I want to explore"
                      )}
                      onSave={updateInterests}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-primary p-0 h-auto"
                      >
                        Add
                      </Button>
                    </InterestDialog>
                  </div>
                  {/* Internships */}
                  <div className="flex items-center justify-between">
                    <span>Internships</span>
                    <InternshipDialog onSave={addInternshipEntry}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-primary p-0 h-auto"
                      >
                        Add
                      </Button>
                    </InternshipDialog>
                  </div>
                  {/* Personal Details */}
                  <div className="flex items-center justify-between">
                    <span>Personal Details</span>
                    <PersonalDetailsDialog
                      profile={profile}
                      studentProfile={studentProfile}
                      onUpdate={updateProfile}
                      onUpdateStudent={updateStudentProfile}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-primary p-0 h-auto"
                      >
                        Add
                      </Button>
                    </PersonalDetailsDialog>
                  </div>
                  {/* Languages */}
                  <div className="flex items-center justify-between">
                    <span>Languages</span>
                    <PersonalDetailsDialog
                      profile={profile}
                      studentProfile={studentProfile}
                      onUpdate={updateProfile}
                      onUpdateStudent={updateStudentProfile}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-primary p-0 h-auto"
                      >
                        Add
                      </Button>
                    </PersonalDetailsDialog>
                  </div>

                  {/* Links */}
                  <div className="flex items-center justify-between">
                    <span>Links</span>
                    <LinkDialog onSave={addInternshipEntry}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-primary p-0 h-auto"
                      >
                        Add
                      </Button>
                    </LinkDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-2">
            {/* Profile Summary */}
            <Card className="rounded-3xl border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="text-lg font-semibold">Profile Summary</h3>
                  <ProfileSummaryDialog
                    summary={studentProfile?.cover_letter || ""}
                    onSave={updateCoverLetter}
                  >
                    <Pen className="w-4 h-4 text-gray-500 cursor-pointer hover:text-primary" />
                  </ProfileSummaryDialog>
                </div>
                <div className="border border-gray-400 rounded-2xl p-3 min-h-28">
                  <p className="text-muted-foreground">
                    {studentProfile?.cover_letter || (
                      <p className="flex pr-2 items-center gap-1">
                        <AIEditIcon />
                        Get AI assistance to write your Profile Summary
                      </p>
                    )}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Completed Courses */}
            <Card className="rounded-3xl border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Completed Courses</h3>
                  <CourseDialog onSave={addCourseEntry}>
                    <Button variant="ghost" size="sm" className="text-primary">
                      Add Completed Course
                    </Button>
                  </CourseDialog>
                </div>
                <div className="space-y-4">
                  {completedCourses.length > 0 ? (
                    completedCourses.map((course: any, index: number) => (
                      <div key={index}>
                        <div className="flex items-center justify-between  rounded-lg">
                          <div>
                            <h4 className="font-medium">
                              {course.title || "Course Title"}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {course.provider || "Provider"}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Completed on{" "}
                              {course.completion_date
                                ? format(
                                    new Date(course.completion_date),
                                    "MMM dd, yyyy"
                                  )
                                : "Date not specified"}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeCourseEntry(course.id)}
                              className="text-muted-foreground hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        {course.title !== completedCourses.at(-1).title ? (
                          <hr className="border-0.5 border-gray-200  mt-2.5" />
                        ) : undefined}
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground">
                      No completed courses yet. Add your first course!
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Key Skills */}
            <Card className="rounded-3xl border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="text-lg font-semibold">Key Skills</h3>
                  <SkillsDialog
                    studentProfile={studentProfile}
                    onUpdate={updateStudentProfile}
                  >
                    <Pen className="w-4 h-4 text-gray-500 cursor-pointer hover:text-primary" />
                  </SkillsDialog>
                </div>
                <div className="flex flex-wrap gap-2">
                  {skills.length > 0 ? (
                    skills.map((skill: string, index: number) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="px-4 py-2 border-gray-400 flex items-center gap-1 bg-transparent"
                      >
                        {skill}
                        {/* <X
                          className="w-3 h-3 cursor-pointer hover:text-destructive"
                          onClick={() => removeSkill(skill)}
                        /> */}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-muted-foreground">
                      No skills added yet. Click the edit icon to add your
                      skills!
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Education */}
            <Card className="rounded-3xl border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Education</h3>
                  <EducationDialog onSave={addEducationEntry}>
                    <Button variant="ghost" size="sm" className="text-primary">
                      Add Education
                    </Button>
                  </EducationDialog>
                </div>
                <div className="space-y-4">
                  {education.length > 0 ? (
                    education.map((edu: any, index: number) => (
                      <div
                        key={index}
                        className="flex items-center justify-between rounded-xl"
                      >
                        <div>
                          <h4 className="font-medium">
                            {edu.degree || "Degree"}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {edu.institution || "Institution"}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-sm">
                              {edu.start_year || "Start"} -{" "}
                              {edu.end_year || "Present"}
                            </p>
                            {edu.score && (
                              <p className="text-sm text-primary font-medium">
                                {edu.score} - CGPA
                              </p>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeEducationEntry(edu.id)}
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground">
                      No education details added yet.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Projects */}
            <Card className="rounded-3xl border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Projects</h3>
                  <ProjectDialog onSave={addProjectEntry}>
                    <Button variant="ghost" size="sm" className="text-primary">
                      Add Project
                    </Button>
                  </ProjectDialog>
                </div>
                {projects.length > 0 ? (
                  <div className="space-y-4">
                    {projects.map((project: any, index: number) => (
                      <div key={index} className="rounded-xl">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium">
                              {project.title || "Project Title"}
                            </h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              {project.description || "No description"}
                            </p>
                            {project.technologies &&
                              Array.isArray(project.technologies) &&
                              project.technologies.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {project.technologies.map(
                                    (tech: string, techIndex: number) => (
                                      <Badge
                                        key={techIndex}
                                        variant="outline"
                                        className="text-xs"
                                      >
                                        {tech}
                                      </Badge>
                                    )
                                  )}
                                </div>
                              )}
                            <p className="text-xs text-muted-foreground mt-2">
                              {project.start_date
                                ? format(
                                    new Date(project.start_date),
                                    "MMM yyyy"
                                  )
                                : "Start date"}{" "}
                              -{" "}
                              {project.end_date
                                ? format(new Date(project.end_date), "MMM yyyy")
                                : "Present"}
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
                    Stand out by adding details about the projects that you have
                    done so far.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Interests */}
            <Card className="rounded-3xl border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Interests</h3>
                  <InterestDialog
                    interests={interests}
                    onSave={updateInterests}
                  >
                    <Button variant="ghost" size="sm" className="text-primary">
                      Add Interest
                    </Button>
                  </InterestDialog>
                </div>
                {interests.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {interests.map((interest: string, index: number) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="px-4 py-2 flex items-center gap-1 border-gray-400"
                      >
                        {interest}
                        {/* <X
                          className="w-3 h-3 cursor-pointer hover:text-destructive"
                          onClick={() => removeInterest(interest)}
                        /> */}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    Stand out by telling about your interests.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Internships */}
            <Card className="rounded-3xl border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Internships</h3>
                  <InternshipDialog onSave={addInternshipEntry}>
                    <Button variant="ghost" size="sm" className="text-primary">
                      Add Internship
                    </Button>
                  </InternshipDialog>
                </div>
                {internships.length > 0 ? (
                  <div className="space-y-4">
                    {internships.map((internship: any, index: number) => (
                      <div key={index} className="rounded-lg">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium">
                              {internship.title || "Internship Title"}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {internship.company || "Company"}
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">
                              {internship.description || "No description"}
                            </p>
                            <p className="text-xs text-muted-foreground mt-2">
                              {internship.start_date
                                ? format(
                                    new Date(internship.start_date),
                                    "MMM yyyy"
                                  )
                                : "Start date"}{" "}
                              -
                              {internship.currently_working
                                ? " Present"
                                : internship.end_date
                                ? format(
                                    new Date(internship.end_date),
                                    "MMM yyyy"
                                  )
                                : " End date"}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeInternshipEntry(internship.id)}
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
                    No internships added yet. Add your internship experience!
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Personal Details */}
            <Card className="rounded-3xl border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="text-lg font-semibold">Personal Details</h3>
                  {profile && (
                    <PersonalDetailsDialog
                      profile={profile}
                      studentProfile={studentProfile}
                      onUpdate={updateProfile}
                      onUpdateStudent={updateStudentProfile}
                    >
                      <Pen className="w-4 h-4 text-gray-500 cursor-pointer hover:text-primary" />
                    </PersonalDetailsDialog>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Personal
                    </p>
                    <p className="font-medium">
                      {`${profile?.gender}, ${studentProfile?.marital_status}` ||
                        "Not specified"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Career Break
                    </p>
                    <p className="font-medium">
                      {studentProfile?.has_career_break ? "Yes" : "No"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Date Of Birth
                    </p>
                    <p className="font-medium">
                      {profile?.date_of_birth
                        ? format(new Date(profile.date_of_birth), "dd MMM yyyy")
                        : "Not provided"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Differently Abled
                    </p>
                    <p className="font-medium">
                      {studentProfile?.is_differently_abled ? "Yes" : "No"}{" "}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Languages */}
            <Card className="rounded-3xl border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Languages</h3>
                  <PersonalDetailsDialog
                    profile={profile}
                    studentProfile={studentProfile}
                    onUpdate={updateProfile}
                    onUpdateStudent={updateStudentProfile}
                  >
                    <Button variant="ghost" size="sm" className="text-primary">
                      Add Languages
                    </Button>
                  </PersonalDetailsDialog>
                </div>
                <div className="space-y-4">
                  {languages.length > 0 ? (
                    <>
                      <div className="grid grid-cols-5 gap-4 text-sm text-center text-muted-foreground mb-2">
                        <span className="flex self-start">Language</span>
                        {/* <span>Proficiency</span> */}
                        <span>Read</span>
                        <span>Write</span>
                        <span>Speak</span>
                        <span></span>
                      </div>

                      {languages.map((lang: any, index: number) => (
                        <div
                          key={index}
                          className="grid grid-cols-5 items-center rounded-lg"
                        >
                          <span className="font-medium">
                            {lang.name || "Language"}
                          </span>

                          <div className="flex justify-center items-center">
                            {lang.read ? (
                              <CircleCheckBig className="w-4 text-blue-500" />
                            ) : (
                              <CircleX className="w-4 text-red-500" />
                            )}
                          </div>
                          <div className="flex justify-center items-center">
                            {lang.write ? (
                              <CircleCheckBig className="w-4 text-blue-500" />
                            ) : (
                              <CircleX className="w-4 text-red-500" />
                            )}
                          </div>
                          <div className="flex justify-center items-center">
                            {lang.speak ? (
                              <CircleCheckBig className="w-4 text-blue-500" />
                            ) : (
                              <CircleX className="w-4 text-red-500" />
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeLanguageEntry(lang.id)}
                            className="text-muted-foreground hover:text-destructive justify-self-end"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </>
                  ) : (
                    <p className="text-muted-foreground">
                      No languages added yet.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* links */}
            <div className="mt-8">
              <Card className="rounded-3xl border-gray-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">Links</h2>
                    <LinkDialog
                      existingLinks={studentProfile.links || []}
                      onSave={addLinkEntry}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-primary"
                      >
                        Add Links
                      </Button>
                    </LinkDialog>
                  </div>

                  {studentProfile.links.length > 0 ? (
                    <div>
                      {studentProfile.links.map((link: any, index: number) => (
                        <div
                          key={index}
                          className="grid grid-cols-5 items-center mt-4"
                        >
                          <p className="font-medium">{link.platform}</p>
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:underline break-all grid col-span-3 border border-gray-400 rounded-xl px-3 py-2"
                          >
                            {link.url}
                          </a>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeLinkEntry(link.id)}
                            className="text-muted-foreground hover:text-destructive justify-self-end"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No links added yet.
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Avatar Upload Dialog */}
      {profile && studentProfile && (
        <AvatarUploadDialog
          isOpen={isAvatarDialogOpen}
          onClose={() => setIsAvatarDialogOpen(false)}
          currentAvatarUrl={(studentProfile as any)?.avatar_url}
          userId={profile.id}
          userName={profile.full_name}
          onSuccess={handleAvatarUploadSuccess}
        />
      )}
    </div>
  );
};

export default Profile;
