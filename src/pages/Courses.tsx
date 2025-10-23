import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { Clock } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useInfiniteCourses } from "@/hooks/useInfiniteCourses";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { formatDistanceToNow } from "date-fns";

const Courses = () => {
  const [filters, setFilters] = useState({
    difficulty: [] as string[],
    duration: [] as string[],
    postedDate: "",
  });

  const { courses, loading, error, hasMore, loadMore } =
    useInfiniteCourses(filters);
  const { observerTarget } = useInfiniteScroll({
    loading,
    hasMore,
    onLoadMore: loadMore,
  });

  const difficultyLevels = ["Beginner", "Intermediate", "Advanced"];
  const durations = ["1-4 weeks", "5-8 weeks", "9-12 weeks", "12+ weeks"];
  const postedDates = [
    { value: "today", label: "Today" },
    { value: "week", label: "Past Week" },
    { value: "month", label: "Past Month" },
    { value: "", label: "All Time" },
  ];

  const toggleFilter = (category: "difficulty" | "duration", value: string) => {
    console.log("[Courses] Toggle filter:", category, value);
    setFilters((prev) => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter((v) => v !== value)
        : [...prev[category], value],
    }));
  };

  const setPostedDateFilter = (value: string) => {
    console.log("[Courses] Set posted date filter:", value);
    setFilters((prev) => ({ ...prev, postedDate: value }));
  };

  const resetFilters = () => {
    console.log("[Courses] Reset all filters");
    setFilters({ difficulty: [], duration: [], postedDate: "" });
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
        <div className="flex gap-6 py-6">
          {/* Left Sidebar - Filters */}
          <div className="w-80 bg-card border rounded-3xl p-6 h-fit sticky top-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Filters</h2>
              <Button
                variant="ghost"
                className="text-primary hover:text-primary/80 text-sm font-medium"
                onClick={resetFilters}
              >
                Reset all
              </Button>
            </div>

            {/* Course Level Filter */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-muted-foreground mb-3">
                Course Level
              </h3>
              <div className="space-y-3">
                {difficultyLevels.map((level) => (
                  <div key={level} className="flex items-center space-x-2">
                    <Checkbox
                      id={`difficulty-${level}`}
                      checked={filters.difficulty.includes(level)}
                      onCheckedChange={() => toggleFilter("difficulty", level)}
                    />
                    <label
                      htmlFor={`difficulty-${level}`}
                      className="text-sm font-medium cursor-pointer"
                    >
                      {level}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Posted Date Filter */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-muted-foreground mb-3">
                Posted Date
              </h3>
              <div className="space-y-3">
                {postedDates.map((date) => (
                  <div key={date.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`posted-${date.value}`}
                      checked={filters.postedDate === date.value}
                      onCheckedChange={() => setPostedDateFilter(date.value)}
                    />
                    <label
                      htmlFor={`posted-${date.value}`}
                      className="text-sm font-medium cursor-pointer"
                    >
                      {date.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Duration Filter */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-muted-foreground mb-3">
                Duration
              </h3>
              <div className="space-y-3">
                {durations.map((duration) => (
                  <div key={duration} className="flex items-center space-x-2">
                    <Checkbox
                      id={`duration-${duration}`}
                      checked={filters.duration.includes(duration)}
                      onCheckedChange={() => toggleFilter("duration", duration)}
                    />
                    <label
                      htmlFor={`duration-${duration}`}
                      className="text-sm font-medium cursor-pointer"
                    >
                      {duration}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <Button
              className="w-full rounded-full border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all"
              variant="outline"
              onClick={resetFilters}
            >
              Apply
            </Button>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="mb-6">
              <h1 className="text-3xl font-bold">
                Explore {courses.length} Courses
              </h1>
            </div>

            {error && (
              <div className="text-center py-8">
                <p className="text-destructive">{error}</p>
              </div>
            )}

            {/* Courses Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {courses.map((course) => {
                const gradients = [
                  "bg-gradient-to-br from-lime-400 to-green-600",
                  "bg-gradient-to-br from-purple-500 to-pink-600",
                  "bg-gradient-to-br from-blue-500 to-cyan-400",
                  "bg-gradient-to-br from-orange-500 to-red-600",
                  "bg-gradient-to-br from-teal-500 to-blue-600",
                  "bg-gradient-to-br from-yellow-500 to-orange-600",
                ];
                const gradient =
                  gradients[Math.floor(Math.random() * gradients.length)];

                return (
                  <Card
                    key={course.id}
                    className="overflow-hidden rounded-3xl hover:shadow-lg transition-all"
                  >
                    {/* Course Image/Gradient Header */}
                    <div
                      className={`h-40 ${gradient} relative flex items-center justify-center`}
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
                      <Badge className="absolute top-3 right-3 bg-white/90 text-foreground hover:bg-white">
                        {formatDistanceToNow(new Date(course.created_at), {
                          addSuffix: true,
                        })}
                      </Badge>
                    </div>

                    <CardContent className="p-4 space-y-3">
                      {/* Duration and Level */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>{course.duration || "8 weeks"}</span>
                        </div>
                        {course.difficulty_level && (
                          <Badge
                            className={`${getDifficultyColor(
                              course.difficulty_level
                            )} text-white`}
                          >
                            {course.difficulty_level}
                          </Badge>
                        )}
                      </div>

                      {/* Title */}
                      <h3 className="font-bold text-lg line-clamp-2">
                        {course.title}
                      </h3>

                      {/* Description */}
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {course.description ||
                          "Build your skills with this comprehensive course..."}
                      </p>

                      {/* Know More Button */}
                      <Button
                        className="w-full rounded-full border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all"
                        variant="outline"
                      >
                        Know more
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}

              {/* Loading Skeletons */}
              {loading &&
                Array.from({ length: 6 }).map((_, i) => (
                  <Card
                    key={`skeleton-${i}`}
                    className="overflow-hidden rounded-3xl"
                  >
                    <Skeleton className="h-40 w-full" />
                    <CardContent className="p-4 space-y-3">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-20 w-full" />
                      <Skeleton className="h-10 w-full rounded-full" />
                    </CardContent>
                  </Card>
                ))}
            </div>

            {/* Infinite scroll trigger */}
            <div ref={observerTarget} className="h-10 mt-8" />

            {!loading && !hasMore && courses.length > 0 && (
              <p className="text-center text-muted-foreground mt-8">
                No more courses to load
              </p>
            )}

            {!loading && courses.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  No courses found matching your filters.
                </p>
                <Button
                  variant="outline"
                  onClick={resetFilters}
                  className="mt-4"
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Courses;
