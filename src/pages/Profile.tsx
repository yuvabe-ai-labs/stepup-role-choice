import { useProfileCompletion } from "@/hooks/useProfileCompletion";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Navbar from "@/components/Navbar";
import { Edit, Mail, Phone, MapPin, Plus, Trash2, X, Sparkle, Pencil } from "lucide-react";
import { useProfileData } from "@/hooks/useProfileData";
import { PersonalDetailsDialog } from "@/components/profile/PersonalDetailsDialog";
import { SkillsDialog } from "@/components/profile/SkillsDialog";
import { EducationDialog } from "@/components/profile/EducationDialog";
import { ProjectDialog } from "@/components/profile/ProjectDialog";
import { CourseDialog } from "@/components/profile/CourseDialog";
import { InterestDialog } from "@/components/profile/InterestDialog";
import { LanguageDialog } from "@/components/profile/LanguageDialog";
import { InternshipDialog } from "@/components/profile/InternshipDialog";
import { ProfileSummaryDialog } from "@/components/profile/ProfileSummaryDialog";
import { format } from "date-fns";
import { CircularProgress } from "@/components/CircularProgress";

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
    addInternshipEntry,
    updateInterests,
    updateCoverLetter,
    parseJsonField,
    removeEducationEntry,
    removeProjectEntry,
    removeCourseEntry,
    removeLanguageEntry,
    removeInternshipEntry,
    removeInterest,
    removeSkill,
  } = useProfileData();

  const profileCompletion = useProfileCompletion({ profile, studentProfile });

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
      <div key={i} className={`w-2 h-2 rounded-full ${i < level ? "bg-primary" : "bg-muted"}`} />
    ));
  };

  // Safe data extraction
  const skills = parseJsonField(studentProfile?.skills, []);
  const education = parseJsonField(studentProfile?.education, []);
  const projects = parseJsonField(studentProfile?.projects, []);
  const interests = parseJsonField(studentProfile?.interests, []);
  const languages = parseJsonField(studentProfile?.languages, []);
  const completedCourses = parseJsonField(studentProfile?.completed_courses, []);
  const internships = parseJsonField((studentProfile as any)?.internships, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Background */}
      <div className="relative h-48 bg-gradient-to-r from-primary to-primary-foreground">
        <div className="absolute inset-0 bg-black/20" />
      </div>

      <div className="container mx-auto px-24 -mt-24 mb-6 relative z-10">
        {/* Profile Header */}
        <Card className="mb-2 bg-white rounded-3xl">
          <CardContent className="p-6">
            <div className="flex items-start space-x-6">
              <CircularProgress percentage={profileCompletion} size={90} strokeWidth={3}>
                <Avatar className="h-20 w-20">
                  <AvatarImage src={(studentProfile as any)?.avatar_url || ""} />
                  <AvatarFallback className="text-lg bg-primary text-primary-foreground">
                    {profile?.full_name?.charAt(0) || user?.email?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </CircularProgress>
              {/* <Avatar className="h-24 w-24 ring-4 ring-white">
                <AvatarImage src="" />
                <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                  {profile?.full_name?.charAt(0) ||
                    user?.email?.charAt(0)?.toUpperCase() ||
                    "U"}
                </AvatarFallback>
              </Avatar> */}

              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h1 className="text-2xl font-bold">{profile?.full_name || "Student Name"}</h1>
                  {profile && (
                    <>
                      <PersonalDetailsDialog 
                        profile={profile} 
                        studentProfile={studentProfile}
                        onUpdate={updateProfile}
                        onUpdateStudent={updateStudentProfile}
                      >
                        <Edit className="w-4 h-4 text-muted-foreground cursor-pointer hover:text-primary" />
                      </PersonalDetailsDialog>
                    </>
                  )}
                </div>
                <p className="text-muted-foreground mb-4">
                  {profile?.role === "student" ? "Student" : profile?.role || "User"}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Mail className="w-4 h-4" />
                    <span>{profile?.email || user?.email || "No email provided"}</span>
                  </div>
                  {profile?.phone && (
                    <div className="flex items-center space-x-1">
                      <Phone className="w-4 h-4" />
                      <span>{profile.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{studentProfile.location || "Location not provided"}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="grid lg:grid-cols-4 gap-2">
          {/* Left Sidebar - Quick Links */}
          <div className="lg:col-span-1">
            <Card className="rounded-3xl">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Quick Links</h3>
                <div className="space-y-3 text-sm">
                  {/* Profile Summary */}
                  <div className="flex items-center justify-between">
                    <span>Profile Summary</span>
                    <ProfileSummaryDialog summary={studentProfile?.cover_letter || ""} onSave={updateCoverLetter}>
                      <Button variant="ghost" size="sm" className="text-primary p-0 h-auto">
                        Update
                      </Button>
                    </ProfileSummaryDialog>
                  </div>

                  {/* Courses */}
                  <div className="flex items-center justify-between">
                    <span>Courses</span>
                    <CourseDialog onSave={addCourseEntry}>
                      <Button variant="ghost" size="sm" className="text-primary p-0 h-auto">
                        Add
                      </Button>
                    </CourseDialog>
                  </div>

                  {/* Key Skills */}
                  <div className="flex items-center justify-between">
                    <span>Key Skills</span>
                    <SkillsDialog studentProfile={studentProfile} onUpdate={updateStudentProfile}>
                      <Button variant="ghost" size="sm" className="text-primary p-0 h-auto">
                        Edit
                      </Button>
                    </SkillsDialog>
                  </div>

                  {/* Education */}
                  <div className="flex items-center justify-between">
                    <span>Education</span>
                    <EducationDialog onSave={addEducationEntry}>
                      <Button variant="ghost" size="sm" className="text-primary p-0 h-auto">
                        Add
                      </Button>
                    </EducationDialog>
                  </div>

                  {/* Projects */}
                  <div className="flex items-center justify-between">
                    <span>Projects</span>
                    <ProjectDialog onSave={addProjectEntry}>
                      <Button variant="ghost" size="sm" className="text-primary p-0 h-auto">
                        Add
                      </Button>
                    </ProjectDialog>
                  </div>

                  {/* Interests */}
                  <div className="flex items-center justify-between">
                    <span>Interests</span>
                    <InterestDialog interests={interests} onSave={updateInterests}>
                      <Button variant="ghost" size="sm" className="text-primary p-0 h-auto">
                        Add
                      </Button>
                    </InterestDialog>
                  </div>

                  {/* Internships */}
                  <div className="flex items-center justify-between">
                    <span>Internships</span>
                    <InternshipDialog onSave={addInternshipEntry}>
                      <Button variant="ghost" size="sm" className="text-primary p-0 h-auto">
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
                      <Button variant="ghost" size="sm" className="text-primary p-0 h-auto">
                        Edit
                      </Button>
                    </PersonalDetailsDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-2">
            {/* Profile Summary */}
            <Card className="rounded-3xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Profile Summary</h3>
                  <ProfileSummaryDialog summary={studentProfile?.cover_letter || ""} onSave={updateCoverLetter}>
                    <Edit className="w-4 h-4 text-muted-foreground cursor-pointer hover:text-primary" />
                  </ProfileSummaryDialog>
                </div>
                <div className="border rounded-xl p-3 h-24">
                  <p className="text-muted-foreground">
                    {studentProfile?.cover_letter || (
                      <p>
                        <span className="pr-2">
                          <Sparkle className="inline w-3 " />
                          <Pencil className="inline w-4" />
                        </span>
                        Get AI assistance to write your Profile Summary
                      </p>
                    )}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Completed Courses */}
            <Card className="rounded-3xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Completed Courses</h3>
                  <CourseDialog onSave={addCourseEntry}>
                    <Button variant="ghost" size="sm" className="text-primary">
                      Add Completed Course
                    </Button>
                  </CourseDialog>
                </div>
                <div className="space-y-4">
                  {completedCourses.length > 0 ? (
                    completedCourses.map((course: any, index: number) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 border border-border rounded-lg"
                      >
                        <div>
                          <h4 className="font-medium">{course.title || "Course Title"}</h4>
                          <p className="text-sm text-muted-foreground">{course.provider || "Provider"}</p>
                          <p className="text-sm text-muted-foreground">
                            Completed on{" "}
                            {course.completion_date
                              ? format(new Date(course.completion_date), "MMM dd, yyyy")
                              : "Date not specified"}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            View
                          </Button>
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
                    ))
                  ) : (
                    <p className="text-muted-foreground">No completed courses yet. Add your first course!</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Key Skills */}
            <Card className="rounded-3xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Key Skills</h3>
                  <SkillsDialog studentProfile={studentProfile} onUpdate={updateStudentProfile}>
                    <Edit className="w-4 h-4 text-muted-foreground cursor-pointer hover:text-primary" />
                  </SkillsDialog>
                </div>
                <div className="flex flex-wrap gap-2">
                  {skills.length > 0 ? (
                    skills.map((skill: string, index: number) => (
                      <Badge key={index} variant="secondary" className="px-3 py-1 flex items-center gap-1">
                        {skill}
                        <X
                          className="w-3 h-3 cursor-pointer hover:text-destructive"
                          onClick={() => removeSkill(skill)}
                        />
                      </Badge>
                    ))
                  ) : (
                    <p className="text-muted-foreground">
                      No skills added yet. Click the edit icon to add your skills!
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Education */}
            <Card className="rounded-3xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Education</h3>
                  <EducationDialog onSave={addEducationEntry}>
                    <Button variant="ghost" size="sm" className="text-primary">
                      Add Education
                    </Button>
                  </EducationDialog>
                </div>
                <div className="space-y-4">
                  {education.length > 0 ? (
                    education.map((edu: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-xl">
                        <div>
                          <h4 className="font-medium">{edu.degree || "Degree"}</h4>
                          <p className="text-sm text-muted-foreground">{edu.institution || "Institution"}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-sm">
                              {edu.start_year || "Start"} - {edu.end_year || "Present"}
                            </p>
                            {edu.score && <p className="text-sm text-primary font-medium">{edu.score}</p>}
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
                    <p className="text-muted-foreground">No education details added yet.</p>
                  )}
                </div>
                {/* <div className="mt-4 space-y-2">
                  <Button variant="ghost" size="sm" className="text-primary">
                    Add Master/ Post-graduate
                  </Button>
                  <br />
                  <Button variant="ghost" size="sm" className="text-primary">
                    Add Doctorate/ PhD
                  </Button>
                </div> */}
              </CardContent>
            </Card>

            {/* Projects */}
            <Card className="rounded-3xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Projects</h3>
                  <ProjectDialog onSave={addProjectEntry}>
                    <Button variant="ghost" size="sm" className="text-primary">
                      Add Project
                    </Button>
                  </ProjectDialog>
                </div>
                {projects.length > 0 ? (
                  <div className="space-y-4">
                    {projects.map((project: any, index: number) => (
                      <div key={index} className="p-4 border border-border rounded-xl">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium">{project.title || "Project Title"}</h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              {project.description || "No description"}
                            </p>
                            {project.technologies &&
                              Array.isArray(project.technologies) &&
                              project.technologies.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {project.technologies.map((tech: string, techIndex: number) => (
                                    <Badge key={techIndex} variant="outline" className="text-xs">
                                      {tech}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            <p className="text-xs text-muted-foreground mt-2">
                              {project.start_date ? format(new Date(project.start_date), "MMM yyyy") : "Start date"} -{" "}
                              {project.end_date ? format(new Date(project.end_date), "MMM yyyy") : "Present"}
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
                    Stand out by adding details about the projects that you have done so far.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Interests */}
            <Card className="rounded-3xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Interests</h3>
                  <InterestDialog interests={interests} onSave={updateInterests}>
                    <Button variant="ghost" size="sm" className="text-primary">
                      Add Interest
                    </Button>
                  </InterestDialog>
                </div>
                {interests.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {interests.map((interest: string, index: number) => (
                      <Badge key={index} variant="outline" className="px-3 py-1 flex items-center gap-1">
                        {interest}
                        <X
                          className="w-3 h-3 cursor-pointer hover:text-destructive"
                          onClick={() => removeInterest(interest)}
                        />
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">Stand out by telling about your interests.</p>
                )}
              </CardContent>
            </Card>

            {/* Internships */}
            <Card className="rounded-3xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Internships</h3>
                  <InternshipDialog onSave={addInternshipEntry}>
                    <Button variant="ghost" size="sm" className="text-primary">
                      Add Internship
                    </Button>
                  </InternshipDialog>
                </div>
                {internships.length > 0 ? (
                  <div className="space-y-4">
                    {internships.map((internship: any, index: number) => (
                      <div key={index} className="p-4 border border-border rounded-lg">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium">{internship.title || "Internship Title"}</h4>
                            <p className="text-sm text-muted-foreground">{internship.company || "Company"}</p>
                            <p className="text-sm text-muted-foreground mt-1">
                              {internship.description || "No description"}
                            </p>
                            <p className="text-xs text-muted-foreground mt-2">
                              {internship.start_date
                                ? format(new Date(internship.start_date), "MMM yyyy")
                                : "Start date"}{" "}
                              -
                              {internship.currently_working
                                ? " Present"
                                : internship.end_date
                                  ? format(new Date(internship.end_date), "MMM yyyy")
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
                  <p className="text-muted-foreground">No internships added yet. Add your internship experience!</p>
                )}
              </CardContent>
            </Card>

            {/* Personal Details */}
            <Card className="rounded-3xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Personal Details</h3>
                  {profile && (
                    <>
                      <PersonalDetailsDialog 
                        profile={profile} 
                        studentProfile={studentProfile}
                        onUpdate={updateProfile}
                        onUpdateStudent={updateStudentProfile}
                      >
                        <>
                          <Edit className="w-4 h-4 text-muted-foreground cursor-pointer hover:text-primary" />
                        </>
                      </PersonalDetailsDialog>
                    </>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Gender</p>
                    <p className="font-medium">{profile?.gender || "Not specified"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Phone</p>
                    <p className="font-medium">{profile?.phone || "Not provided"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Date Of Birth</p>
                    <p className="font-medium">
                      {profile?.date_of_birth ? format(new Date(profile.date_of_birth), "dd MMM yyyy") : "Not provided"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Profile Type</p>
                    <p className="font-medium">{profile?.profile_type || "Not specified"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Languages */}
            <Card className="rounded-3xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Languages</h3>
                  <LanguageDialog onSave={addLanguageEntry}>
                    <Button variant="ghost" size="sm" className="text-primary">
                      Add Languages
                    </Button>
                  </LanguageDialog>
                </div>
                <div className="space-y-4">
                  {languages.length > 0 ? (
                    <>
                      <div className="grid grid-cols-6 gap-4 text-sm  text-muted-foreground mb-2">
                        <span>Language</span>
                        <span>Proficiency</span>
                        <span>Read</span>
                        <span>Write</span>
                        <span>Speak</span>
                        <span></span>
                      </div>
                      {languages.map((lang: any, index: number) => (
                        <div
                          key={index}
                          className="grid grid-cols-6 gap-4 items-center p-3 border border-border rounded-lg"
                        >
                          <span className="font-medium">{lang.name || "Language"}</span>
                          <div className="flex space-x-1">{renderProficiencyDots(lang.proficiency || 0)}</div>
                          <div className="flex space-x-1">{renderProficiencyDots(lang.read || 0)}</div>
                          <div className="flex space-x-1">{renderProficiencyDots(lang.write || 0)}</div>
                          <div className="flex space-x-1">{renderProficiencyDots(lang.speak || 0)}</div>
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
                    <p className="text-muted-foreground">No languages added yet.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

// import { useProfileCompletion } from "@/hooks/useProfileCompletion";
// import { useAuth } from "@/hooks/useAuth";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Badge } from "@/components/ui/badge";
// import { Skeleton } from "@/components/ui/skeleton";
// import Navbar from "@/components/Navbar";
// import { Edit, Mail, Phone, MapPin, Plus, Trash2, X, Sparkle, Pencil } from "lucide-react";
// import { useProfileData } from "@/hooks/useProfileData";
// import { PersonalDetailsDialog } from "@/components/profile/PersonalDetailsDialog";
// import { SkillsDialog } from "@/components/profile/SkillsDialog";
// import { EducationDialog } from "@/components/profile/EducationDialog";
// import { ProjectDialog } from "@/components/profile/ProjectDialog";
// import { CourseDialog } from "@/components/profile/CourseDialog";
// import { InterestDialog } from "@/components/profile/InterestDialog";
// import { LanguageDialog } from "@/components/profile/LanguageDialog";
// import { InternshipDialog } from "@/components/profile/InternshipDialog";
// import { ProfileSummaryDialog } from "@/components/profile/ProfileSummaryDialog";
// import { format } from "date-fns";
// import { CircularProgress } from "@/components/CircularProgress";

// const Profile = () => {
//   const { user } = useAuth();
//   const {
//     profile,
//     studentProfile,
//     loading,
//     updateProfile,
//     updateStudentProfile,
//     addEducationEntry,
//     addProjectEntry,
//     addCourseEntry,
//     addLanguageEntry,
//     addInternshipEntry,
//     updateInterests,
//     updateCoverLetter,
//     parseJsonField,
//     removeEducationEntry,
//     removeProjectEntry,
//     removeCourseEntry,
//     removeLanguageEntry,
//     removeInternshipEntry,
//     removeInterest,
//     removeSkill,
//   } = useProfileData();

//   const profileCompletion = useProfileCompletion({ profile, studentProfile });

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-background">
//         <Navbar />
//         <div className="relative h-48 bg-gradient-to-r from-primary to-primary-foreground">
//           <div className="absolute inset-0 bg-black/20" />
//         </div>
//         <div className="container mx-auto px-4 -mt-24 relative z-10">
//           <Card className="mb-8 bg-white">
//             <CardContent className="p-6">
//               <div className="flex items-start space-x-6">
//                 <Skeleton className="h-24 w-24 rounded-full" />
//                 <div className="flex-1 space-y-2">
//                   <Skeleton className="h-8 w-48" />
//                   <Skeleton className="h-4 w-64" />
//                   <Skeleton className="h-4 w-32" />
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     );
//   }

//   const quickLinks = [
//     { name: "Profile Summary", action: "Update" },
//     { name: "Courses", action: "Add" },
//     { name: "Key Skills", action: "" },
//     { name: "Education", action: "" },
//     { name: "Projects", action: "Add" },
//     { name: "Interests", action: "Add" },
//     { name: "Internships", action: "Add" },
//     { name: "Personal Details", action: "Add" },
//   ];

//   const renderProficiencyDots = (level: number) => {
//     return Array.from({ length: 5 }, (_, i) => (
//       <div key={i} className={`w-2 h-2 rounded-full ${i < level ? "bg-primary" : "bg-muted"}`} />
//     ));
//   };

//   // Safe data extraction
//   const skills = parseJsonField(studentProfile?.skills, []);
//   const education = parseJsonField(studentProfile?.education, []);
//   const projects = parseJsonField(studentProfile?.projects, []);
//   const interests = parseJsonField(studentProfile?.interests, []);
//   const languages = parseJsonField(studentProfile?.languages, []);
//   const completedCourses = parseJsonField(studentProfile?.completed_courses, []);
//   const internships = parseJsonField((studentProfile as any)?.internships, []);

//   return (
//     <div className="min-h-screen bg-background">
//       <Navbar />

//       {/* Hero Background */}
//       <div className="relative h-48 bg-gradient-to-r from-primary to-primary-foreground">
//         <div className="absolute inset-0 bg-black/20" />
//       </div>

//       <div className="container mx-auto px-24 -mt-24 mb-6 relative z-10">
//         {/* Profile Header */}
//         <Card className="mb-8 bg-white rounded-3xl">
//           <CardContent className="p-6">
//             <div className="flex items-start space-x-6">
//               <CircularProgress percentage={profileCompletion} size={90} strokeWidth={3}>
//                 <Avatar className="h-20 w-20">
//                   <AvatarImage src={(studentProfile as any)?.avatar_url || ""} />
//                   <AvatarFallback className="text-lg bg-primary text-primary-foreground">
//                     {profile?.full_name?.charAt(0) || user?.email?.charAt(0).toUpperCase()}
//                   </AvatarFallback>
//                 </Avatar>
//               </CircularProgress>
//               {/* <Avatar className="h-24 w-24 ring-4 ring-white">
//                 <AvatarImage src="" />
//                 <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
//                   {profile?.full_name?.charAt(0) ||
//                     user?.email?.charAt(0)?.toUpperCase() ||
//                     "U"}
//                 </AvatarFallback>
//               </Avatar> */}

//               <div className="flex-1">
//                 <div className="flex items-center space-x-2 mb-2">
//                   <h1 className="text-2xl font-bold">{profile?.full_name || "Student Name"}</h1>
//                   {profile && (
//                     <>
//                       <PersonalDetailsDialog profile={profile} onUpdate={updateProfile}>
//                         <Edit className="w-4 h-4 text-muted-foreground cursor-pointer hover:text-primary" />
//                       </PersonalDetailsDialog>
//                     </>
//                   )}
//                 </div>
//                 <p className="text-muted-foreground mb-4">
//                   {profile?.role === "student" ? "Student" : profile?.role || "User"}
//                 </p>

//                 <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
//                   <div className="flex items-center space-x-1">
//                     <Mail className="w-4 h-4" />
//                     <span>{profile?.email || user?.email || "No email provided"}</span>
//                   </div>
//                   {profile?.phone && (
//                     <div className="flex items-center space-x-1">
//                       <Phone className="w-4 h-4" />
//                       <span>{profile.phone}</span>
//                     </div>
//                   )}
//                   <div className="flex items-center space-x-1">
//                     <MapPin className="w-4 h-4" />
//                     <span>{studentProfile.location || "Location not provided"}</span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//         <div className="grid lg:grid-cols-4 gap-8">
//           {/* Left Sidebar - Quick Links */}
//           <div className="lg:col-span-1">
//             <Card className="rounded-3xl">
//               <CardContent className="p-6">
//                 <h3 className="font-semibold mb-4">Quick Links</h3>
//                 <div className="space-y-3 text-sm">
//                   {/* Profile Summary */}
//                   <div className="flex items-center justify-between">
//                     <span>Profile Summary</span>
//                     <ProfileSummaryDialog summary={studentProfile?.cover_letter || ""} onSave={updateCoverLetter}>
//                       <Button variant="ghost" size="sm" className="text-primary p-0 h-auto">
//                         Update
//                       </Button>
//                     </ProfileSummaryDialog>
//                   </div>

//                   {/* Courses */}
//                   <div className="flex items-center justify-between">
//                     <span>Courses</span>
//                     <CourseDialog onSave={addCourseEntry}>
//                       <Button variant="ghost" size="sm" className="text-primary p-0 h-auto">
//                         Add
//                       </Button>
//                     </CourseDialog>
//                   </div>

//                   {/* Key Skills */}
//                   <div className="flex items-center justify-between">
//                     <span>Key Skills</span>
//                     <SkillsDialog studentProfile={studentProfile} onUpdate={updateStudentProfile}>
//                       <Button variant="ghost" size="sm" className="text-primary p-0 h-auto">
//                         Edit
//                       </Button>
//                     </SkillsDialog>
//                   </div>

//                   {/* Education */}
//                   <div className="flex items-center justify-between">
//                     <span>Education</span>
//                     <EducationDialog onSave={addEducationEntry}>
//                       <Button variant="ghost" size="sm" className="text-primary p-0 h-auto">
//                         Add
//                       </Button>
//                     </EducationDialog>
//                   </div>

//                   {/* Projects */}
//                   <div className="flex items-center justify-between">
//                     <span>Projects</span>
//                     <ProjectDialog onSave={addProjectEntry}>
//                       <Button variant="ghost" size="sm" className="text-primary p-0 h-auto">
//                         Add
//                       </Button>
//                     </ProjectDialog>
//                   </div>

//                   {/* Interests */}
//                   <div className="flex items-center justify-between">
//                     <span>Interests</span>
//                     <InterestDialog interests={interests} onSave={updateInterests}>
//                       <Button variant="ghost" size="sm" className="text-primary p-0 h-auto">
//                         Add
//                       </Button>
//                     </InterestDialog>
//                   </div>

//                   {/* Internships */}
//                   <div className="flex items-center justify-between">
//                     <span>Internships</span>
//                     <InternshipDialog onSave={addInternshipEntry}>
//                       <Button variant="ghost" size="sm" className="text-primary p-0 h-auto">
//                         Add
//                       </Button>
//                     </InternshipDialog>
//                   </div>

//                   {/* Personal Details */}
//                   <div className="flex items-center justify-between">
//                     <span>Personal Details</span>
//                     <PersonalDetailsDialog profile={profile} onUpdate={updateProfile}>
//                       <Button variant="ghost" size="sm" className="text-primary p-0 h-auto">
//                         Edit
//                       </Button>
//                     </PersonalDetailsDialog>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>

//           {/* Main Content */}
//           <div className="lg:col-span-3 space-y-8">
//             {/* Profile Summary */}
//             <Card className="rounded-3xl">
//               <CardContent className="p-6">
//                 <div className="flex items-center justify-between mb-4">
//                   <h3 className="font-semibold">Profile Summary</h3>
//                   <ProfileSummaryDialog summary={studentProfile?.cover_letter || ""} onSave={updateCoverLetter}>
//                     <Edit className="w-4 h-4 text-muted-foreground cursor-pointer hover:text-primary" />
//                   </ProfileSummaryDialog>
//                 </div>
//                 <div className="border rounded-xl p-3 h-24">
//                   <p className="text-muted-foreground">
//                     {studentProfile?.cover_letter || (
//                       <p>
//                         <span className="pr-2">
//                           <Sparkle className="inline w-3 " />
//                           <Pencil className="inline w-4" />
//                         </span>
//                         Get AI assistance to write your Profile Summary
//                       </p>
//                     )}
//                   </p>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Completed Courses */}
//             <Card className="rounded-3xl">
//               <CardContent className="p-6">
//                 <div className="flex items-center justify-between mb-4">
//                   <h3 className="font-semibold">Completed Courses</h3>
//                   <CourseDialog onSave={addCourseEntry}>
//                     <Button variant="ghost" size="sm" className="text-primary">
//                       Add Completed Course
//                     </Button>
//                   </CourseDialog>
//                 </div>
//                 <div className="space-y-4">
//                   {completedCourses.length > 0 ? (
//                     completedCourses.map((course: any, index: number) => (
//                       <div
//                         key={index}
//                         className="flex items-center justify-between p-4 border border-border rounded-lg"
//                       >
//                         <div>
//                           <h4 className="font-medium">{course.title || "Course Title"}</h4>
//                           <p className="text-sm text-muted-foreground">{course.provider || "Provider"}</p>
//                           <p className="text-sm text-muted-foreground">
//                             Completed on{" "}
//                             {course.completion_date
//                               ? format(new Date(course.completion_date), "MMM dd, yyyy")
//                               : "Date not specified"}
//                           </p>
//                         </div>
//                         <div className="flex items-center gap-2">
//                           <Button variant="outline" size="sm">
//                             View
//                           </Button>
//                           <Button
//                             variant="ghost"
//                             size="sm"
//                             onClick={() => removeCourseEntry(course.id)}
//                             className="text-muted-foreground hover:text-destructive"
//                           >
//                             <Trash2 className="w-4 h-4" />
//                           </Button>
//                         </div>
//                       </div>
//                     ))
//                   ) : (
//                     <p className="text-muted-foreground">No completed courses yet. Add your first course!</p>
//                   )}
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Key Skills */}
//             <Card className="rounded-3xl">
//               <CardContent className="p-6">
//                 <div className="flex items-center justify-between mb-4">
//                   <h3 className="font-semibold">Key Skills</h3>
//                   <SkillsDialog studentProfile={studentProfile} onUpdate={updateStudentProfile}>
//                     <Edit className="w-4 h-4 text-muted-foreground cursor-pointer hover:text-primary" />
//                   </SkillsDialog>
//                 </div>
//                 <div className="flex flex-wrap gap-2">
//                   {skills.length > 0 ? (
//                     skills.map((skill: string, index: number) => (
//                       <Badge key={index} variant="secondary" className="px-3 py-1 flex items-center gap-1">
//                         {skill}
//                         <X
//                           className="w-3 h-3 cursor-pointer hover:text-destructive"
//                           onClick={() => removeSkill(skill)}
//                         />
//                       </Badge>
//                     ))
//                   ) : (
//                     <p className="text-muted-foreground">
//                       No skills added yet. Click the edit icon to add your skills!
//                     </p>
//                   )}
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Education */}
//             <Card className="rounded-3xl">
//               <CardContent className="p-6">
//                 <div className="flex items-center justify-between mb-4">
//                   <h3 className="font-semibold">Education</h3>
//                   <EducationDialog onSave={addEducationEntry}>
//                     <Button variant="ghost" size="sm" className="text-primary">
//                       Add Education
//                     </Button>
//                   </EducationDialog>
//                 </div>
//                 <div className="space-y-4">
//                   {education.length > 0 ? (
//                     education.map((edu: any, index: number) => (
//                       <div key={index} className="flex items-center justify-between p-4 border rounded-xl">
//                         <div>
//                           <h4 className="font-medium">{edu.degree || "Degree"}</h4>
//                           <p className="text-sm text-muted-foreground">{edu.institution || "Institution"}</p>
//                         </div>
//                         <div className="flex items-center gap-4">
//                           <div className="text-right">
//                             <p className="text-sm">
//                               {edu.start_year || "Start"} - {edu.end_year || "Present"}
//                             </p>
//                             {edu.score && <p className="text-sm text-primary font-medium">{edu.score}</p>}
//                           </div>
//                           <Button
//                             variant="ghost"
//                             size="sm"
//                             onClick={() => removeEducationEntry(edu.id)}
//                             className="text-muted-foreground hover:text-destructive"
//                           >
//                             <Trash2 className="w-4 h-4" />
//                           </Button>
//                         </div>
//                       </div>
//                     ))
//                   ) : (
//                     <p className="text-muted-foreground">No education details added yet.</p>
//                   )}
//                 </div>
//                 {/* <div className="mt-4 space-y-2">
//                   <Button variant="ghost" size="sm" className="text-primary">
//                     Add Master/ Post-graduate
//                   </Button>
//                   <br />
//                   <Button variant="ghost" size="sm" className="text-primary">
//                     Add Doctorate/ PhD
//                   </Button>
//                 </div> */}
//               </CardContent>
//             </Card>

//             {/* Projects */}
//             <Card className="rounded-3xl">
//               <CardContent className="p-6">
//                 <div className="flex items-center justify-between mb-4">
//                   <h3 className="font-semibold">Projects</h3>
//                   <ProjectDialog onSave={addProjectEntry}>
//                     <Button variant="ghost" size="sm" className="text-primary">
//                       Add Project
//                     </Button>
//                   </ProjectDialog>
//                 </div>
//                 {projects.length > 0 ? (
//                   <div className="space-y-4">
//                     {projects.map((project: any, index: number) => (
//                       <div key={index} className="p-4 border border-border rounded-xl">
//                         <div className="flex items-start justify-between">
//                           <div className="flex-1">
//                             <h4 className="font-medium">{project.title || "Project Title"}</h4>
//                             <p className="text-sm text-muted-foreground mt-1">
//                               {project.description || "No description"}
//                             </p>
//                             {project.technologies &&
//                               Array.isArray(project.technologies) &&
//                               project.technologies.length > 0 && (
//                                 <div className="flex flex-wrap gap-1 mt-2">
//                                   {project.technologies.map((tech: string, techIndex: number) => (
//                                     <Badge key={techIndex} variant="outline" className="text-xs">
//                                       {tech}
//                                     </Badge>
//                                   ))}
//                                 </div>
//                               )}
//                             <p className="text-xs text-muted-foreground mt-2">
//                               {project.start_date ? format(new Date(project.start_date), "MMM yyyy") : "Start date"} -{" "}
//                               {project.end_date ? format(new Date(project.end_date), "MMM yyyy") : "Present"}
//                             </p>
//                           </div>
//                           <Button
//                             variant="ghost"
//                             size="sm"
//                             onClick={() => removeProjectEntry(project.id)}
//                             className="text-muted-foreground hover:text-destructive ml-2"
//                           >
//                             <Trash2 className="w-4 h-4" />
//                           </Button>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 ) : (
//                   <p className="text-muted-foreground">
//                     Stand out by adding details about the projects that you have done so far.
//                   </p>
//                 )}
//               </CardContent>
//             </Card>

//             {/* Interests */}
//             <Card className="rounded-3xl">
//               <CardContent className="p-6">
//                 <div className="flex items-center justify-between mb-4">
//                   <h3 className="font-semibold">Interests</h3>
//                   <InterestDialog interests={interests} onSave={updateInterests}>
//                     <Button variant="ghost" size="sm" className="text-primary">
//                       Add Interest
//                     </Button>
//                   </InterestDialog>
//                 </div>
//                 {interests.length > 0 ? (
//                   <div className="flex flex-wrap gap-2">
//                     {interests.map((interest: string, index: number) => (
//                       <Badge key={index} variant="outline" className="px-3 py-1 flex items-center gap-1">
//                         {interest}
//                         <X
//                           className="w-3 h-3 cursor-pointer hover:text-destructive"
//                           onClick={() => removeInterest(interest)}
//                         />
//                       </Badge>
//                     ))}
//                   </div>
//                 ) : (
//                   <p className="text-muted-foreground">Stand out by telling about your interests.</p>
//                 )}
//               </CardContent>
//             </Card>

//             {/* Internships */}
//             <Card className="rounded-3xl">
//               <CardContent className="p-6">
//                 <div className="flex items-center justify-between mb-4">
//                   <h3 className="font-semibold">Internships</h3>
//                   <InternshipDialog onSave={addInternshipEntry}>
//                     <Button variant="ghost" size="sm" className="text-primary">
//                       Add Internship
//                     </Button>
//                   </InternshipDialog>
//                 </div>
//                 {internships.length > 0 ? (
//                   <div className="space-y-4">
//                     {internships.map((internship: any, index: number) => (
//                       <div key={index} className="p-4 border border-border rounded-lg">
//                         <div className="flex items-start justify-between">
//                           <div className="flex-1">
//                             <h4 className="font-medium">{internship.title || "Internship Title"}</h4>
//                             <p className="text-sm text-muted-foreground">{internship.company || "Company"}</p>
//                             <p className="text-sm text-muted-foreground mt-1">
//                               {internship.description || "No description"}
//                             </p>
//                             <p className="text-xs text-muted-foreground mt-2">
//                               {internship.start_date
//                                 ? format(new Date(internship.start_date), "MMM yyyy")
//                                 : "Start date"}{" "}
//                               -
//                               {internship.currently_working
//                                 ? " Present"
//                                 : internship.end_date
//                                   ? format(new Date(internship.end_date), "MMM yyyy")
//                                   : " End date"}
//                             </p>
//                           </div>
//                           <Button
//                             variant="ghost"
//                             size="sm"
//                             onClick={() => removeInternshipEntry(internship.id)}
//                             className="text-muted-foreground hover:text-destructive ml-2"
//                           >
//                             <Trash2 className="w-4 h-4" />
//                           </Button>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 ) : (
//                   <p className="text-muted-foreground">No internships added yet. Add your internship experience!</p>
//                 )}
//               </CardContent>
//             </Card>

//             {/* Personal Details */}
//             <Card className="rounded-3xl">
//               <CardContent className="p-6">
//                 <div className="flex items-center justify-between mb-4">
//                   <h3 className="font-semibold">Personal Details</h3>
//                   {profile && (
//                     <>
//                       <PersonalDetailsDialog profile={profile} onUpdate={updateProfile}>
//                         <>
//                           <Edit className="w-4 h-4 text-muted-foreground cursor-pointer hover:text-primary" />
//                         </>
//                       </PersonalDetailsDialog>
//                     </>
//                   )}
//                 </div>
//                 <div className="grid grid-cols-2 gap-6">
//                   <div>
//                     <p className="text-sm text-muted-foreground mb-1">Gender</p>
//                     <p className="font-medium">{profile?.gender || "Not specified"}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-muted-foreground mb-1">Phone</p>
//                     <p className="font-medium">{profile?.phone || "Not provided"}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-muted-foreground mb-1">Date Of Birth</p>
//                     <p className="font-medium">
//                       {profile?.date_of_birth ? format(new Date(profile.date_of_birth), "dd MMM yyyy") : "Not provided"}
//                     </p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-muted-foreground mb-1">Profile Type</p>
//                     <p className="font-medium">{profile?.profile_type || "Not specified"}</p>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Languages */}
//             <Card className="rounded-3xl">
//               <CardContent className="p-6">
//                 <div className="flex items-center justify-between mb-4">
//                   <h3 className="font-semibold">Languages</h3>
//                   <LanguageDialog onSave={addLanguageEntry}>
//                     <Button variant="ghost" size="sm" className="text-primary">
//                       Add Languages
//                     </Button>
//                   </LanguageDialog>
//                 </div>
//                 <div className="space-y-4">
//                   {languages.length > 0 ? (
//                     <>
//                       <div className="grid grid-cols-6 gap-4 text-sm  text-muted-foreground mb-2">
//                         <span>Language</span>
//                         <span>Proficiency</span>
//                         <span>Read</span>
//                         <span>Write</span>
//                         <span>Speak</span>
//                         <span></span>
//                       </div>
//                       {languages.map((lang: any, index: number) => (
//                         <div
//                           key={index}
//                           className="grid grid-cols-6 gap-4 items-center p-3 border border-border rounded-lg"
//                         >
//                           <span className="font-medium">{lang.name || "Language"}</span>
//                           <div className="flex space-x-1">{renderProficiencyDots(lang.proficiency || 0)}</div>
//                           <div className="flex space-x-1">{renderProficiencyDots(lang.read || 0)}</div>
//                           <div className="flex space-x-1">{renderProficiencyDots(lang.write || 0)}</div>
//                           <div className="flex space-x-1">{renderProficiencyDots(lang.speak || 0)}</div>
//                           <Button
//                             variant="ghost"
//                             size="sm"
//                             onClick={() => removeLanguageEntry(lang.id)}
//                             className="text-muted-foreground hover:text-destructive justify-self-end"
//                           >
//                             <Trash2 className="w-4 h-4" />
//                           </Button>
//                         </div>
//                       ))}
//                     </>
//                   ) : (
//                     <p className="text-muted-foreground">No languages added yet.</p>
//                   )}
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Profile;
