import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Clock, MapPin, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import ProfileSidebar from "@/components/ProfileSidebar";
import { useIntern } from "@/hooks/useInternships";
import { useCourses } from "@/hooks/useCourses";
import { useInternshipRecommendations, useCourseRecommendations } from "@/hooks/useRecommendations";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentInternshipIndex, setCurrentInternshipIndex] = useState(0);
  const [currentCourseIndex, setCurrentCourseIndex] = useState(0);
  const [userSkills, setUserSkills] = useState<string[]>([]);

  const { internships, loading: internshipsLoading } = useIntern();

  const { courses, loading: coursesLoading } = useCourses();

  // Fetch user skills for recommendations
  useEffect(() => {
    const fetchUserSkills = async () => {
      if (!user) return;

      try {
        const { data: profile } = await supabase.from("profiles").select("id").eq("user_id", user.id).maybeSingle();

        if (profile) {
          const { data: studentProfile } = await supabase
            .from("student_profiles")
            .select("skills")
            .eq("profile_id", profile.id)
            .maybeSingle();

          if (studentProfile?.skills) {
            let skills: any[] = [];

            if (typeof studentProfile.skills === "string") {
              try {
                // Try to parse JSON
                const parsed = JSON.parse(studentProfile.skills);
                skills = Array.isArray(parsed) ? parsed : studentProfile.skills.split(",").map((s) => s.trim());
              } catch {
                // If invalid JSON, fallback to comma-separated
                skills = studentProfile.skills.split(",").map((s) => s.trim());
              }
            } else if (Array.isArray(studentProfile.skills)) {
              skills = studentProfile.skills;
            }

            setUserSkills(skills);
          }
        }
      } catch (error) {
        console.error("Error fetching user skills:", error);
      }
    };

    fetchUserSkills();
  }, [user]);

  // Use recommendation hooks
  const recommendedInternships = useInternshipRecommendations(internships, userSkills);
  const recommendedCourses = useCourseRecommendations(courses, userSkills);

  const heroCards = [
    {
      id: "1",
      title: "Business Conference Annual Summit",
      type: "The Company",
      speaker: "Speaker by Abdali Anwole",
      color: "bg-gradient-to-r from-blue-100 to-blue-200",
    },
    {
      id: "2",
      title: "Online Course",
      subtitle: "The Learning Academy",
      type: "Educational",
      color: "bg-gradient-to-r from-green-100 to-teal-100",
    },
    {
      id: "3",
      title: "TAKE YOUR BUSINESS TO NEXT LEVEL",
      type: "Business Growth",
      color: "bg-gradient-to-r from-purple-100 to-purple-200",
    },
  ];

  const nextInternship = () => {
    setCurrentInternshipIndex((prev) => (prev === recommendedInternships.length - 1 ? 0 : prev + 1));
  };

  const prevInternship = () => {
    setCurrentInternshipIndex((prev) => (prev === 0 ? recommendedInternships.length - 1 : prev - 1));
  };

  const nextCourse = () => {
    setCurrentCourseIndex((prev) => (prev === recommendedCourses.length - 1 ? 0 : prev + 1));
  };

  const prevCourse = () => {
    setCurrentCourseIndex((prev) => (prev === 0 ? recommendedCourses.length - 1 : prev - 1));
  };
  const getDifficultyColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case "beginner":
        return "bg-green-500";
      case "intermediate":
        return "bg-orange-500";
      case "advanced":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-2">
          {/* Left Sidebar - Profile */}
          <div className="lg:col-span-1">
            <ProfileSidebar />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-2">
            {/* Hero Section */}
            <div className="grid md:grid-cols-3 gap-4">
              {heroCards.map((card) => (
                <Card key={card.id} className={`${card.color} border-0 shadow-sm rounded-3xl`}>
                  <CardContent className="p-6">
                    <div className="min-h-[120px] flex flex-col justify-center">
                      <h3 className="font-bold text-sm mb-2">{card.title}</h3>
                      {card.subtitle && <p className="text-xs text-muted-foreground mb-1">{card.subtitle}</p>}
                      {card.speaker && <p className="text-xs text-muted-foreground">{card.speaker}</p>}
                      {card.type && (
                        <Badge variant="secondary" className="w-fit text-xs mt-2">
                          {card.type}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Recommended Internships */}
            <section>
              <Card className="p-6 bg-white shadow-sm border border-gray-200 rounded-3xl">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Recommended for you</h2>
                  <Button variant="link" className="text-primary p-0 h-auto" onClick={() => navigate("/internships")}>
                    View all
                  </Button>
                </div>

                {internshipsLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                ) : recommendedInternships.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No internships available</p>
                ) : (
                  <div className="relative">
                    <div className="flex items-center space-x-4">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={prevInternship}
                        className="flex-shrink-0 rounded-full"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>

                      <div className="flex-1 grid md:grid-cols-3 gap-4">
                        {recommendedInternships
                          .slice(currentInternshipIndex, currentInternshipIndex + 3)
                          .map((internship, idx) => {
                            if (!internship) return null;

                            const colors = [
                              "bg-green-100 border-green-200",
                              "bg-blue-100 border-blue-200",
                              "bg-purple-100 border-purple-200",
                            ];
                            const colorClass = colors[idx % colors.length];
                            const initial = internship.company_name?.charAt(0) || "C";
                            const daysAgo = Math.floor(
                              (Date.now() - new Date(internship.created_at).getTime()) / (1000 * 60 * 60 * 24),
                            );
                            const timeText = daysAgo === 0 ? "Today" : daysAgo === 1 ? "1d ago" : `${daysAgo}d ago`;

                            return (
                              <Card
                                key={internship.id}
                                className={`${colorClass} shadow-sm hover:shadow-md transition-shadow cursor-pointer rounded-xl`}
                                onClick={() => navigate(`/internship/${internship.id}`)}
                              >
                                <CardHeader className="pb-3">
                                  <div className="flex justify-between items-start mb-2">
                                    <div className="w-8 h-8 bg-foreground rounded-full flex items-center justify-center text-background font-bold text-sm">
                                      {<img src={internship.company_logo} className="w-12" /> || initial}
                                    </div>
                                    <Badge variant="secondary" className="text-xs">
                                      {timeText}
                                    </Badge>
                                  </div>
                                  <CardTitle className="text-base font-semibold">{internship.title}</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                  <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                                    <Clock className="w-3 h-3" />
                                    <span>{internship.duration || "Not specified"}</span>
                                  </div>
                                  <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                                    <MapPin className="w-3 h-3" />
                                    <span>{internship.location || "Remote"}</span>
                                  </div>
                                </CardContent>
                              </Card>
                            );
                          })}
                      </div>

                      <Button
                        variant="outline"
                        size="icon"
                        onClick={nextInternship}
                        className="flex-shrink-0 rounded-full"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            </section>

            {/* Advertisement placeholder */}
            {/* <Card className="bg-gradient-to-r from-blue-100 to-blue-200 border-0">
              <CardContent className="p-8 text-center">
                <h3 className="text-lg font-bold mb-2">Advertisement Space</h3>
                <p className="text-sm text-muted-foreground">
                  Featured content and promotions
                </p>
              </CardContent>
            </Card> */}

            {/* Certified Courses */}
            <section>
              <Card className="p-6 bg-white shadow-sm border border-gray-200 rounded-3xl">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Certified Courses for you</h2>
                  <Button variant="link" className="text-primary p-0 h-auto" onClick={() => navigate("/courses")}>
                    View all
                  </Button>
                </div>

                {coursesLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                ) : recommendedCourses.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No courses available</p>
                ) : (
                  <div className="relative">
                    <div className="flex items-center space-x-4">
                      <Button variant="outline" size="icon" onClick={prevCourse} className="flex-shrink-0 rounded-full">
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <div className="flex-1 grid md:grid-cols-3 gap-4">
                        {recommendedCourses.slice(currentCourseIndex, currentCourseIndex + 3).map((course, idx) => {
                          if (!course) return null;

                          const gradients = [
                            "bg-gradient-to-br from-blue-900 to-purple-900",
                            "bg-gradient-to-br from-purple-800 to-orange-600",
                            "bg-gradient-to-br from-cyan-500 to-blue-600",
                          ];
                          const gradientClass = gradients[idx % gradients.length];

                          return (
                            <Card
                              key={course.id}
                              className="overflow-hidden rounded-3xl hover:shadow-lg transition-all"
                              onClick={() => navigate("/courses")}
                            >
                              <div className={`h-32 relative ${gradientClass} flex items-center justify-center`}>
                                {course.image_url ? (
                                  <img
                                    src={course.image_url}
                                    alt={course.title}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="text-white text-center">
                                    <h3 className="text-2xl font-bold">{course.category || "Course"}</h3>
                                  </div>
                                )}
                                {/* Time ago badge */}
                                <Badge className="absolute top-3 right-3 bg-white/90 text-foreground hover:bg-white">
                                  {formatDistanceToNow(new Date(course.created_at), { addSuffix: true })}
                                </Badge>
                              </div>

                              <CardContent className="p-4 space-y-3">
                                {/* Title */}
                                <h3 className="font-bold text-lg line-clamp-2">{course.title}</h3>

                                {/* Duration and Level */}
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                    <Clock className="w-4 h-4" />
                                    <span>{course.duration || "8 weeks"}</span>
                                  </div>
                                  {course.difficulty_level && (
                                    <Badge className={`${getDifficultyColor(course.difficulty_level)} text-white`}>
                                      {course.difficulty_level}
                                    </Badge>
                                  )}
                                </div>

                                {/* <p className="text-xs text-muted-foreground">
                                    {course.provider || "Online Course"}
                                  </p> */}

                                {/* Description */}
                                {/* <p className="text-sm text-muted-foreground line-clamp-3">
                                    {course.description ||
                                      "Build your skills with this comprehensive course..."}
                                  </p> */}

                                {/* Know More Button */}
                                <Button
                                  className="border-none text-sm text-primary hover:bg-transparent hover:text-primary"
                                  variant="outline"
                                >
                                  Know more
                                  <ChevronRight className="w-3" />
                                </Button>
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>

                      <Button variant="outline" size="icon" onClick={nextCourse} className="flex-shrink-0 rounded-full">
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
// import { useAuth } from "@/hooks/useAuth";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { ChevronLeft, ChevronRight, Clock, MapPin, Loader2 } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { useState, useEffect } from "react";
// import Navbar from "@/components/Navbar";
// import ProfileSidebar from "@/components/ProfileSidebar";
// import { useIntern } from "@/hooks/useInternships";
// import { useCourses } from "@/hooks/useCourses";
// import { useInternshipRecommendations, useCourseRecommendations } from "@/hooks/useRecommendations";
// import { supabase } from "@/integrations/supabase/client";
// import { formatDistanceToNow } from "date-fns";

// const Dashboard = () => {
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const [currentInternshipIndex, setCurrentInternshipIndex] = useState(0);
//   const [currentCourseIndex, setCurrentCourseIndex] = useState(0);
//   const [userSkills, setUserSkills] = useState<string[]>([]);

//   const { internships, loading: internshipsLoading } = useIntern();

//   const { courses, loading: coursesLoading } = useCourses();

//   // Fetch user skills for recommendations
//   useEffect(() => {
//     const fetchUserSkills = async () => {
//       if (!user) return;

//       try {
//         const { data: profile } = await supabase.from("profiles").select("id").eq("user_id", user.id).maybeSingle();

//         if (profile) {
//           const { data: studentProfile } = await supabase
//             .from("student_profiles")
//             .select("skills")
//             .eq("profile_id", profile.id)
//             .maybeSingle();

//           if (studentProfile?.skills) {
//             let skills: any[] = [];

//             if (typeof studentProfile.skills === "string") {
//               try {
//                 // Try to parse JSON
//                 const parsed = JSON.parse(studentProfile.skills);
//                 skills = Array.isArray(parsed) ? parsed : studentProfile.skills.split(",").map((s) => s.trim());
//               } catch {
//                 // If invalid JSON, fallback to comma-separated
//                 skills = studentProfile.skills.split(",").map((s) => s.trim());
//               }
//             } else if (Array.isArray(studentProfile.skills)) {
//               skills = studentProfile.skills;
//             }

//             setUserSkills(skills);
//           }
//         }
//       } catch (error) {
//         console.error("Error fetching user skills:", error);
//       }
//     };

//     fetchUserSkills();
//   }, [user]);

//   // Use recommendation hooks
//   const recommendedInternships = useInternshipRecommendations(internships, userSkills);
//   const recommendedCourses = useCourseRecommendations(courses, userSkills);

//   const heroCards = [
//     {
//       id: "1",
//       title: "Business Conference Annual Summit",
//       type: "The Company",
//       speaker: "Speaker by Abdali Anwole",
//       color: "bg-gradient-to-r from-blue-100 to-blue-200",
//     },
//     {
//       id: "2",
//       title: "Online Course",
//       subtitle: "The Learning Academy",
//       type: "Educational",
//       color: "bg-gradient-to-r from-green-100 to-teal-100",
//     },
//     {
//       id: "3",
//       title: "TAKE YOUR BUSINESS TO NEXT LEVEL",
//       type: "Business Growth",
//       color: "bg-gradient-to-r from-purple-100 to-purple-200",
//     },
//   ];

//   const nextInternship = () => {
//     setCurrentInternshipIndex((prev) => (prev === recommendedInternships.length - 1 ? 0 : prev + 1));
//   };

//   const prevInternship = () => {
//     setCurrentInternshipIndex((prev) => (prev === 0 ? recommendedInternships.length - 1 : prev - 1));
//   };

//   const nextCourse = () => {
//     setCurrentCourseIndex((prev) => (prev === recommendedCourses.length - 1 ? 0 : prev + 1));
//   };

//   const prevCourse = () => {
//     setCurrentCourseIndex((prev) => (prev === 0 ? recommendedCourses.length - 1 : prev - 1));
//   };
//   const getDifficultyColor = (level: string) => {
//     switch (level?.toLowerCase()) {
//       case "beginner":
//         return "bg-green-500";
//       case "intermediate":
//         return "bg-orange-500";
//       case "advanced":
//         return "bg-red-500";
//       default:
//         return "bg-gray-500";
//     }
//   };
//   return (
//     <div className="min-h-screen bg-background">
//       <Navbar />

//       <div className="container mx-auto px-4 py-8">
//         <div className="grid lg:grid-cols-4 gap-8">
//           {/* Left Sidebar - Profile */}
//           <div className="lg:col-span-1">
//             <ProfileSidebar />
//           </div>

//           {/* Main Content */}
//           <div className="lg:col-span-3 space-y-8">
//             {/* Hero Section */}
//             <div className="grid md:grid-cols-3 gap-4">
//               {heroCards.map((card) => (
//                 <Card key={card.id} className={`${card.color} border-0 shadow-sm`}>
//                   <CardContent className="p-6">
//                     <div className="min-h-[120px] flex flex-col justify-center">
//                       <h3 className="font-bold text-sm mb-2">{card.title}</h3>
//                       {card.subtitle && <p className="text-xs text-muted-foreground mb-1">{card.subtitle}</p>}
//                       {card.speaker && <p className="text-xs text-muted-foreground">{card.speaker}</p>}
//                       {card.type && (
//                         <Badge variant="secondary" className="w-fit text-xs mt-2">
//                           {card.type}
//                         </Badge>
//                       )}
//                     </div>
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>

//             {/* Recommended Internships */}
//             <section>
//               <Card className="p-6 bg-white shadow-sm border border-gray-200 rounded-3xl">
//                 <div className="flex items-center justify-between mb-6">
//                   <h2 className="text-xl font-semibold">Recommended for you</h2>
//                   <Button variant="link" className="text-primary p-0 h-auto" onClick={() => navigate("/internships")}>
//                     View all
//                   </Button>
//                 </div>

//                 {internshipsLoading ? (
//                   <div className="flex justify-center py-8">
//                     <Loader2 className="w-8 h-8 animate-spin text-primary" />
//                   </div>
//                 ) : recommendedInternships.length === 0 ? (
//                   <p className="text-center text-muted-foreground py-8">No internships available</p>
//                 ) : (
//                   <div className="relative">
//                     <div className="flex items-center space-x-4">
//                       <Button variant="outline" size="icon" onClick={prevInternship} className="flex-shrink-0">
//                         <ChevronLeft className="w-4 h-4" />
//                       </Button>

//                       <div className="flex-1 grid md:grid-cols-3 gap-4">
//                         {recommendedInternships
//                           .slice(currentInternshipIndex, currentInternshipIndex + 3)
//                           .map((internship, idx) => {
//                             if (!internship) return null;

//                             const colors = [
//                               "bg-green-100 border-green-200",
//                               "bg-blue-100 border-blue-200",
//                               "bg-purple-100 border-purple-200",
//                             ];
//                             const colorClass = colors[idx % colors.length];
//                             const initial = internship.company_name?.charAt(0) || "C";
//                             const daysAgo = Math.floor(
//                               (Date.now() - new Date(internship.created_at).getTime()) / (1000 * 60 * 60 * 24),
//                             );
//                             const timeText = daysAgo === 0 ? "Today" : daysAgo === 1 ? "1d ago" : `${daysAgo}d ago`;

//                             return (
//                               <Card
//                                 key={internship.id}
//                                 className={`${colorClass} shadow-sm hover:shadow-md transition-shadow cursor-pointer`}
//                                 onClick={() => navigate(`/internship/${internship.id}`)}
//                               >
//                                 <CardHeader className="pb-3">
//                                   <div className="flex justify-between items-start mb-2">
//                                     <Badge variant="secondary" className="text-xs">
//                                       {timeText}
//                                     </Badge>
//                                     <div className="w-8 h-8 bg-foreground rounded-full flex items-center justify-center text-background font-bold text-sm">
//                                       {initial}
//                                     </div>
//                                   </div>
//                                   <CardTitle className="text-base font-semibold">{internship.title}</CardTitle>
//                                 </CardHeader>
//                                 <CardContent className="space-y-3">
//                                   <div className="flex items-center space-x-1 text-xs text-muted-foreground">
//                                     <Clock className="w-3 h-3" />
//                                     <span>{internship.duration || "Not specified"}</span>
//                                   </div>
//                                   <div className="flex items-center space-x-1 text-xs text-muted-foreground">
//                                     <MapPin className="w-3 h-3" />
//                                     <span>{internship.location || "Remote"}</span>
//                                   </div>
//                                 </CardContent>
//                               </Card>
//                             );
//                           })}
//                       </div>

//                       <Button variant="outline" size="icon" onClick={nextInternship} className="flex-shrink-0">
//                         <ChevronRight className="w-4 h-4" />
//                       </Button>
//                     </div>
//                   </div>
//                 )}
//               </Card>
//             </section>

//             {/* Advertisement placeholder */}
//             <Card className="bg-gradient-to-r from-blue-100 to-blue-200 border-0">
//               <CardContent className="p-8 text-center">
//                 <h3 className="text-lg font-bold mb-2">Advertisement Space</h3>
//                 <p className="text-sm text-muted-foreground">Featured content and promotions</p>
//               </CardContent>
//             </Card>

//             {/* Certified Courses */}
//             <section>
//               <Card className="p-6 bg-white shadow-sm border border-gray-200 rounded-3xl">
//                 <div className="flex items-center justify-between mb-6">
//                   <h2 className="text-xl font-semibold">Certified Courses for you</h2>
//                   <Button variant="link" className="text-primary p-0 h-auto" onClick={() => navigate("/courses")}>
//                     View all
//                   </Button>
//                 </div>

//                 {coursesLoading ? (
//                   <div className="flex justify-center py-8">
//                     <Loader2 className="w-8 h-8 animate-spin text-primary" />
//                   </div>
//                 ) : recommendedCourses.length === 0 ? (
//                   <p className="text-center text-muted-foreground py-8">No courses available</p>
//                 ) : (
//                   <div className="relative">
//                     <div className="flex items-center space-x-4">
//                       <Button variant="outline" size="icon" onClick={prevCourse} className="flex-shrink-0">
//                         <ChevronLeft className="w-4 h-4" />
//                       </Button>
//                       <div className="flex-1 grid md:grid-cols-3 gap-4">
//                         {recommendedCourses.slice(currentCourseIndex, currentCourseIndex + 3).map((course, idx) => {
//                           if (!course) return null;

//                           const gradients = [
//                             "bg-gradient-to-br from-blue-900 to-purple-900",
//                             "bg-gradient-to-br from-purple-800 to-orange-600",
//                             "bg-gradient-to-br from-cyan-500 to-blue-600",
//                           ];
//                           const gradientClass = gradients[idx % gradients.length];

//                           return (
//                             <Card
//                               key={course.id}
//                               className="overflow-hidden rounded-3xl hover:shadow-lg transition-all"
//                               onClick={() => navigate("/courses")}
//                             >
//                               <div className={`h-32 relative ${gradientClass} flex items-center justify-center`}>
//                                 {course.image_url ? (
//                                   <img
//                                     src={course.image_url}
//                                     alt={course.title}
//                                     className="w-full h-full object-cover"
//                                   />
//                                 ) : (
//                                   <div className="text-white text-center">
//                                     <h3 className="text-2xl font-bold">{course.category || "Course"}</h3>
//                                   </div>
//                                 )}
//                                 {/* Time ago badge */}
//                                 <Badge className="absolute top-3 right-3 bg-white/90 text-foreground hover:bg-white">
//                                   {formatDistanceToNow(new Date(course.created_at), { addSuffix: true })}
//                                 </Badge>
//                               </div>

//                               <CardContent className="p-4 space-y-3">
//                                 {/* Duration and Level */}
//                                 <div className="flex items-center justify-between">
//                                   <div className="flex items-center gap-1 text-sm text-muted-foreground">
//                                     <Clock className="w-4 h-4" />
//                                     <span>{course.duration || "8 weeks"}</span>
//                                   </div>
//                                   {course.difficulty_level && (
//                                     <Badge className={`${getDifficultyColor(course.difficulty_level)} text-white`}>
//                                       {course.difficulty_level}
//                                     </Badge>
//                                   )}
//                                 </div>
//                                 {/* Title */}
//                                 <h3 className="font-bold text-lg line-clamp-2">{course.title}</h3>

//                                 <p className="text-xs text-muted-foreground">{course.provider || "Online Course"}</p>

//                                 {/* Description */}
//                                 <p className="text-sm text-muted-foreground line-clamp-3">
//                                   {course.description || "Build your skills with this comprehensive course..."}
//                                 </p>

//                                 {/* Know More Button */}
//                                 <Button
//                                   className="w-full rounded-full border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all"
//                                   variant="outline"
//                                 >
//                                   Know more
//                                 </Button>
//                               </CardContent>
//                             </Card>
//                           );
//                         })}
//                       </div>

//                       <Button variant="outline" size="icon" onClick={nextCourse} className="flex-shrink-0">
//                         <ChevronRight className="w-4 h-4" />
//                       </Button>
//                     </div>
//                   </div>
//                 )}
//               </Card>
//             </section>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

// // import { useAuth } from "@/hooks/useAuth";
// // import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// // import { Button } from "@/components/ui/button";
// // import { Badge } from "@/components/ui/badge";
// // import { ChevronLeft, ChevronRight, Clock, MapPin, Loader2 } from "lucide-react";
// // import { useNavigate } from "react-router-dom";
// // import { useState, useEffect } from "react";
// // import Navbar from "@/components/Navbar";
// // import ProfileSidebar from "@/components/ProfileSidebar";
// // import { useInternships } from "@/hooks/useInternships";
// // import { useCourses } from "@/hooks/useCourses";
// // import { useInternshipRecommendations, useCourseRecommendations } from "@/hooks/useRecommendations";
// // import { supabase } from "@/integrations/supabase/client";

// // const Dashboard = () => {
// //   const { user } = useAuth();
// //   const navigate = useNavigate();
// //   const [currentInternshipIndex, setCurrentInternshipIndex] = useState(0);
// //   const [currentCourseIndex, setCurrentCourseIndex] = useState(0);
// //   const [userSkills, setUserSkills] = useState<string[]>([]);

// //   const { internships, loading: internshipsLoading } = useInternships();
// //   const { courses, loading: coursesLoading } = useCourses();

// //   // Fetch user skills for recommendations
// //   useEffect(() => {
// //     const fetchUserSkills = async () => {
// //       if (!user) return;

// //       try {
// //         const { data: profile } = await supabase.from("profiles").select("id").eq("user_id", user.id).maybeSingle();

// //         if (profile) {
// //           const { data: studentProfile } = await supabase
// //             .from("student_profiles")
// //             .select("skills")
// //             .eq("profile_id", profile.id)
// //             .maybeSingle();

// //           // if (studentProfile?.skills) {
// //           //   const skills = typeof studentProfile.skills === 'string'
// //           //     ? JSON.parse(studentProfile.skills)
// //           //     : studentProfile.skills;
// //           //   setUserSkills(Array.isArray(skills) ? skills : []);
// //           // }
// //           if (studentProfile?.skills) {
// //             let skills: any[] = [];

// //             if (typeof studentProfile.skills === "string") {
// //               try {
// //                 // Try to parse JSON
// //                 const parsed = JSON.parse(studentProfile.skills);
// //                 skills = Array.isArray(parsed) ? parsed : studentProfile.skills.split(",").map((s) => s.trim());
// //               } catch {
// //                 // If invalid JSON, fallback to comma-separated
// //                 skills = studentProfile.skills.split(",").map((s) => s.trim());
// //               }
// //             } else if (Array.isArray(studentProfile.skills)) {
// //               skills = studentProfile.skills;
// //             }

// //             setUserSkills(skills);
// //           }
// //         }
// //       } catch (error) {
// //         console.error("Error fetching user skills:", error);
// //       }
// //     };

// //     fetchUserSkills();
// //   }, [user]);

// //   // Use recommendation hooks
// //   const recommendedInternships = useInternshipRecommendations(internships, userSkills);
// //   const recommendedCourses = useCourseRecommendations(courses, userSkills);

// //   const heroCards = [
// //     {
// //       id: "1",
// //       title: "Business Conference Annual Summit",
// //       type: "The Company",
// //       speaker: "Speaker by Abdali Anwole",
// //       color: "bg-gradient-to-r from-blue-100 to-blue-200",
// //     },
// //     {
// //       id: "2",
// //       title: "Online Course",
// //       subtitle: "The Learning Academy",
// //       type: "Educational",
// //       color: "bg-gradient-to-r from-green-100 to-teal-100",
// //     },
// //     {
// //       id: "3",
// //       title: "TAKE YOUR BUSINESS TO NEXT LEVEL",
// //       type: "Business Growth",
// //       color: "bg-gradient-to-r from-purple-100 to-purple-200",
// //     },
// //   ];

// //   const nextInternship = () => {
// //     setCurrentInternshipIndex((prev) => (prev === recommendedInternships.length - 1 ? 0 : prev + 1));
// //   };

// //   const prevInternship = () => {
// //     setCurrentInternshipIndex((prev) => (prev === 0 ? recommendedInternships.length - 1 : prev - 1));
// //   };

// //   const nextCourse = () => {
// //     setCurrentCourseIndex((prev) => (prev === recommendedCourses.length - 1 ? 0 : prev + 1));
// //   };

// //   const prevCourse = () => {
// //     setCurrentCourseIndex((prev) => (prev === 0 ? recommendedCourses.length - 1 : prev - 1));
// //   };

// //   return (
// //     <div className="min-h-screen bg-background">
// //       <Navbar />

// //       <div className="container mx-auto px-4 py-8">
// //         <div className="grid lg:grid-cols-4 gap-8">
// //           {/* Left Sidebar - Profile */}
// //           <div className="lg:col-span-1">
// //             <ProfileSidebar />
// //           </div>

// //           {/* Main Content */}
// //           <div className="lg:col-span-3 space-y-8">
// //             {/* Hero Section */}
// //             <div className="grid md:grid-cols-3 gap-4">
// //               {heroCards.map((card) => (
// //                 <Card key={card.id} className={`${card.color} border-0 shadow-sm`}>
// //                   <CardContent className="p-6">
// //                     <div className="min-h-[120px] flex flex-col justify-center">
// //                       <h3 className="font-bold text-sm mb-2">{card.title}</h3>
// //                       {card.subtitle && <p className="text-xs text-muted-foreground mb-1">{card.subtitle}</p>}
// //                       {card.speaker && <p className="text-xs text-muted-foreground">{card.speaker}</p>}
// //                       {card.type && (
// //                         <Badge variant="secondary" className="w-fit text-xs mt-2">
// //                           {card.type}
// //                         </Badge>
// //                       )}
// //                     </div>
// //                   </CardContent>
// //                 </Card>
// //               ))}
// //             </div>

// //             {/* Recommended Internships */}
// //             <section>
// //               <Card className="p-6 bg-white shadow-sm border border-gray-200 rounded-3xl">
// //                 <div className="flex items-center justify-between mb-6">
// //                   <h2 className="text-xl font-semibold">Recommended for you</h2>
// //                   <Button variant="link" className="text-primary p-0 h-auto" onClick={() => navigate("/internships")}>
// //                     View all
// //                   </Button>
// //                 </div>

// //                 {internshipsLoading ? (
// //                   <div className="flex justify-center py-8">
// //                     <Loader2 className="w-8 h-8 animate-spin text-primary" />
// //                   </div>
// //                 ) : recommendedInternships.length === 0 ? (
// //                   <p className="text-center text-muted-foreground py-8">No internships available</p>
// //                 ) : (
// //                   <div className="relative">
// //                     <div className="flex items-center space-x-4">
// //                       <Button variant="outline" size="icon" onClick={prevInternship} className="flex-shrink-0">
// //                         <ChevronLeft className="w-4 h-4" />
// //                       </Button>

// //                       <div className="flex-1 grid md:grid-cols-3 gap-4">
// //                         {[0, 1, 2].map((offset) => {
// //                           const index = (currentInternshipIndex + offset) % recommendedInternships.length;
// //                           const internship = recommendedInternships[index];

// //                           if (!internship) return null;

// //                           const colors = [
// //                             "bg-green-100 border-green-200",
// //                             "bg-blue-100 border-blue-200",
// //                             "bg-purple-100 border-purple-200",
// //                           ];
// //                           const colorClass = colors[offset % colors.length];
// //                           const initial = internship.company_name?.charAt(0) || "C";
// //                           const daysAgo = Math.floor(
// //                             (Date.now() - new Date(internship.created_at).getTime()) / (1000 * 60 * 60 * 24),
// //                           );
// //                           const timeText = daysAgo === 0 ? "Today" : daysAgo === 1 ? "1d ago" : `${daysAgo}d ago`;

// //                           return (
// //                             <Card
// //                               key={`${internship.id}-${index}`}
// //                               className={`${colorClass} shadow-sm hover:shadow-md transition-shadow cursor-pointer`}
// //                               onClick={() => navigate(`/internship/${internship.id}`)}
// //                             >
// //                               <CardHeader className="pb-3">
// //                                 <div className="flex justify-between items-start mb-2">
// //                                   <Badge variant="secondary" className="text-xs">
// //                                     {timeText}
// //                                   </Badge>
// //                                   <div className="w-8 h-8 bg-foreground rounded-full flex items-center justify-center text-background font-bold text-sm">
// //                                     {initial}
// //                                   </div>
// //                                 </div>
// //                                 <CardTitle className="text-base font-semibold">{internship.title}</CardTitle>
// //                               </CardHeader>

// //                               <CardContent className="space-y-3">
// //                                 <div className="flex items-center space-x-1 text-xs text-muted-foreground">
// //                                   <Clock className="w-3 h-3" />
// //                                   <span>{internship.duration || "Not specified"}</span>
// //                                 </div>

// //                                 <div className="flex items-center space-x-1 text-xs text-muted-foreground">
// //                                   <MapPin className="w-3 h-3" />
// //                                   <span>{internship.location || "Remote"}</span>
// //                                 </div>
// //                               </CardContent>
// //                             </Card>
// //                           );
// //                         })}
// //                       </div>

// //                       <Button variant="outline" size="icon" onClick={nextInternship} className="flex-shrink-0">
// //                         <ChevronRight className="w-4 h-4" />
// //                       </Button>
// //                     </div>
// //                   </div>
// //                 )}
// //               </Card>
// //             </section>

// //             {/* Advertisement placeholder */}
// //             <Card className="bg-gradient-to-r from-blue-100 to-blue-200 border-0">
// //               <CardContent className="p-8 text-center">
// //                 <h3 className="text-lg font-bold mb-2">Advertisement Space</h3>
// //                 <p className="text-sm text-muted-foreground">Featured content and promotions</p>
// //               </CardContent>
// //             </Card>

// //             {/* Certified Courses */}
// //             <section>
// //               <Card className="p-6 bg-white shadow-sm border border-gray-200 rounded-3xl">
// //                 <div className="flex items-center justify-between mb-6">
// //                   <h2 className="text-xl font-semibold">Certified Courses for you</h2>
// //                   <Button variant="link" className="text-primary p-0 h-auto" onClick={() => navigate("/courses")}>
// //                     View all
// //                   </Button>
// //                 </div>

// //                 {coursesLoading ? (
// //                   <div className="flex justify-center py-8">
// //                     <Loader2 className="w-8 h-8 animate-spin text-primary" />
// //                   </div>
// //                 ) : recommendedCourses.length === 0 ? (
// //                   <p className="text-center text-muted-foreground py-8">No courses available</p>
// //                 ) : (
// //                   <div className="relative">
// //                     <div className="flex items-center space-x-4">
// //                       <Button variant="outline" size="icon" onClick={prevCourse} className="flex-shrink-0">
// //                         <ChevronLeft className="w-4 h-4" />
// //                       </Button>

// //                       <div className="flex-1 grid md:grid-cols-3 gap-4">
// //                         {[0, 1, 2].map((offset) => {
// //                           const index = (currentCourseIndex + offset) % recommendedCourses.length;
// //                           const course = recommendedCourses[index];

// //                           if (!course) return null;

// //                           const gradients = [
// //                             "bg-gradient-to-br from-blue-900 to-purple-900",
// //                             "bg-gradient-to-br from-purple-800 to-orange-600",
// //                             "bg-gradient-to-br from-cyan-500 to-blue-600",
// //                           ];
// //                           const gradientClass = gradients[offset % gradients.length];

// //                           return (
// //                             <Card
// //                               key={`${course.id}-${index}-${Math.random()}`}
// //                               className="shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden"
// //                               onClick={() => navigate("/courses")}
// //                             >
// //                               <div className={`h-32 ${gradientClass} flex items-center justify-center`}>
// //                                 <div className="text-white text-sm font-bold text-center px-4">{course.title}</div>
// //                               </div>

// //                               <CardContent className="p-4">
// //                                 <h3 className="font-semibold text-sm mb-1">{course.title}</h3>
// //                                 <p className="text-xs text-muted-foreground">{course.provider || "Online Course"}</p>
// //                                 {course.difficulty_level && (
// //                                   <Badge variant="secondary" className="mt-2 text-xs">
// //                                     {course.difficulty_level}
// //                                   </Badge>
// //                                 )}
// //                               </CardContent>
// //                             </Card>
// //                           );
// //                         })}
// //                       </div>

// //                       <Button variant="outline" size="icon" onClick={nextCourse} className="flex-shrink-0">
// //                         <ChevronRight className="w-4 h-4" />
// //                       </Button>
// //                     </div>
// //                   </div>
// //                 )}
// //               </Card>
// //             </section>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default Dashboard;
