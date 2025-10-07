import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Clock, MapPin, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import ProfileSidebar from "@/components/ProfileSidebar";
import { useInternships } from "@/hooks/useInternships";
import { useCourses } from "@/hooks/useCourses";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentInternshipIndex, setCurrentInternshipIndex] = useState(0);
  const [currentCourseIndex, setCurrentCourseIndex] = useState(0);

  const { internships, loading: internshipsLoading } = useInternships();
  const { courses, loading: coursesLoading } = useCourses();

  // Take only the first 6 items for recommendations
  const recommendedInternships = internships.slice(0, 6);
  const recommendedCourses = courses.slice(0, 6);

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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Profile */}
          <div className="lg:col-span-1">
            <ProfileSidebar />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Hero Section */}
            <div className="grid md:grid-cols-3 gap-4">
              {heroCards.map((card) => (
                <Card key={card.id} className={`${card.color} border-0 shadow-sm`}>
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
                      <Button variant="outline" size="icon" onClick={prevInternship} className="flex-shrink-0">
                        <ChevronLeft className="w-4 h-4" />
                      </Button>

                      <div className="flex-1 grid md:grid-cols-3 gap-4">
                        {[0, 1, 2].map((offset) => {
                          const index = (currentInternshipIndex + offset) % recommendedInternships.length;
                          const internship = recommendedInternships[index];

                          if (!internship) return null;

                          const colors = [
                            "bg-green-100 border-green-200",
                            "bg-blue-100 border-blue-200",
                            "bg-purple-100 border-purple-200",
                          ];
                          const colorClass = colors[offset % colors.length];
                          const initial = internship.company_name?.charAt(0) || "C";
                          const daysAgo = Math.floor(
                            (Date.now() - new Date(internship.created_at).getTime()) / (1000 * 60 * 60 * 24),
                          );
                          const timeText = daysAgo === 0 ? "Today" : daysAgo === 1 ? "1d ago" : `${daysAgo}d ago`;

                          return (
                            <Card
                              key={internship.id}
                              className={`${colorClass} shadow-sm hover:shadow-md transition-shadow cursor-pointer`}
                              onClick={() => navigate("/internships")}
                            >
                              <CardHeader className="pb-3">
                                <div className="flex justify-between items-start mb-2">
                                  <Badge variant="secondary" className="text-xs">
                                    {timeText}
                                  </Badge>
                                  <div className="w-8 h-8 bg-foreground rounded-full flex items-center justify-center text-background font-bold text-sm">
                                    {initial}
                                  </div>
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

                      <Button variant="outline" size="icon" onClick={nextInternship} className="flex-shrink-0">
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            </section>

            {/* Advertisement placeholder */}
            <Card className="bg-gradient-to-r from-blue-100 to-blue-200 border-0">
              <CardContent className="p-8 text-center">
                <h3 className="text-lg font-bold mb-2">Advertisement Space</h3>
                <p className="text-sm text-muted-foreground">Featured content and promotions</p>
              </CardContent>
            </Card>

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
                      <Button variant="outline" size="icon" onClick={prevCourse} className="flex-shrink-0">
                        <ChevronLeft className="w-4 h-4" />
                      </Button>

                      <div className="flex-1 grid md:grid-cols-3 gap-4">
                        {[0, 1, 2].map((offset) => {
                          const index = (currentCourseIndex + offset) % recommendedCourses.length;
                          const course = recommendedCourses[index];

                          if (!course) return null;

                          const gradients = [
                            "bg-gradient-to-br from-blue-900 to-purple-900",
                            "bg-gradient-to-br from-purple-800 to-orange-600",
                            "bg-gradient-to-br from-cyan-500 to-blue-600",
                          ];
                          const gradientClass = gradients[offset % gradients.length];

                          return (
                            <Card
                              key={course.id}
                              className="shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden"
                              onClick={() => navigate("/courses")}
                            >
                              <div className={`h-32 ${gradientClass} flex items-center justify-center`}>
                                <div className="text-white text-sm font-bold text-center px-4">{course.title}</div>
                              </div>

                              <CardContent className="p-4">
                                <h3 className="font-semibold text-sm mb-1">{course.title}</h3>
                                <p className="text-xs text-muted-foreground">{course.provider || "Online Course"}</p>
                                {course.difficulty_level && (
                                  <Badge variant="secondary" className="mt-2 text-xs">
                                    {course.difficulty_level}
                                  </Badge>
                                )}
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>

                      <Button variant="outline" size="icon" onClick={nextCourse} className="flex-shrink-0">
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
