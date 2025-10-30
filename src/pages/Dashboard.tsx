import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Loader2,
  BookmarkCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import ProfileSidebar from "@/components/ProfileSidebar";
import { useIntern } from "@/hooks/useInternships";
import { useUnits } from "@/hooks/useUnits";
import { useCourses } from "@/hooks/useCourses";
import {
  useInternshipRecommendations,
  useCourseRecommendations,
} from "@/hooks/useRecommendations";
import { useSavedInternships } from "@/hooks/useSavedInternships";
import { useAppliedInternships } from "@/hooks/useAppliedInternships";
import { supabase } from "@/integrations/supabase/client";
import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  formatDistanceToNow,
} from "date-fns";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentInternshipIndex, setCurrentInternshipIndex] = useState(0);
  const [currentCourseIndex, setCurrentCourseIndex] = useState(0);

  const [userSkills, setUserSkills] = useState<string[]>([]);
  const [activityView, setActivityView] = useState<"saved" | "applied">(
    "saved"
  );

  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);

  const nextActivity = (activities: any[]) => {
    setCurrentActivityIndex((prev) =>
      prev + 3 >= activities.length ? 0 : prev + 3
    );
  };

  const prevActivity = (activities: any[]) => {
    setCurrentActivityIndex((prev) =>
      prev === 0 ? Math.max(activities.length - 3, 0) : prev - 3
    );
  };

  const { internships, loading: internshipsLoading } = useIntern();
  const { units } = useUnits();
  const { courses, loading: coursesLoading } = useCourses();
  const { savedInternships, loading: savedLoading } = useSavedInternships();
  const { appliedInternships, loading: appliedLoading } =
    useAppliedInternships();

  // Fetch user skills for recommendations
  useEffect(() => {
    const fetchUserSkills = async () => {
      if (!user) return;

      try {
        const { data: profile } = await supabase
          .from("profiles")
          .select("id")
          .eq("user_id", user.id)
          .maybeSingle();

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
                skills = Array.isArray(parsed)
                  ? parsed
                  : studentProfile.skills.split(",").map((s) => s.trim());
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
  const recommendedInternships = useInternshipRecommendations(
    internships,
    userSkills
  );

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
    setCurrentInternshipIndex((prev) =>
      prev === recommendedInternships.length - 1 ? 0 : prev + 1
    );
  };

  const prevInternship = () => {
    setCurrentInternshipIndex((prev) =>
      prev === 0 ? recommendedInternships.length - 1 : prev - 1
    );
  };

  const nextCourse = () => {
    setCurrentCourseIndex((prev) =>
      prev === recommendedCourses.length - 1 ? 0 : prev + 1
    );
  };

  const prevCourse = () => {
    setCurrentCourseIndex((prev) =>
      prev === 0 ? recommendedCourses.length - 1 : prev - 1
    );
  };
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container px-4 sm:px-6 lg:px-[7.5rem] py-4 lg:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-2.5">
          {/* Left Sidebar - Profile - Fixed */}
          <div className="hidden md:block lg:col-span-1 mb-4 lg:mb-0">
            <div className="lg:sticky lg:top-8">
              <ProfileSidebar savedCount={savedInternships.length} />
            </div>
          </div>

          {/* Main Content - Scrollable */}
          <div
            className="lg:col-span-3 space-y-2.5 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto lg:pr-2"
            style={{ scrollbarWidth: "thin" }}
          >
            {/* Hero Section */}
            <div className="flex overflow-x-auto gap-4  sm:grid-col-1 sm:grid-cols-2 md:grid-cols-3 [&::-webkit-scrollbar]:w-0">
              {heroCards.map((card) => (
                <Card
                  key={card.id}
                  className={` ${card.color} border-0 shadow-sm rounded-3xl w-[100vw] min-w-[92vw] snap-center md:w-auto md:min-w-0 lg:flex-1 `}
                >
                  <CardContent className="p-6">
                    <div className="min-h-[120px] flex flex-col justify-center">
                      <h3 className="font-bold text-sm mb-2">{card.title}</h3>
                      {card.subtitle && (
                        <p className="text-xs text-muted-foreground mb-1">
                          {card.subtitle}
                        </p>
                      )}
                      {card.speaker && (
                        <p className="text-xs text-muted-foreground">
                          {card.speaker}
                        </p>
                      )}
                      {card.type && (
                        <Badge
                          variant="secondary"
                          className="w-fit text-xs mt-2"
                        >
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
              <Card className="p-6 bg-white shadow-sm border-none md:border md:border-gray-200 rounded-3xl ">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Recommended for you</h2>
                  <Button
                    variant="link"
                    className="text-primary p-0 h-auto"
                    onClick={() => navigate("/recommended-internships")}
                  >
                    View all
                  </Button>
                </div>

                {internshipsLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                ) : recommendedInternships.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No internships available
                  </p>
                ) : (
                  <div className="relative">
                    <div className="flex items-center space-x-2 sm:space-x-4">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={prevInternship}
                        className="flex-shrink-0 rounded-full hidden sm:flex"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>

                      <div
                        className=" flex overflow-x-auto gap-4 snap-x snap-mandatory
    sm:grid sm:grid-cols-2
    md:grid-cols-3
    [&::-webkit-scrollbar]:w-0
    px-1"
                      >
                        {recommendedInternships
                          .slice(
                            currentInternshipIndex,
                            currentInternshipIndex + 3
                          )
                          .map((internship, idx) => {
                            if (!internship) return null;

                            const colors = [
                              "bg-[#F4FFD5] border-[#AAD23C]",
                              "bg-[#E8EFFF] border-[#5A80D8]",
                              "bg-[#DAC8FF] border-[#7752C5]",
                            ];
                            const colorClass = colors[idx % colors.length];
                            const initial =
                              internship.company_name?.charAt(0) || "C";
                            const daysAgo = Math.floor(
                              (Date.now() -
                                new Date(internship.created_at).getTime()) /
                                (1000 * 60 * 60 * 24)
                            );
                            const timeText =
                              daysAgo === 0
                                ? "Today"
                                : daysAgo === 1
                                ? "1d ago"
                                : `${daysAgo}d ago`;

                            const matchingUnit = units.find(
                              (unit) =>
                                unit.profile_id === internship.created_by
                            );

                            return (
                              <Card
                                key={internship.id}
                                className={`${colorClass} shadow-sm hover:shadow-md transition-shadow cursor-pointer rounded-xl  min-w-[60vw] snap-center md:w-auto md:min-w-0 lg:flex-1 [&::-webkit-scrollbar]:w-0`}
                                onClick={() =>
                                  navigate(
                                    `/recommended-internships?id=${internship.id}`
                                  )
                                }
                              >
                                <CardHeader className="pb-2.5 color">
                                  <div className="flex justify-between items-start mb-2">
                                    <div className="w-8 h-8 bg-foreground rounded-full flex items-center justify-center text-background font-bold text-sm">
                                      {matchingUnit?.avatar_url ? (
                                        <img
                                          src={matchingUnit.avatar_url}
                                          alt={matchingUnit.unit_name}
                                          className="w-full h-full rounded-full object-cover"
                                        />
                                      ) : (
                                        initial
                                      )}
                                    </div>
                                    <Badge className="text-xs bg-transparent text-gray-600">
                                      {timeText}
                                    </Badge>
                                  </div>
                                  <CardTitle className=" m-0 text-gray-800 text-base font-normal flex justify-between items-center">
                                    {internship.title}
                                    <ChevronRight className="w-5 h-5" />
                                  </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                  <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                                    <Clock className="w-3 h-3" />
                                    <span>
                                      {internship.duration || "Not specified"}
                                    </span>
                                  </div>
                                  {/* <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                                    <MapPin className="w-3 h-3" />
                                    <span>
                                      {internship.location || "Remote"}
                                    </span>
                                  </div> */}
                                </CardContent>
                              </Card>
                            );
                          })}
                      </div>

                      <Button
                        variant="outline"
                        size="icon"
                        onClick={nextInternship}
                        className="flex-shrink-0 rounded-full hidden sm:flex"
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
              <Card className="p-6 bg-white shadow-sm border-none md:border md:border-gray-200 rounded-3xl">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">
                    Certified Courses for you
                  </h2>
                  <Button
                    variant="link"
                    className="text-primary p-0 h-auto"
                    onClick={() => navigate("/courses")}
                  >
                    View all
                  </Button>
                </div>

                {coursesLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                ) : recommendedCourses.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No courses available
                  </p>
                ) : (
                  <div className="relative">
                    <div className="flex items-center space-x-2 sm:space-x-4">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={prevCourse}
                        className="flex-shrink-0 rounded-full hidden sm:flex"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <div
                        className="flex overflow-x-auto gap-4 snap-x snap-mandatory
    sm:grid sm:grid-cols-2
    md:grid-cols-3
    hide-scrollbar [&::-webkit-scrollbar]:w-0"
                      >
                        {recommendedCourses
                          .slice(currentCourseIndex, currentCourseIndex + 3)
                          .map((course, idx) => {
                            if (!course) return null;

                            const gradients = [
                              "bg-gradient-to-br from-blue-900 to-purple-900",
                              "bg-gradient-to-br from-purple-800 to-orange-600",
                              "bg-gradient-to-br from-cyan-500 to-blue-600",
                            ];
                            const gradientClass =
                              gradients[idx % gradients.length];

                            return (
                              <Card
                                key={course.id}
                                className="overflow-hidden rounded-3xl hover:shadow-lg transition-all min-w-[60vw] snap-center md:w-auto md:min-w-0 lg:flex-1 "
                                onClick={() => navigate("/courses")}
                              >
                                <div
                                  className={`h-32 relative ${gradientClass} max-h-28 flex items-center justify-center`}
                                >
                                  {course.image_url ? (
                                    <img
                                      src={course.image_url}
                                      alt={course.title}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="text-white text-center">
                                      <h3 className="text-2xl font-bold">
                                        {course.category || "Course"}
                                      </h3>
                                    </div>
                                  )}
                                  {/* Time ago badge */}
                                  {course.created_at ? (
                                    <Badge className="absolute top-3 right-3 bg-white/90 text-foreground hover:bg-white">
                                      {formatDistanceToNow(
                                        new Date(course.created_at),
                                        { addSuffix: true }
                                      )}
                                    </Badge>
                                  ) : (
                                    "Time"
                                  )}
                                </div>

                                <CardContent className="px-5 py-2.5 space-y-2">
                                  {/* Title */}

                                  {course.title ? (
                                    <h3 className="font-medium text-base line-clamp-2">
                                      {course.title.length > 20
                                        ? `${course.title.slice(0, 18)}...`
                                        : course.title}
                                    </h3>
                                  ) : (
                                    "Title"
                                  )}

                                  {/* Duration and Level */}
                                  <div className="flex items-center justify-between">
                                    <div className="flex m-0 items-center gap-1 text-sm text-muted-foreground">
                                      <Clock className="w-4 h-4" />
                                      <span>
                                        {course.duration || "8 weeks"}
                                      </span>
                                    </div>
                                    {/* {course.difficulty_level && (
                                      <Badge
                                        className={`${getDifficultyColor(
                                          course.difficulty_level
                                        )} text-white`}
                                      >
                                        {course.difficulty_level}
                                      </Badge>
                                    )} */}
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
                                  <button className="border-none flex gap-1 items-center p-0 m-0 text-sm text-primary hover:bg-transparent hover:text-primary">
                                    Know more
                                    <ChevronRight className="w-4 h-4" />
                                  </button>
                                </CardContent>
                              </Card>
                            );
                          })}
                      </div>

                      <Button
                        variant="outline"
                        size="icon"
                        onClick={nextCourse}
                        className="flex-shrink-0 rounded-full hidden md:block"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            </section>

            {/* Your Activity Section */}
            <section>
              <Card className="p-6 bg-white shadow-sm border-none md:border md:border-gray-200 rounded-3xl">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Your Activity</h2>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => setActivityView("saved")}
                      className={`rounded-full bg-transparent ${
                        activityView === "saved"
                          ? "text-gray-600 underline underline-offset-8"
                          : "text-gray-400"
                      }`}
                    >
                      Saved
                    </Button>
                    <Button
                      onClick={() => setActivityView("applied")}
                      className={`rounded-full bg-transparent ${
                        activityView === "applied"
                          ? "text-gray-600 underline underline-offset-8"
                          : "text-gray-400"
                      }`}
                    >
                      Applied
                    </Button>
                  </div>
                </div>

                {(activityView === "saved" ? savedLoading : appliedLoading) ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                ) : (activityView === "saved"
                    ? savedInternships
                    : appliedInternships
                  ).length === 0 ? (
                  <div className="text-center py-12">
                    <BookmarkCheck className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                      No {activityView} internships yet
                    </p>
                  </div>
                ) : (
                  <div className="relative">
                    <div className="flex items-center space-x-4">
                      {/* Left Button */}
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          prevActivity(
                            activityView === "saved"
                              ? savedInternships
                              : appliedInternships
                          )
                        }
                        className="flex-shrink-0 rounded-full hidden md:block"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>

                      {/* Activity Cards */}
                      <div
                        className="flex overflow-x-auto gap-4 snap-x snap-mandatory
    sm:grid sm:grid-cols-2
    md:grid-cols-3
    hide-scrollbar
    px-1 [&::-webkit-scrollbar]:w-0"
                      >
                        {(activityView === "saved"
                          ? savedInternships
                          : appliedInternships
                        )
                          .slice(currentActivityIndex, currentActivityIndex + 3)
                          .map((internship) => {
                            const dateToUse =
                              activityView === "saved"
                                ? (internship as any).saved_at
                                : (internship as any).applied_at;

                            const getShortTimeAgo = (date: string | Date) => {
                              const now = new Date();
                              const past = new Date(date);

                              const days = differenceInDays(now, past);
                              if (days > 0) return `${days}d`;

                              const hours = differenceInHours(now, past);
                              if (hours > 0) return `${hours}h`;

                              const minutes = differenceInMinutes(now, past);
                              if (minutes > 0) return `${minutes}m`;

                              return "just now";
                            };

                            const timeAgo = getShortTimeAgo(dateToUse);

                            const matchingUnit = units.find(
                              (unit) =>
                                unit.profile_id === internship.created_by
                            );

                            return (
                              <Card
                                key={internship.id}
                                className="px-5 py-4 hover:shadow-lg transition-all cursor-pointer rounded-xl border border-gray-300 min-w-[60vw]"
                                onClick={() =>
                                  navigate(`/internships/${internship.id}`)
                                }
                              >
                                <div className="space-y-2">
                                  <div className="flex items-start justify-between">
                                    <div className="w-8 h-8 bg-foreground rounded-full flex items-center justify-center text-background font-bold">
                                      {matchingUnit?.avatar_url ? (
                                        <img
                                          src={matchingUnit.avatar_url}
                                          alt={matchingUnit.unit_name}
                                          className="w-full h-full rounded-full object-cover"
                                        />
                                      ) : (
                                        internship.company_name?.charAt(0) ||
                                        "C"
                                      )}
                                    </div>
                                    <Badge className="bg-primary text-primary-foreground">
                                      {activityView === "saved"
                                        ? "Saved"
                                        : "Applied"}{" "}
                                      {`${timeAgo} ago`}
                                    </Badge>
                                  </div>

                                  {internship.title ? (
                                    <h3 className="text-4 font-semibold text-gray-900 line-clamp-2">
                                      {internship.title.length > 20
                                        ? `${internship.title.slice(0, 21)}...`
                                        : internship.title}
                                    </h3>
                                  ) : (
                                    "Title"
                                  )}

                                  <p className="text-sm text-gray-500 line-clamp-3">
                                    {internship.description ||
                                      "No description available"}
                                  </p>
                                  <div className="flex items-center gap-4 text-sm text-gray-600">
                                    <div className="flex items-center gap-1">
                                      <Clock className="w-4 h-4" />
                                      <span>
                                        {internship.duration || "Not specified"}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </Card>
                            );
                          })}
                      </div>

                      {/* Right Button */}
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          nextActivity(
                            activityView === "saved"
                              ? savedInternships
                              : appliedInternships
                          )
                        }
                        className="flex-shrink-0 rounded-full hidden md:block"
                      >
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
